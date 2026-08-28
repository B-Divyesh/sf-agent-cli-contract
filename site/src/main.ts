import './style.css';

type Route = '/' | '/demo' | '/privacy' | '/terms' | '/404';

const app = document.querySelector<HTMLDivElement>('#app')!;
const status = document.querySelector<HTMLDivElement>('#route-status')!;

const routeTitles: Record<Route, string> = {
  '/': 'Agent CLI Contract — test stable command output',
  '/demo': 'Demo — Agent CLI Contract',
  '/privacy': 'Privacy — Agent CLI Contract',
  '/terms': 'Terms — Agent CLI Contract',
  '/404': 'Page not found — Agent CLI Contract'
};

const routeDescriptions: Record<Route, string> = {
  '/': 'Test CLI output, exit codes, errors, and repeat runs before coding agents depend on them.',
  '/demo': 'Review a recorded run of the four fixtures bundled with Agent CLI Contract.',
  '/privacy': 'Learn what Agent CLI Contract reads, writes, and keeps on your machine.',
  '/terms': 'Read the MIT terms for Agent CLI Contract and your responsibility when running commands.',
  '/404': 'This Agent CLI Contract page could not be found.'
};

const header = () => `
  <header class="site-header">
    <a class="wordmark route-link" href="/" aria-label="Agent CLI Contract home">
      <svg aria-hidden="true" viewBox="0 0 40 40"><path d="M4 29c7-14 11 7 18-7S32 14 36 8"/><circle cx="5" cy="28" r="3"/><path d="m26 19 3 3 7-9"/></svg>
      <span>Agent CLI Contract</span>
    </a>
    <nav aria-label="Main navigation">
      <a class="route-link" href="/demo">Demo</a>
      <a class="route-link" href="/#install">Install</a>
      <a class="route-link" href="/privacy">Privacy</a>
    </nav>
  </header>`;

const footer = () => `
  <footer class="site-footer">
    <p>Test CLI contracts before agents depend on them.</p>
    <nav aria-label="Footer navigation">
      <a class="route-link" href="/privacy">Privacy</a>
      <a class="route-link" href="/terms">Terms</a>
    </nav>
    <p>Built by Param Factory · v0.1.0</p>
  </footer>`;

const terminal = (compact = false) => `
  <div class="terminal ${compact ? 'terminal--compact' : ''}" aria-label="Recorded terminal run">
    <div class="terminal-bar"><span></span><span></span><span></span><b>contract survey · local</b></div>
    <ol class="terminal-lines">
      <li><span class="prompt">$</span> agent-contract check agent-contract.yml</li>
      <li><span class="pass">✓</span> inspect stable record <em>[text]</em></li>
      <li><span class="pass">✓</span> inspect stable record <em>[tty]</em></li>
      <li><span class="pass">✓</span> inspect stable record <em>[json]</em></li>
      <li><span class="pass">✓</span> invalid input stays recoverable <em>[json]</em></li>
      <li><strong>PASS</strong> 4 checks · report.md + report.json</li>
    </ol>
  </div>`;

