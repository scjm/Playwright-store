import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import pb from "../lib/pb";
import { useState } from "react";

export default function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, updateQty, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  async function placeOrder() {
    if (!user) {
      navigate("/login");
      onClose();
      return;
    }
    if (items.length === 0) return;
    setPlacing(true);
    setError("");
    try {
      const orderRecord = await pb.collection("orders").create({
        user: user.id,
        items: JSON.stringify(
          items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))
        ),
        total: total,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      // Navigate immediately — don't let stock update block the confirmation page
      clearCart();
      onClose();
      navigate(`/orders/${orderRecord.id}`);

      // Update stock in background (best-effort) using raw fetch for PocketBase v0.23
      const pbUrl = "https://pocketbase-railway-production-ad2d.up.railway.app";
      for (const item of items) {
        try {
          const getRes = await fetch(`${pbUrl}/api/collections/products/records/${item.id}`, {
            headers: { Authorization: pb.authStore.token }
          });
          const product = await getRes.json();
          await fetch(`${pbUrl}/api/collections/products/records/${item.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: pb.authStore.token
            },
            body: JSON.stringify({ stock: Math.max(0, product.stock - item.qty) })
          });
        } catch (stockErr) {
          console.warn("Stock update failed for", item.name, stockErr);
        }
      }
    } catch (e) {
      setError("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="cart-backdrop"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 1001,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />

      {/* Drawer */}
      <div
        data-testid="cart-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          zIndex: 1002,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              letterSpacing: "0.1em",
              color: "var(--accent)",
            }}
          >
            CART
          </span>
          <button
            data-testid="cart-close-btn"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 20,
              cursor: "pointer",
              lineHeight: 1,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Items — nested scroll container */}
        <div
          data-testid="cart-items"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 24px",
          }}
        >
          {items.length === 0 ? (
            <div
              data-testid="cart-empty"
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--text-dim)",
                fontSize: 13,
                letterSpacing: "0.08em",
              }}
            >
              YOUR CART IS EMPTY
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: "var(--surface-2)",
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </div>
                  <div style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <button
                      data-testid={`cart-dec-${item.id}`}
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{
                        width: 24, height: 24,
                        border: "1px solid var(--border-bright)",
                        background: "transparent",
                        color: "var(--text)",
                        borderRadius: "var(--radius)",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                    <span
                      data-testid={`cart-qty-${item.id}`}
                      style={{ fontFamily: "var(--font-mono)", fontSize: 13, minWidth: 20, textAlign: "center" }}
                    >
                      {item.qty}
                    </span>
                    <button
                      data-testid={`cart-inc-${item.id}`}
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{
                        width: 24, height: 24,
                        border: "1px solid var(--border-bright)",
                        background: "transparent",
                        color: "var(--text)",
                        borderRadius: "var(--radius)",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                    <button
                      data-testid={`cart-remove-${item.id}`}
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        marginLeft: "auto",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-dim)",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--border)",
          }}
        >
          {error && (
            <div style={{ color: "var(--danger)", fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span style={{ color: "var(--text-muted)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Total
            </span>
            <span
              data-testid="cart-total"
              style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--accent)" }}
            >
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            data-testid="checkout-btn"
            className="btn btn-primary"
            onClick={placeOrder}
            disabled={items.length === 0 || placing}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {placing ? "Processing…" : "Place Order"}
          </button>
        </div>
      </div>
    </>
  );
}
