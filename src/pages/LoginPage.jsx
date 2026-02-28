import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate("/shop");
    } catch (err) {
      setError(err?.response?.message || err?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        paddingTop: "var(--nav-h)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "calc(var(--nav-h) + 32px) 24px 64px",
      }}
    >
      <div
        data-testid="auth-card"
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          boxShadow: "var(--shadow)",
          animation: "fadeUp 0.4s ease both",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["login", "register"].map((t) => (
            <button
              key={t}
              data-testid={`tab-${t}`}
              onClick={() => { setTab(t); setError(""); }}
              style={{
                flex: 1,
                padding: "16px",
                background: tab === t ? "var(--surface-2)" : "transparent",
                border: "none",
                color: tab === t ? "var(--accent)" : "var(--text-dim)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <form
          data-testid="auth-form"
          onSubmit={handleSubmit}
          style={{ padding: "32px" }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            {tab === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 28 }}>
            {tab === "login"
              ? "Sign in to your VAULT account"
              : "Join VAULT to start shopping"}
          </div>

          {tab === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 6,
                }}
              >
                Name
              </label>
              <input
                id="name"
                data-testid="input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-bright)")}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                fontFamily: "var(--font-mono)",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              id="email"
              data-testid="input-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-bright)")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                fontFamily: "var(--font-mono)",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              id="password"
              data-testid="input-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-bright)")}
            />
          </div>

          {error && (
            <div
              data-testid="auth-error"
              style={{
                background: "rgba(204,68,68,0.1)",
                border: "1px solid rgba(204,68,68,0.3)",
                color: "var(--danger)",
                padding: "10px 14px",
                borderRadius: "var(--radius)",
                fontSize: 12,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <button
            data-testid="auth-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading
              ? tab === "login" ? "Signing in…" : "Creating account…"
              : tab === "login" ? "Sign In" : "Create Account"}
          </button>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--text-dim)" }}>
            {tab === "login" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  data-testid="switch-to-register"
                  onClick={() => { setTab("register"); setError(""); }}
                  style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12 }}
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Have an account?{" "}
                <button
                  type="button"
                  data-testid="switch-to-login"
                  onClick={() => { setTab("login"); setError(""); }}
                  style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12 }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border-bright)",
  color: "var(--text)",
  padding: "10px 14px",
  borderRadius: "var(--radius)",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
};
