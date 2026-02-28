import { useEffect, useRef } from "react";

// A custom web component for the shadow DOM demo
class ShadowDemoWidget extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; padding: 20px; background: #1a1a1a; border: 1px solid #3a3a3a; border-radius: 4px; }
        h3 { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.1em; color: #c8a96e; margin: 0 0 12px; }
        p { font-size: 13px; color: #888880; line-height: 1.6; margin: 0 0 12px; }
        input {
          width: 100%; padding: 8px 12px;
          background: #111; border: 1px solid #3a3a3a;
          color: #f0ece4; border-radius: 4px; font-size: 13px;
          outline: none; box-sizing: border-box; margin-bottom: 8px;
        }
        input:focus { border-color: #c8a96e; }
        button {
          padding: 8px 16px; background: #c8a96e; color: #0a0a0a;
          border: none; border-radius: 4px; font-size: 12px;
          font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
        }
        button:hover { background: #e0c080; }
        .output {
          margin-top: 12px; padding: 10px 14px;
          background: #111; border: 1px solid #2a2a2a;
          border-radius: 4px; font-size: 12px; color: #44aa66;
          font-family: 'DM Mono', monospace; display: none;
        }
        .output.visible { display: block; }
      </style>
      <h3>SHADOW DOM FORM</h3>
      <p>This entire widget lives inside a Shadow DOM. Use Playwright's pierce selector or locator() with shadowRoot to interact with it.</p>
      <input data-shadow-input type="text" placeholder="Type something inside shadow DOM…" />
      <br/>
      <button data-shadow-submit>Submit</button>
      <div class="output" data-shadow-output></div>
    `;

    const input = shadow.querySelector("[data-shadow-input]");
    const btn = shadow.querySelector("[data-shadow-submit]");
    const output = shadow.querySelector("[data-shadow-output]");

    btn.addEventListener("click", () => {
      if (input.value.trim()) {
        output.textContent = `✓ Received: "${input.value}"`;
        output.classList.add("visible");
        this.dispatchEvent(new CustomEvent("shadow-submitted", {
          detail: { value: input.value },
          bubbles: true,
          composed: true,
        }));
      }
    });
  }
}

if (!customElements.get("shadow-demo-widget")) {
  customElements.define("shadow-demo-widget", ShadowDemoWidget);
}

export default function AboutPage() {
  const shadowRef = useRef(null);

  useEffect(() => {
    const el = shadowRef.current;
    if (!el) return;
    const h = (e) => console.log("[Shadow DOM event]", e.detail);
    el.addEventListener("shadow-submitted", h);
    return () => el.removeEventListener("shadow-submitted", h);
  }, []);

  return (
    <div style={{ paddingTop: "var(--nav-h)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono)",
            marginBottom: 8,
          }}
        >
          About This Project
        </div>
        <h1
          style={{ fontFamily: "var(--font-display)", fontSize: 56, letterSpacing: "0.06em", marginBottom: 40 }}
        >
          ABOUT VAULT
        </h1>

        <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 40, maxWidth: 600 }}>
          VAULT is a purpose-built Playwright testing playground disguised as a premium
          e-commerce store. Every component is crafted to showcase a real-world testing
          challenge — from shadow DOM forms to iframe interactions, nested scroll containers
          to full auth flows.
        </p>

        {/* Shadow DOM demo */}
        <section data-testid="shadow-dom-section" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 16 }}>
            Demo — Shadow DOM
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 20 }}>
            WEB COMPONENT WIDGET
          </h2>
          <shadow-demo-widget
            ref={shadowRef}
            data-testid="shadow-demo-widget"
          />
          <div style={{ marginTop: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px" }}>
            <code style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-mono)", display: "block", lineHeight: 1.8 }}>
              {`// Playwright example:\nconst shadow = page.locator('shadow-demo-widget');\nconst input = shadow.locator('[data-shadow-input]');\nawait input.fill('Hello from Playwright');\nawait shadow.locator('[data-shadow-submit]').click();`}
            </code>
          </div>
        </section>

        {/* Sandboxed iframe demo */}
        <section data-testid="iframe-section" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 16 }}>
            Demo — iFrame
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 20 }}>
            SANDBOXED IFRAME
          </h2>
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}
          >
            <iframe
              data-testid="sandboxed-iframe"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { margin: 0; background: #111; color: #f0ece4; font-family: 'DM Sans', sans-serif; padding: 24px; }
                    h2 { font-family: serif; color: #c8a96e; margin: 0 0 12px; }
                    p { font-size: 13px; color: #888; margin: 0 0 16px; }
                    input { padding: 8px 12px; background: #1a1a1a; border: 1px solid #3a3a3a; color: #fff; border-radius: 4px; font-size: 13px; margin-right: 8px; }
                    button { padding: 8px 14px; background: #c8a96e; color: #000; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
                    #out { margin-top: 12px; color: #44aa66; font-size: 12px; min-height: 18px; }
                  </style>
                </head>
                <body>
                  <h2>Inside the iframe</h2>
                  <p>This content is in a sandboxed iframe. Use Playwright's <code>frameLocator()</code>.</p>
                  <input id="iframeInput" data-testid="iframe-input" placeholder="Type here…" />
                  <button onclick="document.getElementById('out').textContent = '✓ ' + document.getElementById('iframeInput').value" data-testid="iframe-btn">
                    Echo
                  </button>
                  <div id="out" data-testid="iframe-output"></div>
                </body>
                </html>
              `}
              style={{ width: "100%", height: 220, border: "none", display: "block" }}
              title="Sandboxed iframe demo"
            />
          </div>
          <div style={{ marginTop: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px" }}>
            <code style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-mono)", display: "block", lineHeight: 1.8 }}>
              {`// Playwright example:\nconst frame = page.frameLocator('[data-testid="sandboxed-iframe"]');\nawait frame.locator('[data-testid="iframe-input"]').fill('Hello');\nawait frame.locator('[data-testid="iframe-btn"]').click();\nconst out = await frame.locator('[data-testid="iframe-output"]').textContent();`}
            </code>
          </div>
        </section>

        {/* Tech stack */}
        <section data-testid="stack-section">
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 16 }}>
            Technology
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 20 }}>
            THE STACK
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {STACK.map((s) => (
              <div
                key={s.name}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "16px",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const STACK = [
  { name: "React + Vite", desc: "Frontend framework with fast HMR dev server" },
  { name: "PocketBase", desc: "Single-binary SQLite backend with built-in auth" },
  { name: "Web Components", desc: "Custom elements for shadow DOM testing practice" },
  { name: "React Router", desc: "Client-side routing with protected routes" },
  { name: "Playwright", desc: "The star of the show — test everything here" },
  { name: "Netlify + Railway", desc: "Free-tier hosting for frontend and backend" },
];