const landing = () => `
  ${header()}
  <main id="main" class="landing" tabindex="-1">
    <section class="hero survey-grid" aria-labelledby="page-title">
      <div class="coordinate-rail" aria-hidden="true"><span>40° 46′ N</span><span>073° 59′ W</span></div>
      <div class="hero-copy">
        <p class="eyebrow">Contract survey / v0.1.0</p>
        <h1 id="page-title" tabindex="-1">Test CLI contracts before agents depend on them</h1>
        <p class="lede">For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged.</p>
        <div class="hero-action">
          <a class="button button--primary route-link" href="/?demo=1">Try it with sample data <span aria-hidden="true">→</span></a>
          <span>Opens a recorded run with four passing checks.</span>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li>Free and open source.</li>
          <li>Runs locally.</li>
          <li>Network use is opt-in.</li>
        </ul>
      </div>
      <figure class="hero-map">
        <img src="/topographic-run.webp" width="1440" height="960" alt="A survey route crosses four checkpoints on a topographic map." fetchpriority="high" />
        <figcaption>One declared command. Four contract checkpoints.</figcaption>
      </figure>
    </section>

    <section class="preview section-rule" aria-labelledby="preview-heading">
      <div class="section-label">FIELD LOG / 01</div>
      <div>
        <p class="eyebrow">The product, in use</p>
        <h2 id="preview-heading">See the contract before an agent does</h2>
        <p>Approve a baseline once. Each later run names the output, exit, or JSON field that moved.</p>
        ${terminal()}
      </div>
    </section>

    <section class="steps section-rule" aria-labelledby="steps-heading">
      <div class="section-label">ROUTE / 02</div>
      <div>
        <p class="eyebrow">How it works</p>
        <h2 id="steps-heading">Survey a command in three steps</h2>
        <ol class="route-steps">
          <li><span>01</span><div><h3>Declare the command</h3><p>List the executable, fixed arguments, modes, and expected exits in YAML.</p></div></li>
          <li><span>02</span><div><h3>Run isolated fixtures</h3><p>Each fixture starts in a new temporary directory with a small environment.</p></div></li>
          <li><span>03</span><div><h3>Review named changes</h3><p>Read Markdown in a pull request or parse the same result as JSON.</p></div></li>
        </ol>
      </div>
    </section>

    <section class="boundaries section-rule" aria-labelledby="limits-heading">
      <div class="section-label">BOUNDARY / 03</div>
      <div>
        <p class="eyebrow">Limits and privacy</p>
        <h2 id="limits-heading">Run only commands you declare</h2>
        <p>The runner executes only commands written in your contract.</p>
        <ul class="boundary-list">
          <li><b>Temporary workspaces</b><span>Project files stay outside each fixture.</span></li>
          <li><b>Secret redaction</b><span>Declared secret values become <code>[REDACTED]</code>.</span></li>
          <li><b>Explicit network</b><span>Network use needs <code>allow_network: true</code>.</span></li>
        </ul>
      </div>
    </section>

    <section id="install" class="install section-rule" aria-labelledby="install-heading">
      <div class="section-label">START / 04</div>
      <div>
        <p class="eyebrow">Install from source</p>
        <h2 id="install-heading">Add the first contract in two commands</h2>
        <div class="command-copy">
          <code id="install-command" tabindex="0">cargo install --git https://github.com/B-Divyesh/sf-agent-cli-contract</code>
          <button class="button button--quiet" type="button" data-copy="#install-command">Copy install command</button>
        </div>
        <pre aria-label="Create and run a contract" tabindex="0"><code>agent-contract init --command my-cli
agent-contract check agent-contract.yml --accept</code></pre>
        <p class="small-note">Requires Rust 1.85 or newer. The binary has no telemetry.</p>
      </div>
    </section>
  </main>
  ${footer()}`;

const demoReport = (failed = false) => `
  <section class="demo-report" aria-label="Sample contract report">
    <div class="report-heading">
      <div><span class="eyebrow">REPORT / DEMO-001</span><h2>${failed ? 'One contract change needs review' : 'All four contract checks pass'}</h2></div>
      <span class="status-pill ${failed ? 'status-pill--fail' : ''}">${failed ? 'FAIL · 1' : 'PASS · 4'}</span>
    </div>
    <div class="report-table" role="table" aria-label="Fixture results">
      <div role="row" class="table-head"><span role="columnheader">Fixture</span><span role="columnheader">Mode</span><span role="columnheader">Exit</span><span role="columnheader">Result</span></div>
      <div role="row"><span role="cell">inspect stable record</span><span role="cell"><code>text</code></span><span role="cell">0</span><span role="cell" class="pass">Pass</span></div>
      <div role="row"><span role="cell">inspect stable record</span><span role="cell"><code>tty</code></span><span role="cell">0</span><span role="cell" class="pass">Pass</span></div>
      <div role="row"><span role="cell">inspect stable record</span><span role="cell"><code>json</code></span><span role="cell">0</span><span role="cell" class="pass">Pass</span></div>
      <div role="row"><span role="cell">invalid input stays recoverable</span><span role="cell"><code>json</code></span><span role="cell">4</span><span role="cell" class="${failed ? 'fail' : 'pass'}">${failed ? 'Changed' : 'Pass'}</span></div>
    </div>
    <div class="report-note ${failed ? '' : 'hidden'}" role="alert">
      <b>error.code changed</b>
      <span>Expected <code>invalid_input</code>. Received <code>bad_request</code>.</span>
      <span>Restore the code or approve the new snapshot after review.</span>
    </div>
  </section>`;

