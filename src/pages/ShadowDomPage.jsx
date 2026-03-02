import { useEffect, useRef } from "react";

class ShadowDemoWidget extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; padding: 24px; background: #1a1a1a; border: 1px solid #3a3a3a; border-radius: 4px; }
        h3 { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.1em; color: #c8a96e; margin: 0 0 10px; }
        p { font-size: 13px; color: #888880; line-height: 1.6; margin: 0 0 16px; }
        input {
          width: 100%; padding: 9px 13px; box-sizing: border-box;
          background: #111; border: 1px solid #3a3a3a;
          color: #f0ece4; border-radius: 4px; font-size: 13px; outline: none; margin-bottom: 10px;
        }
        input:focus { border-color: #c8a96e; }
        button {
          padding: 9px 18px; background: #c8a96e; color: #0a0a0a;
          border: none; border-radius: 4px; font-size: 12px;
          font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
        }
        button:hover { background: #e0c080; }
        .output {
          margin-top: 14px; padding: 10px 14px;
          background: #111; border: 1px solid #2a2a2a;
          border-radius: 4px; font-size: 12px; color: #44aa66;
          font-family: 'DM Mono', monospace; display: none;
        }
        .output.visible { display: block; }
      </style>
      <h3>SHADOW DOM FORM</h3>
      <p>This widget lives inside a Shadow DOM. Use Playwright's pierce selector or shadowRoot to interact with it.</p>
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
        this.dispatchEvent(new CustomEvent("shadow-submitted", { detail: { value: input.value }, bubbles: true, composed: true }));
      }
    });
  }
}
if (!customElements.get("shadow-demo-widget")) {
  customElements.define("shadow-demo-widget", ShadowDemoWidget);
}

class ShadowCounterWidget extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    let count = 0;
    const render = () => {
      shadow.innerHTML = `
        <style>
          :host { display: block; padding: 24px; background: #1a1a1a; border: 1px solid #3a3a3a; border-radius: 4px; }
          h3 { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.1em; color: #c8a96e; margin: 0 0 10px; }
          p { font-size: 13px; color: #888880; margin: 0 0 16px; }
          .counter { display: flex; align-items: center; gap: 16px; }
          .count { font-family: 'DM Mono', monospace; font-size: 36px; color: #f0ece4; min-width: 60px; text-align: center; }
          button {
            width: 40px; height: 40px; border-radius: 4px;
            background: transparent; border: 1px solid #3a3a3a;
            color: #f0ece4; font-size: 20px; cursor: pointer;
          }
          button:hover { border-color: #c8a96e; color: #c8a96e; }
          .reset { margin-top: 12px; padding: 7px 14px; background: transparent; border: 1px solid #3a3a3a; color: #888880; border-radius: 4px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
          .reset:hover { border-color: #cc4444; color: #cc4444; }
        </style>
        <h3>SHADOW COUNTER</h3>
        <p>A stateful counter component inside shadow DOM.</p>
        <div class="counter">
          <button data-dec>−</button>
          <span class="count" data-count>${count}</span>
          <button data-inc>+</button>
        </div>
        <br/>
        <button class="reset" data-reset>Reset</button>
      `;
      shadow.querySelector("[data-dec]").addEventListener("click", () => { count--; render(); });
      shadow.querySelector("[data-inc]").addEventListener("click", () => { count++; render(); });
      shadow.querySelector("[data-reset]").addEventListener("click", () => { count = 0; render(); });
    };
    render();
  }
}
if (!customElements.get("shadow-counter-widget")) {
  customElements.define("shadow-counter-widget", ShadowCounterWidget);
}

class ShadowSelectWidget extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; padding: 24px; background: #1a1a1a; border: 1px solid #3a3a3a; border-radius: 4px; }
        h3 { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.1em; color: #c8a96e; margin: 0 0 10px; }
        p { font-size: 13px; color: #888880; margin: 0 0 16px; }
        select {
          width: 100%; padding: 9px 13px; background: #111; border: 1px solid #3a3a3a;
          color: #f0ece4; border-radius: 4px; font-size: 13px; outline: none; cursor: pointer;
          margin-bottom: 10px;
        }
        select:focus { border-color: #c8a96e; }
        .result { font-family: 'DM Mono', monospace; font-size: 12px; color: #44aa66; margin-top: 8px; min-height: 18px; }
      </style>
      <h3>SHADOW SELECT</h3>
      <p>A dropdown select inside shadow DOM.</p>
      <select data-shadow-select>
        <option value="">Choose an option…</option>
        <option value="playwright">Playwright</option>
        <option value="cypress">Cypress</option>
        <option value="selenium">Selenium</option>
        <option value="webdriverio">WebdriverIO</option>
      </select>
      <div class="result" data-shadow-result></div>
    `;
    const sel = shadow.querySelector("[data-shadow-select]");
    const result = shadow.querySelector("[data-shadow-result]");
    sel.addEventListener("change", () => {
      result.textContent = sel.value ? `✓ Selected: ${sel.value}` : "";
    });
  }
}
if (!customElements.get("shadow-select-widget")) {
  customElements.define("shadow-select-widget", ShadowSelectWidget);
}

export default function ShadowDomPage() {
  const formRef = useRef(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const h = (e) => console.log("[Shadow event]", e.detail);
    el.addEventListener("shadow-submitted", h);
    return () => el.removeEventListener("shadow-submitted", h);
  }, []);

  return (
    <div style={{ paddingTop: "var(--nav-h)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>

        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
          Testing Playground
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 64, letterSpacing: "0.06em", lineHeight: 1, marginBottom: 16 }}>
          SHADOW DOM
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: 600, lineHeight: 1.8, marginBottom: 48 }}>
          Web Components with encapsulated shadow roots. Practice using Playwright's pierce selectors,
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: 13 }}> locator().shadowRoot</code>, and
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: 13 }}> page.locator('pierce/...')</code>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>Widget 1 — Form</div>
            <shadow-demo-widget ref={formRef} data-testid="shadow-demo-widget" />
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>Widget 2 — Counter</div>
            <shadow-counter-widget data-testid="shadow-counter-widget" />
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>Widget 3 — Select</div>
          <shadow-select-widget data-testid="shadow-select-widget" />
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>Playwright Examples</div>
          <code style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)", display: "block", lineHeight: 2, whiteSpace: "pre" }}>
{`// Form widget
const widget = page.locator('shadow-demo-widget');
await widget.locator('pierce/[data-shadow-input]').fill('Hello');
await widget.locator('pierce/[data-shadow-submit]').click();

// Counter widget
await page.locator('pierce/[data-inc]').click();
const count = await page.locator('pierce/[data-count]').textContent();

// Select widget
await page.locator('pierce/[data-shadow-select]').selectOption('playwright');`}
          </code>
        </div>
      </div>
    </div>
  );
}
