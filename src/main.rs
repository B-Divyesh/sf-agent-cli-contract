use clap::{Parser, Subcommand};
use portable_pty::{CommandBuilder, PtySize, native_pty_system};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::thread;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use wait_timeout::ChildExt;

const VERSION: &str = env!("CARGO_PKG_VERSION");
const SCHEMA: &str = include_str!("../examples/schema.json");
#[cfg(target_os = "linux")]
const NETWORK_GUARD: &[u8] = include_bytes!(concat!(env!("OUT_DIR"), "/network_guard.so"));

#[derive(Parser)]
#[command(name = "agent-contract", version, about = "Test stable machine contracts for CLIs", long_about = None)]
struct Cli {
    /// Print the command result as JSON.
    #[arg(long, global = true)]
    json: bool,
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Run a contract suite and write Markdown and JSON reports.
    Check {
        #[arg(default_value = "agent-contract.yml")]
        contract: PathBuf,
        /// Approve current output as the snapshot baseline.
        #[arg(long)]
        accept: bool,
        /// Override the report directory.
        #[arg(long)]
        report_dir: Option<PathBuf>,
    },
    /// Write a documented starter contract.
    Init {
        #[arg(default_value = "agent-contract.yml")]
        path: PathBuf,
        /// Executable to test. Fixed arguments may follow it.
        #[arg(long, required = true, num_args = 1.., allow_hyphen_values = true)]
        command: Vec<String>,
    },
    /// Run the bundled sample in a disposable directory.
    Demo,
    /// Print the version 1 contract JSON Schema.
    Schema,
    #[command(hide = true)]
    FixtureTarget {
        #[arg(long, default_value = "text")]
        mode: String,
        #[arg(long)]
        fail: bool,
        #[arg(long)]
        recover: bool,
    },
    /// Start a declared fixture with outbound network syscalls denied.
    #[command(hide = true)]
    NetworkDeniedExec {
        /// Executable from the contract.
        executable: String,
        /// Arguments supplied by the contract.
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Contract {
    version: u32,
    command: Vec<String>,
    #[serde(default)]
    modes: BTreeMap<String, Vec<String>>,
    fixtures: Vec<Fixture>,
    #[serde(default)]
    env: BTreeMap<String, String>,
    #[serde(default)]
    redact_env: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Fixture {
    name: String,
    #[serde(default)]
    args: Vec<String>,
    #[serde(default = "default_modes")]
    modes: Vec<String>,
    #[serde(default)]
    stdin: Option<String>,
    #[serde(default)]
    env: BTreeMap<String, String>,
    #[serde(default)]
    files: BTreeMap<String, String>,
    #[serde(default)]
    expect: Expect,
    #[serde(default)]
    recover_args: Option<Vec<String>>,
    #[serde(default)]
    idempotent: bool,
    #[serde(default)]
    detect_nondeterminism: bool,
    #[serde(default)]
    allow_nondeterministic_fields: Vec<String>,
    #[serde(default)]
    allow_network: bool,
    #[serde(default = "default_timeout_ms")]
    timeout_ms: u64,
}

#[derive(Debug, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Expect {
    #[serde(default)]
    exit: i32,
    #[serde(default)]
    stdout_contains: Vec<String>,
    #[serde(default)]
    stderr_contains: Vec<String>,
    #[serde(default)]
    error_code: Option<String>,
}

fn default_modes() -> Vec<String> {
    vec!["text".into()]
}

fn default_timeout_ms() -> u64 {
    10_000
}

#[derive(Debug, Clone)]
struct Captured {
    exit: i32,
    stdout: String,
    stderr: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct SuiteReport {
    tool_version: String,
    contract: String,
    passed: bool,
    summary: Summary,
    checks: Vec<CheckReport>,
}

#[derive(Debug, Deserialize, Serialize)]
struct Summary {
    passed: usize,
    failed: usize,
    snapshots_written: usize,
}

#[derive(Debug, Deserialize, Serialize)]
struct CheckReport {
    fixture: String,
    mode: String,
    passed: bool,
    exit: Option<i32>,
    findings: Vec<String>,
}

fn main() {
    let cli = Cli::parse();
    let result = match cli.command {
        Commands::Check {
            contract,
            accept,
            report_dir,
        } => check_command(&contract, accept, report_dir.as_deref(), cli.json, true),
        Commands::Init { path, command } => init_command(&path, &command, cli.json),
        Commands::Demo => demo_command(cli.json),
        Commands::Schema => {
            println!("{SCHEMA}");
            Ok(())
        }
        Commands::FixtureTarget {
            mode,
            fail,
            recover,
        } => fixture_target(&mode, fail, recover),
        Commands::NetworkDeniedExec { executable, args } => network_denied_exec(&executable, &args),
    };

    if let Err((code, message)) = result {
        if cli.json && code != 1 {
            println!(
                "{}",
                serde_json::json!({"ok": false, "error": message, "exit": code})
            );
        } else {
            eprintln!("agent-contract: {message}");
        }
        std::process::exit(code);
    }
}

fn init_command(path: &Path, command: &[String], json: bool) -> Result<(), (i32, String)> {
    if path.exists() {
        return Err((
            2,
            format!("{} already exists; choose another path", path.display()),
        ));
    }
    let quoted = command
        .iter()
        .map(|part| serde_json::to_string(part).unwrap())
        .collect::<Vec<_>>()
        .join(", ");
    let content = format!(
        "# Agent CLI Contract v1\nversion: 1\ncommand: [{quoted}]\nmodes:\n  text: []\n  tty: [\"--color=always\"]\n  json: [\"--json\"]\nfixtures:\n  - name: help stays stable\n    args: [\"--help\"]\n    modes: [text]\n    expect:\n      exit: 0\n      stdout_contains: [\"Usage\"]\n    idempotent: true\n    detect_nondeterminism: true\n    allow_network: false\n"
    );
    fs::write(path, content)
        .map_err(|error| (2, format!("could not write {}: {error}", path.display())))?;
    if json {
        println!("{}", serde_json::json!({"ok": true, "contract": path}));
    } else {
        println!(
            "Wrote {}\nNext: agent-contract check {} --accept",
            path.display(),
            path.display()
        );
    }
    Ok(())
}

fn check_command(
    contract_path: &Path,
    accept: bool,
    report_override: Option<&Path>,
    json: bool,
    emit: bool,
) -> Result<(), (i32, String)> {
    let source = fs::read_to_string(contract_path).map_err(|error| {
        (
            2,
            format!("could not read {}: {error}", contract_path.display()),
        )
    })?;
    let contract: Contract = serde_yaml::from_str(&source).map_err(|error| {
        (
            2,
            format!(
                "{} is not a valid contract: {error}",
                contract_path.display()
            ),
        )
    })?;
    validate_contract(&contract).map_err(|message| (2, message))?;
    let base = contract_path.parent().unwrap_or_else(|| Path::new("."));
    let snapshot_dir = base.join("snapshots");
    let report_dir = report_override
        .map(PathBuf::from)
        .unwrap_or_else(|| base.join(".agent-contract"));
    fs::create_dir_all(&report_dir)
        .map_err(|error| (2, format!("could not create report directory: {error}")))?;
    if accept {
        fs::create_dir_all(&snapshot_dir)
            .map_err(|error| (2, format!("could not create snapshot directory: {error}")))?;
    }

    let mut checks = Vec::new();
    let mut snapshots_written = 0usize;
    for fixture in &contract.fixtures {
        for mode in &fixture.modes {
            let (check, written) = check_fixture(&contract, fixture, mode, &snapshot_dir, accept);
            snapshots_written += written;
            checks.push(check);
        }
    }
    let passed_count = checks.iter().filter(|check| check.passed).count();
    let failed_count = checks.len() - passed_count;
    let report = SuiteReport {
        tool_version: VERSION.into(),
        contract: contract_path.display().to_string(),
        passed: failed_count == 0,
        summary: Summary {
            passed: passed_count,
            failed: failed_count,
            snapshots_written,
        },
        checks,
    };
    write_reports(&report_dir, &report).map_err(|message| (2, message))?;

    if emit && json {
        println!("{}", serde_json::to_string(&report).unwrap());
    } else if emit {
        println!(
            "{} {} checks",
            if report.passed { "PASS" } else { "FAIL" },
            report.summary.passed + report.summary.failed
        );
        for check in &report.checks {
            println!(
                "{}  {} [{}]",
                if check.passed { "✓" } else { "×" },
                check.fixture,
                check.mode
            );
            for finding in &check.findings {
                println!("   {finding}");
            }
        }
        println!("Report: {}", report_dir.join("report.md").display());
    }
    if report.passed {
        Ok(())
    } else {
        Err((
            1,
            "contract checks failed; read the report for the next action".into(),
        ))
    }
}

fn validate_contract(contract: &Contract) -> Result<(), String> {
    if contract.version != 1 {
        return Err(format!(
            "contract version {} is not supported; use version 1",
            contract.version
        ));
    }
    if contract.command.is_empty() || contract.command[0].trim().is_empty() {
        return Err("command must name an executable".into());
    }
    if contract.fixtures.is_empty() {
        return Err("fixtures is empty; add at least one declared command".into());
    }
    let mut names = BTreeSet::new();
    for fixture in &contract.fixtures {
        if fixture.name.trim().is_empty() {
            return Err("every fixture needs a name".into());
        }
        if !names.insert(fixture.name.clone()) {
            return Err(format!("fixture name {:?} is repeated", fixture.name));
        }
        if fixture.modes.is_empty() {
            return Err(format!(
                "fixture {:?} needs at least one mode",
                fixture.name
            ));
        }
        for mode in &fixture.modes {
            if !matches!(mode.as_str(), "text" | "tty" | "json") {
                return Err(format!(
                    "fixture {:?} uses unknown mode {mode:?}",
                    fixture.name
                ));
            }
        }
        if !(1..=300_000).contains(&fixture.timeout_ms) {
            return Err(format!(
                "fixture {:?} timeout_ms must be from 1 to 300000",
                fixture.name
            ));
        }
        for path in fixture.files.keys() {
            let path = Path::new(path);
            if path.is_absolute()
                || path
                    .components()
                    .any(|part| matches!(part, std::path::Component::ParentDir))
            {
                return Err(format!(
                    "fixture {:?} file paths must stay inside the temporary directory",
                    fixture.name
                ));
            }
        }
    }
    Ok(())
}

fn check_fixture(
    contract: &Contract,
    fixture: &Fixture,
    mode: &str,
    snapshot_dir: &Path,
    accept: bool,
) -> (CheckReport, usize) {
    let mut findings = Vec::new();
    let mut written = 0usize;
    let run = isolated_run(contract, fixture, mode);
    let captured = match run {
        Ok(output) => output,
        Err(message) => {
            return (
                CheckReport {
                    fixture: fixture.name.clone(),
                    mode: mode.into(),
                    passed: false,
                    exit: None,
                    findings: vec![message],
                },
                0,
            );
        }
    };

    if captured.exit != fixture.expect.exit {
        findings.push(format!(
            "exit was {}; expected {}",
            captured.exit, fixture.expect.exit
        ));
    }
    for text in &fixture.expect.stdout_contains {
        if !captured.stdout.contains(text) {
            findings.push(format!("stdout did not contain {text:?}"));
        }
    }
    for text in &fixture.expect.stderr_contains {
        if !captured.stderr.contains(text) {
            findings.push(format!("stderr did not contain {text:?}"));
        }
    }
    if mode == "json" {
        let parsed = serde_json::from_str::<Value>(captured.stdout.trim())
            .or_else(|_| serde_json::from_str::<Value>(captured.stderr.trim()));
        match parsed {
            Ok(value) => {
                if let Some(expected) = &fixture.expect.error_code {
                    let actual = value
                        .pointer("/error/code")
                        .or_else(|| value.get("code"))
                        .and_then(Value::as_str);
                    if actual != Some(expected) {
                        findings.push(format!(
                            "error code was {:?}; expected {expected:?}",
                            actual
                        ));
                    }
                }
            }
            Err(error) => findings.push(format!("stdout is not valid JSON: {error}")),
        }
    }

    for (stream, content) in [("stdout", &captured.stdout), ("stderr", &captured.stderr)] {
        let path = snapshot_dir.join(format!("{}.{}.{}", safe_name(&fixture.name), mode, stream));
        if accept {
            if let Err(error) = fs::write(&path, content) {
                findings.push(format!("could not write {}: {error}", path.display()));
            } else {
                written += 1;
            }
        } else {
            match fs::read_to_string(&path) {
                Ok(expected) if expected != *content => findings.push(format!(
                    "{stream} snapshot changed; run with --accept after review"
                )),
                Ok(_) => {}
                Err(error) if error.kind() == std::io::ErrorKind::NotFound => findings.push(
                    format!("{stream} snapshot is missing; run with --accept after review"),
                ),
                Err(error) => findings.push(format!("could not read {}: {error}", path.display())),
            }
        }
    }

    if fixture.detect_nondeterminism {
        match isolated_run(contract, fixture, mode) {
            Ok(second) => find_nondeterminism(
                &captured,
                &second,
                mode,
                &fixture.allow_nondeterministic_fields,
                &mut findings,
            ),
            Err(message) => findings.push(format!("repeat run failed: {message}")),
        }
    }

    if fixture.idempotent {
        if let Err(message) = check_idempotency(contract, fixture, mode) {
            findings.push(message);
        }
    }

    if let Some(recover_args) = &fixture.recover_args {
        if captured.exit == 0 {
            findings.push("recover_args is set, but the fixture did not fail".into());
        } else if let Err(message) = check_recovery(contract, fixture, mode, recover_args) {
            findings.push(message);
        }
    }

    (
        CheckReport {
            fixture: fixture.name.clone(),
            mode: mode.into(),
            passed: findings.is_empty(),
            exit: Some(captured.exit),
            findings,
        },
        written,
    )
}

fn isolated_run(contract: &Contract, fixture: &Fixture, mode: &str) -> Result<Captured, String> {
    let dir = tempfile::Builder::new()
        .prefix("agent-contract-")
        .tempdir()
        .map_err(|error| format!("could not create an isolated directory: {error}"))?;
    run_in_dir(contract, fixture, mode, &fixture.args, dir.path())
}

fn check_idempotency(contract: &Contract, fixture: &Fixture, mode: &str) -> Result<(), String> {
    let dir = tempfile::Builder::new()
        .prefix("agent-contract-idempotent-")
        .tempdir()
        .map_err(|error| format!("could not create an idempotency directory: {error}"))?;
    prepare_files(&fixture.files, dir.path())?;
    let first = execute_in_dir(contract, fixture, mode, &fixture.args, dir.path())?;
    let second = execute_in_dir(contract, fixture, mode, &fixture.args, dir.path())?;
    if first.exit != second.exit || first.stdout != second.stdout || first.stderr != second.stderr {
        Err("idempotency check changed output or exit on the second run".into())
    } else {
        Ok(())
    }
}

fn check_recovery(
    contract: &Contract,
    fixture: &Fixture,
    mode: &str,
    recover_args: &[String],
) -> Result<(), String> {
    let dir = tempfile::Builder::new()
        .prefix("agent-contract-recover-")
        .tempdir()
        .map_err(|error| format!("could not create a recovery directory: {error}"))?;
    prepare_files(&fixture.files, dir.path())?;
    let failed = execute_in_dir(contract, fixture, mode, &fixture.args, dir.path())?;
    if failed.exit == 0 {
        return Err("recovery setup did not fail".into());
    }
    let recovered = execute_in_dir(contract, fixture, mode, recover_args, dir.path())?;
    if recovered.exit != 0 {
        Err(format!(
            "recovery command exited {}; expected 0",
            recovered.exit
        ))
    } else {
        Ok(())
    }
}

fn run_in_dir(
    contract: &Contract,
    fixture: &Fixture,
    mode: &str,
    fixture_args: &[String],
    dir: &Path,
) -> Result<Captured, String> {
    prepare_files(&fixture.files, dir)?;
    execute_in_dir(contract, fixture, mode, fixture_args, dir)
}

fn execute_in_dir(
    contract: &Contract,
    fixture: &Fixture,
    mode: &str,
    fixture_args: &[String],
    dir: &Path,
) -> Result<Captured, String> {
    let mut args = contract.command.iter().skip(1).cloned().collect::<Vec<_>>();
    args.extend(contract.modes.get(mode).cloned().unwrap_or_default());
    args.extend(fixture_args.iter().cloned());
    enforce_network_policy(&contract.command[0], &args, fixture.allow_network)?;
    let mut env = contract.env.clone();
    env.extend(fixture.env.clone());
    let secrets = secret_values(&env, &contract.redact_env);
    let raw = if mode == "tty" {
        run_pty(
            &contract.command[0],
            &args,
            &env,
            fixture.stdin.as_deref(),
            dir,
            fixture.allow_network,
            fixture.timeout_ms,
        )?
    } else {
        run_pipe(
            &contract.command[0],
            &args,
            &env,
            fixture.stdin.as_deref(),
            dir,
            fixture.allow_network,
            fixture.timeout_ms,
        )?
    };
    Ok(Captured {
        exit: raw.exit,
        stdout: normalize(&raw.stdout, dir, &secrets),
        stderr: normalize(&raw.stderr, dir, &secrets),
    })
}

fn run_pipe(
    executable: &str,
    args: &[String],
    env: &BTreeMap<String, String>,
    stdin: Option<&str>,
    dir: &Path,
    allow_network: bool,
    timeout_ms: u64,
) -> Result<Captured, String> {
    let (program, command_args) = sandboxed_program(executable, args, allow_network)?;
    let mut command = Command::new(program);
    command
        .args(command_args)
        .current_dir(dir)
        .env_clear()
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    apply_env_pipe(&mut command, env, dir, allow_network);
    let mut child = command
        .spawn()
        .map_err(|error| format!("could not start {executable:?}: {error}"))?;
    if let Some(input) = stdin {
        child
            .stdin
            .take()
            .unwrap()
            .write_all(input.as_bytes())
            .map_err(|error| format!("could not write fixture stdin: {error}"))?;
    } else {
        drop(child.stdin.take());
    }
    let mut stdout = child.stdout.take().unwrap();
    let mut stderr = child.stderr.take().unwrap();
    let stdout_reader = thread::spawn(move || {
        let mut bytes = Vec::new();
        let result = stdout.read_to_end(&mut bytes);
        (result, bytes)
    });
    let stderr_reader = thread::spawn(move || {
        let mut bytes = Vec::new();
        let result = stderr.read_to_end(&mut bytes);
        (result, bytes)
    });
    let status = match child
        .wait_timeout(Duration::from_millis(timeout_ms))
        .map_err(|error| format!("could not wait for {executable:?}: {error}"))?
    {
        Some(status) => status,
        None => {
            let _ = child.kill();
            let _ = child.wait();
            return Err(format!("command timed out after {timeout_ms} ms"));
        }
    };
    let (stdout_result, stdout) = stdout_reader
        .join()
        .map_err(|_| "stdout reader stopped unexpectedly".to_string())?;
    let (stderr_result, stderr) = stderr_reader
        .join()
        .map_err(|_| "stderr reader stopped unexpectedly".to_string())?;
    stdout_result.map_err(|error| format!("could not read stdout: {error}"))?;
    stderr_result.map_err(|error| format!("could not read stderr: {error}"))?;
    Ok(Captured {
        exit: status.code().unwrap_or(128),
        stdout: String::from_utf8_lossy(&stdout).into_owned(),
        stderr: String::from_utf8_lossy(&stderr).into_owned(),
    })
}

fn run_pty(
    executable: &str,
    args: &[String],
    env: &BTreeMap<String, String>,
    stdin: Option<&str>,
    dir: &Path,
    allow_network: bool,
    timeout_ms: u64,
) -> Result<Captured, String> {
    let pair = native_pty_system()
        .openpty(PtySize {
            rows: 24,
            cols: 100,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|error| format!("could not open a TTY: {error}"))?;
    let (program, command_args) = sandboxed_program(executable, args, allow_network)?;
    let mut command = CommandBuilder::new(program);
    command.args(command_args);
    command.cwd(dir);
    command.env_clear();
    apply_env_pty(&mut command, env, dir, allow_network);
    let mut child = pair
        .slave
        .spawn_command(command)
        .map_err(|error| format!("could not start {executable:?} in a TTY: {error}"))?;
    drop(pair.slave);
    if let Some(input) = stdin {
        let mut writer = pair
            .master
            .take_writer()
            .map_err(|error| format!("could not open TTY input: {error}"))?;
        writer
            .write_all(input.as_bytes())
            .map_err(|error| format!("could not write TTY input: {error}"))?;
    }
    let mut reader = pair
        .master
        .try_clone_reader()
        .map_err(|error| format!("could not read TTY output: {error}"))?;
    let reader_thread = thread::spawn(move || {
        let mut bytes = Vec::new();
        let result = reader.read_to_end(&mut bytes);
        (result, bytes)
    });
    let deadline = Instant::now() + Duration::from_millis(timeout_ms);
    let status = loop {
        if let Some(status) = child
            .try_wait()
            .map_err(|error| format!("could not wait for {executable:?}: {error}"))?
        {
            break status;
        }
        if Instant::now() >= deadline {
            let _ = child.kill();
            let _ = child.wait();
            return Err(format!("command timed out after {timeout_ms} ms"));
        }
        thread::sleep(Duration::from_millis(10));
    };
    let (read_result, bytes) = reader_thread
        .join()
        .map_err(|_| "TTY reader stopped unexpectedly".to_string())?;
    read_result.map_err(|error| format!("could not read TTY output: {error}"))?;
    Ok(Captured {
        exit: status.exit_code() as i32,
        stdout: String::from_utf8_lossy(&bytes).replace("\r\n", "\n"),
        stderr: String::new(),
    })
}

fn prepare_files(files: &BTreeMap<String, String>, dir: &Path) -> Result<(), String> {
    for (relative, content) in files {
        let destination = dir.join(relative);
        if let Some(parent) = destination.parent() {
            fs::create_dir_all(parent)
                .map_err(|error| format!("could not create fixture file directory: {error}"))?;
        }
        fs::write(&destination, content)
            .map_err(|error| format!("could not write fixture file {relative:?}: {error}"))?;
    }
    Ok(())
}

fn apply_env_pipe(
    command: &mut Command,
    env: &BTreeMap<String, String>,
    dir: &Path,
    allow_network: bool,
) {
    for key in ["PATH", "PATHEXT", "SystemRoot", "WINDIR"] {
        if let Ok(value) = std::env::var(key) {
            command.env(key, value);
        }
    }
    command
        .env("HOME", dir)
        .env("TMPDIR", dir)
        .env("NO_COLOR", "0");
    if !allow_network {
        command
            .env("HTTP_PROXY", "http://127.0.0.1:9")
            .env("HTTPS_PROXY", "http://127.0.0.1:9")
            .env("ALL_PROXY", "http://127.0.0.1:9")
            .env("NO_PROXY", "")
            .env("AGENT_CONTRACT_NETWORK", "disabled");
    }
    command.envs(env);
}

fn apply_env_pty(
    command: &mut CommandBuilder,
    env: &BTreeMap<String, String>,
    dir: &Path,
    allow_network: bool,
) {
    for key in ["PATH", "PATHEXT", "SystemRoot", "WINDIR"] {
        if let Ok(value) = std::env::var(key) {
            command.env(key, value);
        }
    }
    command.env("HOME", dir);
    command.env("TMPDIR", dir);
    command.env("TERM", "xterm-256color");
    command.env("FORCE_COLOR", "1");
    if !allow_network {
        command.env("HTTP_PROXY", "http://127.0.0.1:9");
        command.env("HTTPS_PROXY", "http://127.0.0.1:9");
        command.env("ALL_PROXY", "http://127.0.0.1:9");
        command.env("NO_PROXY", "");
        command.env("AGENT_CONTRACT_NETWORK", "disabled");
    }
    for (key, value) in env {
        command.env(key, value);
    }
}

fn enforce_network_policy(executable: &str, args: &[String], allowed: bool) -> Result<(), String> {
    if allowed {
        return Ok(());
    }
    let base = Path::new(executable)
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or(executable)
        .to_ascii_lowercase();
    let known = [
        "curl", "wget", "ssh", "scp", "sftp", "nc", "ncat", "telnet", "ftp",
    ];
    if known.contains(&base.as_str())
        || args
            .iter()
            .any(|arg| arg.starts_with("http://") || arg.starts_with("https://"))
    {
        return Err(
            "network-shaped command was blocked; set allow_network: true for this fixture".into(),
        );
    }
    Ok(())
}

fn sandboxed_program(
    executable: &str,
    args: &[String],
    allow_network: bool,
) -> Result<(PathBuf, Vec<String>), String> {
    if allow_network {
        return Ok((PathBuf::from(executable), args.to_vec()));
    }
    let wrapper = std::env::current_exe()
        .map_err(|error| format!("could not locate the network guard: {error}"))?;
    let mut wrapper_args = vec!["network-denied-exec".into(), executable.into()];
    wrapper_args.extend(args.iter().cloned());
    Ok((wrapper, wrapper_args))
}

fn network_denied_exec(executable: &str, args: &[String]) -> Result<(), (i32, String)> {
    #[cfg(target_os = "linux")]
    {
        let guard = materialize_network_guard().map_err(|error| {
            (
                2,
                format!(
                    "could not prepare the network guard before starting {executable:?}: {error}"
                ),
            )
        })?;
        // This wrapper is a new process. Setting its environment cannot affect
        // the parent runner, and execvp carries the preload into the target.
        unsafe { std::env::set_var("LD_PRELOAD", guard) };
        let program = std::ffi::CString::new(executable)
            .map_err(|_| (2, "the declared executable contains a NUL byte".into()))?;
        let values = std::iter::once(executable)
            .chain(args.iter().map(String::as_str))
            .map(std::ffi::CString::new)
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| (2, "a declared argument contains a NUL byte".into()))?;
        let mut pointers = values
            .iter()
            .map(|value| value.as_ptr())
            .collect::<Vec<_>>();
        pointers.push(std::ptr::null());
        // execvp replaces this small guard process. The filter remains active for
        // the target and every child it starts, so URL parsing cannot bypass it.
        unsafe { libc::execvp(program.as_ptr(), pointers.as_ptr()) };
        Err((
            2,
            format!(
                "could not start declared executable {executable:?}: {}",
                std::io::Error::last_os_error()
            ),
        ))
    }
    #[cfg(not(target_os = "linux"))]
    {
        let _ = (executable, args);
        Err((
            2,
            "network-denied fixtures require Linux process isolation; set allow_network: true only after review".into(),
        ))
    }
}

#[cfg(target_os = "linux")]
fn materialize_network_guard() -> std::io::Result<PathBuf> {
    let path = std::env::current_dir()?.join(format!(
        ".agent-contract-network-guard-{}.so",
        std::process::id()
    ));
    fs::write(&path, NETWORK_GUARD)?;
    Ok(path)
}

fn secret_values(env: &BTreeMap<String, String>, extra: &[String]) -> Vec<String> {
    let extra = extra
        .iter()
        .map(|item| item.to_ascii_uppercase())
        .collect::<BTreeSet<_>>();
    env.iter()
        .filter(|(key, value)| {
            let upper = key.to_ascii_uppercase();
            !value.is_empty()
                && (extra.contains(&upper)
                    || ["SECRET", "TOKEN", "PASSWORD", "CREDENTIAL", "API_KEY"]
                        .iter()
                        .any(|part| upper.contains(part)))
        })
        .map(|(_, value)| value.clone())
        .collect()
}

fn normalize(text: &str, dir: &Path, secrets: &[String]) -> String {
    let mut output = text
        .replace("\r\n", "\n")
        .replace(&dir.display().to_string(), "<WORKDIR>");
    for value in secrets {
        output = output.replace(value, "[REDACTED]");
    }
    output
}

fn find_nondeterminism(
    first: &Captured,
    second: &Captured,
    mode: &str,
    allowed: &[String],
    findings: &mut Vec<String>,
) {
    if first.exit != second.exit {
        findings.push("nondeterministic exit code across clean runs".into());
    }
    if mode == "json" {
        if let (Ok(left), Ok(right)) = (
            serde_json::from_str::<Value>(first.stdout.trim()),
            serde_json::from_str::<Value>(second.stdout.trim()),
        ) {
            let mut paths = Vec::new();
            diff_json("$", &left, &right, &mut paths);
            paths.retain(|path| !allowed.contains(path));
            if !paths.is_empty() {
                findings.push(format!(
                    "nondeterministic JSON fields: {}",
                    paths.join(", ")
                ));
            }
        } else if first.stdout != second.stdout {
            findings.push("nondeterministic JSON output across clean runs".into());
        }
    } else if first.stdout != second.stdout || first.stderr != second.stderr {
        findings.push("nondeterministic output across clean runs".into());
    }
}

fn diff_json(path: &str, left: &Value, right: &Value, paths: &mut Vec<String>) {
    match (left, right) {
        (Value::Object(a), Value::Object(b)) => {
            for key in a.keys().chain(b.keys()).collect::<BTreeSet<_>>() {
                match (a.get(key), b.get(key)) {
                    (Some(x), Some(y)) => diff_json(&format!("{path}.{key}"), x, y, paths),
                    _ => paths.push(format!("{path}.{key}")),
                }
            }
        }
        (Value::Array(a), Value::Array(b)) if a.len() == b.len() => {
            for (index, (x, y)) in a.iter().zip(b).enumerate() {
                diff_json(&format!("{path}[{index}]"), x, y, paths);
            }
        }
        _ if left != right => paths.push(path.into()),
        _ => {}
    }
}

fn safe_name(name: &str) -> String {
    let regex = regex::Regex::new("[^a-zA-Z0-9_-]+").unwrap();
    regex
        .replace_all(&name.to_ascii_lowercase(), "-")
        .trim_matches('-')
        .to_string()
}

fn write_reports(dir: &Path, report: &SuiteReport) -> Result<(), String> {
    let json = serde_json::to_string_pretty(report)
        .map_err(|error| format!("could not encode JSON report: {error}"))?;
    fs::write(dir.join("report.json"), format!("{json}\n"))
        .map_err(|error| format!("could not write JSON report: {error}"))?;
    let mut markdown = format!(
        "# CLI contract report\n\n**Result:** {}  \n**Contract:** `{}`  \n**Tool:** agent-contract {}\n\n| Fixture | Mode | Exit | Result |\n| --- | --- | ---: | --- |\n",
        if report.passed { "PASS" } else { "FAIL" },
        report.contract,
        report.tool_version
    );
    for check in &report.checks {
        markdown.push_str(&format!(
            "| {} | `{}` | {} | {} |\n",
            check.fixture.replace('|', "\\|"),
            check.mode,
            check
                .exit
                .map(|value| value.to_string())
                .unwrap_or_else(|| "—".into()),
            if check.passed { "Pass" } else { "Fail" }
        ));
        for finding in &check.findings {
            markdown.push_str(&format!(
                "\n- **{} / {}:** {}\n",
                check.fixture, check.mode, finding
            ));
        }
    }
    markdown.push_str(
        "\nGenerated locally. Command output is redacted before it enters this report.\n",
    );
    fs::write(dir.join("report.md"), markdown)
        .map_err(|error| format!("could not write Markdown report: {error}"))
}

fn demo_command(json: bool) -> Result<(), (i32, String)> {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    let root = std::env::temp_dir().join(format!(
        "agent-contract-demo-{}-{timestamp}",
        std::process::id()
    ));
    fs::create_dir_all(&root)
        .map_err(|error| (2, format!("could not create demo directory: {error}")))?;
    let executable = std::env::current_exe()
        .map_err(|error| (2, format!("could not find this executable: {error}")))?;
    let source = include_str!("../examples/agent-contract.yml").replace(
        "__AGENT_CONTRACT_BIN__",
        &serde_json::to_string(&executable).unwrap(),
    );
    let contract = root.join("agent-contract.yml");
    fs::write(&contract, source)
        .map_err(|error| (2, format!("could not write demo contract: {error}")))?;
    check_command(&contract, true, None, true, false)?;
    check_command(&contract, false, None, true, false)?;
    let report_path = root.join(".agent-contract/report.md");
    if json {
        println!(
            "{}",
            serde_json::json!({"ok": true, "demo": root, "report": report_path})
        );
    } else {
        let report_source = fs::read_to_string(root.join(".agent-contract/report.json"))
            .map_err(|error| (2, format!("could not read demo report: {error}")))?;
        let report: SuiteReport = serde_json::from_str(&report_source)
            .map_err(|error| (2, format!("could not parse demo report: {error}")))?;
        println!("Demo — sample data, nothing was saved to your project");
        for check in &report.checks {
            println!(
                "{} {} [{}] exit {}",
                if check.passed { "✓" } else { "✗" },
                check.fixture,
                check.mode,
                check
                    .exit
                    .map(|exit| exit.to_string())
                    .unwrap_or_else(|| "—".into())
            );
        }
        println!(
            "{} {} checks",
            if report.passed { "PASS" } else { "FAIL" },
            report.checks.len()
        );
        println!("Report: {}", report_path.display());
    }
    Ok(())
}

fn fixture_target(mode: &str, fail: bool, recover: bool) -> Result<(), (i32, String)> {
    if recover {
        match mode {
            "json" => println!("{{\"ok\":true,\"record\":\"ridge-7\",\"status\":\"ready\"}}"),
            _ => println!("record ridge-7: ready"),
        }
        return Ok(());
    }
    if fail {
        match mode {
            "json" => println!(
                "{{\"ok\":false,\"error\":{{\"code\":\"invalid_input\",\"message\":\"record id is required\"}}}}"
            ),
            _ => eprintln!("invalid_input: record id is required"),
        }
        return Err((4, "record id is required; pass a record id".into()));
    }
    match mode {
        "json" => println!("{{\"ok\":true,\"record\":{{\"id\":\"ridge-7\",\"state\":\"ready\"}}}}"),
        "tty" => println!("\u{1b}[32m✓\u{1b}[0m ridge-7  ready"),
        _ => println!("PASS ridge-7 ready"),
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn safe_snapshot_names_are_stable() {
        assert_eq!(safe_name("Inspect one / record"), "inspect-one-record");
    }

    #[test]
    fn changed_json_paths_are_named() {
        let mut paths = Vec::new();
        diff_json(
            "$",
            &serde_json::json!({"meta":{"id":1},"ok":true}),
            &serde_json::json!({"meta":{"id":2},"ok":true}),
            &mut paths,
        );
        assert_eq!(paths, vec!["$.meta.id"]);
    }

    #[test]
    fn secret_values_are_redacted() {
        let env = BTreeMap::from([("API_TOKEN".into(), "do-not-print".into())]);
        assert_eq!(
            normalize(
                "value=do-not-print",
                Path::new("/tmp/work"),
                &secret_values(&env, &[])
            ),
            "value=[REDACTED]"
        );
    }
}