const demo = () => `
  ${header()}
  <aside class="demo-banner" aria-label="Demo status">
    <span><b>Demo</b> — sample data, nothing is saved</span>
    <div><button type="button" class="text-button" data-reset-demo>Reset demo</button><button type="button" class="text-button" data-start-real>Leave demo and view install steps</button></div>
  </aside>
  <main id="main" class="demo-page" tabindex="-1">
    <section class="demo-intro">
      <p class="eyebrow">Isolated field test</p>
      <h1 id="page-title" tabindex="-1">Review a complete CLI contract run</h1>
      <p>This sample uses the same four fixtures bundled with the Rust binary.</p>
      <div class="demo-actions">
        <button class="button button--primary" type="button" data-replay-demo>Replay recorded sample run</button>
        <button class="button button--quiet" type="button" data-break-demo>Show a blocked change</button>
        <span id="demo-live" aria-live="polite"></span>
      </div>
    </section>
    <div class="demo-workbench">
      <section class="fixture-sheet" aria-labelledby="fixture-heading">
        <div class="sheet-tab">agent-contract.yml</div>
        <h2 id="fixture-heading" class="sr-only">Sample fixture</h2>
        <pre tabindex="0"><code><span class="yaml-key">version:</span> 1
<span class="yaml-key">command:</span> [<span class="yaml-string">"ridge-cli"</span>]
<span class="yaml-key">fixtures:</span>
  - <span class="yaml-key">name:</span> inspect stable record
    <span class="yaml-key">modes:</span> [text, tty, json]
    <span class="yaml-key">expect:</span>
      <span class="yaml-key">exit:</span> 0
    <span class="yaml-key">idempotent:</span> true
    <span class="yaml-key">allow_network:</span> false</code></pre>
      </section>
      <div data-report-host>${demoReport(false)}</div>
    </div>
    <section class="recorded-output" aria-labelledby="recorded-heading">
      <p class="eyebrow">Self-hosted terminal recording</p>
      <h2 id="recorded-heading">Watch the same sample run in the CLI</h2>
      <figure class="terminal-recording">
        <img data-terminal-recording src="/terminal-recording.svg" width="1040" height="404" alt="Recorded terminal run of agent-contract demo passing four bundled checks." />
        <figcaption>Generated at build time by running the bundled sample with the real binary.</figcaption>
      </figure>
      <div class="demo-command">
        <code id="demo-command" tabindex="0">agent-contract demo</code>
        <button class="button button--quiet" type="button" data-copy="#demo-command">Copy demo command</button>
      </div>
      <details class="recording-transcript"><summary>Read the recording transcript</summary><pre tabindex="0"><code>$ agent-contract demo
Demo — sample data, nothing was saved to your project
✓ inspect stable record [text] exit 0
✓ inspect stable record [tty] exit 0
✓ inspect stable record [json] exit 0
✓ invalid input stays recoverable [json] exit 4
PASS 4 checks
Report: /tmp/agent-contract-demo-&lt;id&gt;/.agent-contract/report.md</code></pre></details>
    </section>
  </main>
  ${footer()}`;

const privacy = () => `
  ${header()}
  <main id="main" class="prose-page" tabindex="-1">
    <p class="eyebrow">Policy / effective 28 August 2026</p>
    <h1 id="page-title" tabindex="-1">Keep CLI checks on your machine</h1>
    <p class="lede">Agent CLI Contract has no account, analytics, telemetry, or hosted contract service.</p>
    <h2>What the CLI reads</h2>
    <p>The CLI reads the contract path you provide. It starts only the commands declared in that file.</p>
    <h2>What the CLI writes</h2>
    <p>The CLI writes snapshots beside the contract. It writes Markdown and JSON reports in <code>.agent-contract</code>.</p>
    <h2>What leaves the machine</h2>
    <p>The CLI does not send contract data anywhere. A fixture may use the network only when its contract allows it.</p>
    <h2>Website data</h2>
    <p>The demo stores only its sample view under keys beginning with <code>demo:</code>. Resetting or leaving the demo removes those keys.</p>
    <h2>Questions</h2>
    <p>Open an issue in the source repository for privacy questions.</p>
  </main>
  ${footer()}`;

const terms = () => `
  ${header()}
  <main id="main" class="prose-page" tabindex="-1">
    <p class="eyebrow">Terms / effective 28 August 2026</p>
    <h1 id="page-title" tabindex="-1">Use the tool under MIT terms</h1>
    <p class="lede">Agent CLI Contract is free software provided under the MIT License.</p>
    <h2>Your contracts and output</h2>
    <p>You keep ownership of your contract files, snapshots, and reports.</p>
    <h2>Your responsibility</h2>
    <p>Run only commands you trust. Review fixture arguments before execution.</p>
    <h2>No warranty</h2>
    <p>The software is provided “as is,” without warranty. The repository LICENSE contains the complete terms.</p>
  </main>
  ${footer()}`;

const notFound = () => `
  ${header()}
  <main id="main" class="not-found" tabindex="-1">
    <div class="lost-contours" aria-hidden="true"><span></span><span></span><span></span></div>
    <p class="eyebrow">Coordinate not found / 404</p>
    <h1 id="page-title" tabindex="-1">This route leaves the map</h1>
    <p>The page may have moved. Return to the contract survey.</p>
    <a class="button button--primary route-link" href="/">Return to the home route</a>
  </main>
  ${footer()}`;

function currentRoute(): Route {
  if (new URLSearchParams(window.location.search).get('demo') === '1') return '/demo';
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return (['/', '/demo', '/privacy', '/terms', '/404'].includes(path) ? path : '/404') as Route;
}

