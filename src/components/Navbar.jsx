import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Navbar({ onCartOpen }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const labsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  useEffect(() => {
    function handler(e) {
      if (labsRef.current && !labsRef.current.contains(e.target)) {
        setLabsOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLink = (path, label, testId) => (
    <Link
      to={path}
      data-testid={testId}
      style={{
        fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
        color: location.pathname.startsWith(path) ? "var(--accent)" : "var(--text-muted)",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => { if (!location.pathname.startsWith(path)) e.currentTarget.style.color = "var(--text)"; }}
      onMouseLeave={(e) => { if (!location.pathname.startsWith(path)) e.currentTarget.style.color = "var(--text-muted)"; }}
    >
      {label}
    </Link>
  );

  const LABS = [
    { path: "/shadow-dom",    label: "Shadow DOM",    icon: "🌑", testId: "nav-shadow-dom" },
    { path: "/frames",        label: "Frames",        icon: "🖼",  testId: "nav-frames" },
    { path: "/nested-scroll", label: "Nested Scroll", icon: "↕",  testId: "nav-nested-scroll" },
  ];

  const labsActive = LABS.some(l => location.pathname.startsWith(l.path));

  return (
    <nav
      data-testid="navbar"
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "var(--nav-h)", zIndex: 1000,
        background: "rgba(10,10,10,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", padding: "0 32px", gap: 28,
      }}
    >
      <Link to="/" data-testid="nav-logo" style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.12em", color: "var(--accent)", lineHeight: 1, marginRight: "auto" }}>
        VAULT
      </Link>

      {navLink("/shop", "Shop", "nav-shop")}

      <div ref={labsRef} style={{ position: "relative" }}>
        <button
          data-testid="nav-labs-btn"
          onClick={() => setLabsOpen((v) => !v)}
          style={{
            background: "transparent", border: "none", cursor: "pointer", padding: 0,
            fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
            color: labsActive ? "var(--accent)" : labsOpen ? "var(--text)" : "var(--text-muted)",
            display: "flex", alignItems: "center", gap: 5, transition: "color 0.2s",
          }}
        >
          Labs <span style={{ fontSize: 7, marginTop: 1 }}>▼</span>
        </button>
        {labsOpen && (
          <div
            data-testid="labs-dropdown"
            style={{
              position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)",
              background: "var(--surface-2)", border: "1px solid var(--border-bright)",
              borderRadius: "var(--radius)", minWidth: 180, overflow: "hidden",
              boxShadow: "var(--shadow)", animation: "fadeUp 0.15s ease both",
            }}
          >
            {LABS.map((l) => (
              <Link
                key={l.path} to={l.path} data-testid={l.testId}
                onClick={() => setLabsOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: location.pathname.startsWith(l.path) ? "var(--accent)" : "var(--text-muted)",
                  borderBottom: "1px solid var(--border)", transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = location.pathname.startsWith(l.path) ? "var(--accent)" : "var(--text-muted)"; }}
              >
                <span>{l.icon}</span>{l.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {navLink("/about", "About", "nav-about")}

      <button
        data-testid="cart-btn"
        onClick={() => onCartOpen?.()}
        style={{
          background: "transparent", border: "1px solid var(--border-bright)", color: "var(--text)",
          borderRadius: "var(--radius)", padding: "8px 14px", display: "flex", alignItems: "center",
          gap: 8, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
          transition: "all 0.2s", cursor: "pointer",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        Cart
        {count > 0 && (
          <span data-testid="cart-count" style={{ background: "var(--accent)", color: "var(--bg)", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
            {count}
          </span>
        )}
      </button>

      {user ? (
        <div style={{ position: "relative" }}>
          <button
            data-testid="user-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            style={{ background: "transparent", border: "1px solid var(--border-bright)", color: "var(--accent)", borderRadius: "var(--radius)", padding: "8px 14px", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
          >
            <span data-testid="nav-username">{user.name || user.email}</span>
            <span style={{ fontSize: 8 }}>▼</span>
          </button>
          {menuOpen && (
            <div data-testid="user-dropdown" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--surface-2)", border: "1px solid var(--border-bright)", borderRadius: "var(--radius)", minWidth: 160, overflow: "hidden", boxShadow: "var(--shadow)" }}>
              <Link to="/orders" data-testid="nav-orders" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 16px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                My Orders
              </Link>
              <button data-testid="logout-btn" onClick={handleLogout} style={{ display: "block", width: "100%", padding: "12px 16px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--danger)", background: "transparent", border: "none", textAlign: "left", cursor: "pointer" }}>
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" data-testid="login-link" className="btn btn-primary" style={{ fontSize: 12 }}>
          Sign In
        </Link>
      )}
    </nav>
  );
}
