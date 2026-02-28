import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Navbar({ onCartOpen }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  return (
    <nav
        data-testid="navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "var(--nav-h)",
          zIndex: 1000,
          background: "rgba(10,10,10,0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          gap: 32,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          data-testid="nav-logo"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            letterSpacing: "0.12em",
            color: "var(--accent)",
            lineHeight: 1,
            marginRight: "auto",
          }}
        >
          VAULT
        </Link>

        {/* Nav Links */}
        <Link
          to="/shop"
          data-testid="nav-shop"
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: location.pathname.startsWith("/shop")
              ? "var(--accent)"
              : "var(--text-muted)",
            transition: "color 0.2s",
          }}
        >
          Shop
        </Link>

        <Link
          to="/about"
          data-testid="nav-about"
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: location.pathname === "/about"
              ? "var(--accent)"
              : "var(--text-muted)",
            transition: "color 0.2s",
          }}
        >
          About
        </Link>

        {/* Cart Button */}
        <button
          data-testid="cart-btn"
          onClick={() => onCartOpen?.()}
          style={{
            background: "transparent",
            border: "1px solid var(--border-bright)",
            color: "var(--text)",
            borderRadius: "var(--radius)",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: "all 0.2s",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-bright)";
            e.currentTarget.style.color = "var(--text)";
          }}
        >
          <CartIcon />
          Cart
          {count > 0 && (
            <span
              data-testid="cart-count"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                borderRadius: "50%",
                width: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              {count}
            </span>
          )}
        </button>

        {/* Auth */}
        {user ? (
          <div style={{ position: "relative" }}>
            <button
              data-testid="user-menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: "transparent",
                border: "1px solid var(--border-bright)",
                color: "var(--accent)",
                borderRadius: "var(--radius)",
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span data-testid="nav-username">{user.name || user.email}</span>
              <span style={{ fontSize: 8 }}>▼</span>
            </button>
            {menuOpen && (
              <div
                data-testid="user-dropdown"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-bright)",
                  borderRadius: "var(--radius)",
                  minWidth: 160,
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                }}
              >
                <Link
                  to="/orders"
                  data-testid="nav-orders"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  My Orders
                </Link>
                <button
                  data-testid="logout-btn"
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--danger)",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            data-testid="login-link"
            className="btn btn-primary"
            style={{ fontSize: 12 }}
          >
            Sign In
          </Link>
        )}
      </nav>
  );
}

function CartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
