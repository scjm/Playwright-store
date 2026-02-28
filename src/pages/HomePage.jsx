import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>
      {/* Hero */}
      <section
        data-testid="hero"
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "80px 24px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 24,
            fontFamily: "var(--font-mono)",
          }}
        >
          ✦ Playwright Testing Playground ✦
        </div>
        <h1
          data-testid="hero-title"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(64px, 12vw, 140px)",
            letterSpacing: "0.05em",
            lineHeight: 0.9,
            color: "var(--text)",
            marginBottom: 32,
          }}
        >
          VAULT
        </h1>
        <p
          style={{
            maxWidth: 520,
            color: "var(--text-muted)",
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          A feature-rich e-commerce demo built for Playwright automation practice.
          Shadow DOM, iframes, nested scrolling, auth flows — all in one place.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/shop" className="btn btn-primary" data-testid="hero-shop-btn">
            Browse Shop
          </Link>
          <Link to="/login" className="btn" data-testid="hero-login-btn">
            Sign In
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "fadeUp 1s ease 0.8s both",
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-dim)", textTransform: "uppercase" }}>
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom, var(--accent-dim), transparent)",
            }}
          />
        </div>
      </section>

      {/* Feature badges */}
      <section
        data-testid="features"
        style={{
          padding: "60px 24px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            marginBottom: 32,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
          }}
        >
          Testing Features
        </div>
        <div
          data-testid="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.label}
              data-testid={`feature-${f.slug}`}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  letterSpacing: "0.08em",
                  color: "var(--text)",
                }}
              >
                {f.label}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
                {f.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Nested scroll demo section */}
      <section
        data-testid="nested-scroll-demo"
        style={{
          padding: "60px 24px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            marginBottom: 16,
            fontFamily: "var(--font-mono)",
          }}
        >
          Nested Scroll Demo
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            letterSpacing: "0.06em",
            marginBottom: 24,
          }}
        >
          SCROLL INSIDE SCROLL
        </h2>

        {/* Outer scroll container */}
        <div
          data-testid="outer-scroll"
          style={{
            height: 300,
            overflowY: "auto",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            background: "var(--surface)",
            padding: 24,
          }}
        >
          <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 13 }}>
            ↕ This outer container scrolls vertically. Inside it you'll find an inner horizontal scroll.
          </p>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
                SECTION {i + 1}
              </div>
              {/* Inner horizontal scroll */}
              <div
                data-testid={`inner-scroll-${i}`}
                style={{
                  overflowX: "auto",
                  display: "flex",
                  gap: 8,
                  paddingBottom: 8,
                }}
              >
                {Array.from({ length: 10 }, (_, j) => (
                  <div
                    key={j}
                    data-testid={`scroll-cell-${i}-${j}`}
                    style={{
                      flexShrink: 0,
                      width: 100,
                      height: 60,
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-dim)",
                    }}
                  >
                    {i},{j}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* YouTube iframe embed section */}
      <section
        data-testid="youtube-section"
        style={{
          padding: "60px 24px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            marginBottom: 16,
            fontFamily: "var(--font-mono)",
          }}
        >
          From the Channel
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            letterSpacing: "0.06em",
            marginBottom: 24,
          }}
        >
          LEARN PLAYWRIGHT
        </h2>
        <div
          style={{
            position: "relative",
            aspectRatio: "16/9",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            border: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          {/* iframe - great for Playwright iframe testing */}
          <iframe
            data-testid="youtube-iframe"
            src="https://www.youtube.com/embed/videoseries?list=PLM7ptBsxJm6gG5Gq33REqKnmQPmNPSWGH"
            title="Playwright Testing Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
        <p style={{ marginTop: 12, color: "var(--text-dim)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
          ↑ IFRAME ELEMENT — perfect for testing Playwright's frameLocator() API
        </p>
      </section>

      {/* Footer */}
      <footer
        data-testid="footer"
        style={{
          marginTop: 60,
          padding: "32px 24px",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          color: "var(--text-dim)",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.06em",
        }}
      >
        VAULT — Playwright Testing Shop © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: "🌑", label: "Shadow DOM", slug: "shadow-dom", desc: "Web Components with encapsulated shadow roots for pierce selector practice" },
  { icon: "🖼", label: "iFrames", slug: "iframes", desc: "Embedded iframes including YouTube for frameLocator() testing" },
  { icon: "↕", label: "Nested Scroll", slug: "nested-scroll", desc: "Nested horizontal and vertical scroll containers" },
  { icon: "🔐", label: "Auth Flows", slug: "auth", desc: "Full login, register, logout, and protected routes" },
  { icon: "🛒", label: "Cart & Orders", slug: "cart", desc: "Real cart, order placement, and inventory tracking" },
  { icon: "💾", label: "Live Database", slug: "database", desc: "PocketBase backend with real persistence" },
];
