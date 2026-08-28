use std::env;
use std::path::PathBuf;
use std::process::Command;

fn main() {
    println!("cargo:rerun-if-changed=src/network_guard.c");
    let output =
        PathBuf::from(env::var("OUT_DIR").expect("OUT_DIR is set")).join("network_guard.so");
    let status = Command::new("cc")
        .args(["-shared", "-fPIC", "-O2", "src/network_guard.c", "-o"])
        .arg(&output)
        .status()
        .expect("a C compiler is required to build the Linux network guard");
    assert!(status.success(), "could not build the Linux network guard");
}
