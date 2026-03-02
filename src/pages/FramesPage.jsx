export default function FramesPage() {
  return (
    <div style={{ paddingTop: "var(--nav-h)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>

        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
          Testing Playground
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 64, letterSpacing: "0.06em", lineHeight: 1, marginBottom: 16 }}>
          FRAMES
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: 600, lineHeight: 1.8, marginBottom: 48 }}>
          Embedded iframes for practising Playwright's
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: 13 }}> page.frameLocator()</code> API.
          Interact with content inside frames exactly as you would on real-world apps.
        </p>

        {/* Sandboxed iframe with form */}
        <section data-testid="sandboxed-iframe-section" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Frame 1 — Sandboxed Form
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 16 }}>
            INTERACTIVE FORM
          </h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <iframe
              data-testid="sandboxed-iframe"
              srcDoc={`<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #111; color: #f0ece4; font-family: 'DM Sans', sans-serif; padding: 28px; }
    h2 { font-family: serif; color: #c8a96e; margin-bottom: 6px; font-size: 18px; }
    p { font-size: 12px; color: #888; margin-bottom: 20px; }
    label { display: block; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #555; margin-bottom: 5px; }
    input, select {
      width: 100%; padding: 8px 12px; background: #1a1a1a;
      border: 1px solid #3a3a3a; color: #fff; border-radius: 4px;
      font-size: 13px; margin-bottom: 14px;
    }
    button { padding: 9px 18px; background: #c8a96e; color: #000; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
    button:hover { background: #e0c080; }
    #out { margin-top: 14px; color: #44aa66; font-size: 12px; font-family: monospace; min-height: 18px; padding: 8px 12px; background: #0a0a0a; border-radius: 4px; display: none; }
    #out.visible { display: block; }
  </style>
</head>
<body>
  <h2>Inside the iframe</h2>
  <p>Use Playwright's frameLocator() to interact with this form.</p>
  <label>Name</label>
  <input id="nameInput" data-testid="iframe-name" placeholder="Enter your name…" />
  <label>Tool</label>
  <select id="toolSelect" data-testid="iframe-select">
    <option value="">Select a tool…</option>
    <option value="playwright">Playwright</option>
    <option value="cypress">Cypress</option>
    <option value="selenium">Selenium</option>
  </select>
  <button data-testid="iframe-submit" onclick="
    var n = document.getElementById('nameInput').value;
    var t = document.getElementById('toolSelect').value;
    var o = document.getElementById('out');
    if(n && t){ o.textContent = '✓ ' + n + ' uses ' + t; o.classList.add('visible'); }
  ">Submit</button>
  <div id="out" data-testid="iframe-output"></div>
</body>
</html>`}
              style={{ width: "100%", height: 280, border: "none", display: "block" }}
              title="Sandboxed form iframe"
            />
          </div>
          <CodeBlock code={`const frame = page.frameLocator('[data-testid="sandboxed-iframe"]');
await frame.locator('[data-testid="iframe-name"]').fill('Scott');
await frame.locator('[data-testid="iframe-select"]').selectOption('playwright');
await frame.locator('[data-testid="iframe-submit"]').click();
const out = await frame.locator('[data-testid="iframe-output"]').textContent();`} />
        </section>

        {/* Nested iframes */}
        <section data-testid="nested-iframe-section" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Frame 2 — Nested iFrames
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 16 }}>
            FRAME INSIDE A FRAME
          </h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <iframe
              data-testid="outer-iframe"
              srcDoc={`<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #111; color: #f0ece4; font-family: sans-serif; padding: 20px; }
    h3 { color: #c8a96e; font-size: 15px; margin-bottom: 12px; }
    p { font-size: 12px; color: #888; margin-bottom: 14px; }
    iframe { border: 1px solid #3a3a3a; border-radius: 4px; display: block; width: 100%; }
  </style>
</head>
<body>
  <h3>Outer Frame</h3>
  <p>This is the outer iframe. Inside it is another iframe.</p>
  <iframe data-testid="inner-iframe" srcdoc="&lt;html&gt;&lt;body style='margin:0;background:#0a0a0a;padding:16px;font-family:sans-serif;'&gt;&lt;p style='color:#c8a96e;font-size:13px;margin:0 0 10px;'&gt;Inner Frame&lt;/p&gt;&lt;input data-testid='deep-input' placeholder='Deep nested input…' style='width:100%;padding:7px 10px;background:#1a1a1a;border:1px solid #3a3a3a;color:#fff;border-radius:4px;font-size:12px;'/&gt;&lt;/body&gt;&lt;/html&gt;" height="80"></iframe>
</body>
</html>`}
              style={{ width: "100%", height: 180, border: "none", display: "block" }}
              title="Outer iframe"
            />
          </div>
          <CodeBlock code={`// Chain frameLocator() calls for nested frames
const outerFrame = page.frameLocator('[data-testid="outer-iframe"]');
const innerFrame = outerFrame.frameLocator('[data-testid="inner-iframe"]');
await innerFrame.locator('[data-testid="deep-input"]').fill('Deeply nested!');`} />
        </section>

        {/* YouTube iframe */}
        <section data-testid="youtube-iframe-section" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Frame 3 — External iframe
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 16 }}>
            YOUTUBE EMBED
          </h2>
          <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
            <iframe
              data-testid="youtube-iframe"
              src="https://www.youtube.com/embed/videoseries?list=PLM7ptBsxJm6gG5Gq33REqKnmQPmNPSWGH"
              title="Playwright Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
          <CodeBlock code={`// External iframes are cross-origin — you can locate the iframe element
// but cannot interact with its internal content due to browser security.
const iframe = page.locator('[data-testid="youtube-iframe"]');
await expect(iframe).toBeVisible();
const src = await iframe.getAttribute('src');`} />
        </section>

      </div>
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <div style={{ marginTop: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 18px" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>Playwright</div>
      <code style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)", display: "block", lineHeight: 1.9, whiteSpace: "pre" }}>
        {code}
      </code>
    </div>
  );
}