function updateMetadata(route: Route) {
  const canonicalPath = route === '/404' ? '/404' : route;
  const canonical = `https://agent-cli-contract.sociobot.in${canonicalPath}`;
  document.title = routeTitles[route];
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = canonical;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = routeDescriptions[route];
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = routeTitles[route];
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = routeDescriptions[route];
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')!.content = canonical;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = routeTitles[route];
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = routeDescriptions[route];
}

function render({ focus = false, restoreScroll }: { focus?: boolean; restoreScroll?: { x: number; y: number } } = {}) {
  const route = currentRoute();
  const views: Record<Route, () => string> = { '/': landing, '/demo': demo, '/privacy': privacy, '/terms': terms, '/404': notFound };
  app.innerHTML = views[route]();
  updateMetadata(route);
  document.body.dataset.route = route.slice(1) || 'home';
  bindActions();
  if (focus) {
    const heading = document.querySelector<HTMLHeadingElement>('h1')!;
    heading.focus({ preventScroll: true });
    status.textContent = heading.textContent;
  }
  if (restoreScroll) {
    requestAnimationFrame(() => {
      window.scrollTo(restoreScroll.x, restoreScroll.y);
      document.querySelector<HTMLHeadingElement>('h1')?.focus({ preventScroll: true });
    });
  } else if (window.location.hash) {
    document.querySelector(window.location.hash)?.scrollIntoView();
  } else if (focus) {
    window.scrollTo(0, 0);
  }
}

function navigate(url: URL) {
  history.replaceState({ ...history.state, scrollX: window.scrollX, scrollY: window.scrollY }, '');
  history.pushState({ scrollX: 0, scrollY: 0 }, '', `${url.pathname}${url.search}${url.hash}`);
  render({ focus: !url.hash });
}

function clearDemo() {
  Object.keys(localStorage).filter((key) => key.startsWith('demo:')).forEach((key) => localStorage.removeItem(key));
}

function bindActions() {
  document.querySelectorAll<HTMLAnchorElement>('a.route-link').forEach((link) => link.addEventListener('click', (event) => {
    const url = new URL(link.href);
    if (url.origin === window.location.origin) {
      event.preventDefault();
      if (currentRoute() === '/demo' && url.pathname !== '/demo') clearDemo();
      navigate(url);
    }
  }));

  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
    const target = document.querySelector(button.dataset.copy!)?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(target);
      button.textContent = 'Copied install command';
    } catch {
      button.textContent = 'Copy failed — select the command';
    }
  }));

  const reportHost = document.querySelector<HTMLElement>('[data-report-host]');
  const live = document.querySelector<HTMLElement>('#demo-live');
  document.querySelector<HTMLButtonElement>('[data-break-demo]')?.addEventListener('click', () => {
    localStorage.setItem('demo:report', 'failed');
    if (reportHost) reportHost.innerHTML = demoReport(true);
    if (live) live.textContent = 'The sample now shows one blocked contract change.';
  });
  document.querySelector<HTMLButtonElement>('[data-replay-demo]')?.addEventListener('click', () => {
    const recording = document.querySelector<HTMLImageElement>('[data-terminal-recording]');
    if (recording) {
      recording.replaceWith(recording.cloneNode(true));
    }
    if (live) live.textContent = 'Replaying the recorded output from the bundled CLI demo.';
  });
  document.querySelector<HTMLButtonElement>('[data-reset-demo]')?.addEventListener('click', () => {
    clearDemo();
    render();
    document.querySelector<HTMLButtonElement>('[data-reset-demo]')?.focus();
    status.textContent = 'Demo reset to the original sample.';
  });
  document.querySelector<HTMLButtonElement>('[data-start-real]')?.addEventListener('click', () => {
    clearDemo();
    navigate(new URL('/#install', window.location.origin));
  });
  if (reportHost && localStorage.getItem('demo:report') === 'failed') reportHost.innerHTML = demoReport(true);
}

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!link) return;
  if (link.classList.contains('skip-link')) {
    window.setTimeout(() => document.querySelector<HTMLElement>('main')?.focus(), 0);
    return;
  }
  if (link.classList.contains('route-link')) return;
  const url = new URL(link.href);
  if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
    event.preventDefault();
    navigate(url);
  }
});

history.scrollRestoration = 'manual';
history.replaceState({ ...history.state, scrollX: window.scrollX, scrollY: window.scrollY }, '');
window.addEventListener('scroll', () => {
  history.replaceState({ ...history.state, scrollX: window.scrollX, scrollY: window.scrollY }, '');
}, { passive: true });
window.addEventListener('popstate', (event) => render({
  focus: true,
  restoreScroll: { x: event.state?.scrollX ?? 0, y: event.state?.scrollY ?? 0 }
}));
window.addEventListener('offline', () => { status.textContent = 'You are offline. The loaded sample remains available.'; });
render();

if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
