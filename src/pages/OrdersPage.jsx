import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import pb from "../lib/pb";
import { useAuth } from "../hooks/useAuth";

export default function OrdersPage() {
  const { user } = useAuth();
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      try {
        const records = await pb.collection("orders").getFullList({
          filter: `user = "${user.id}"`,
          sort: "-created",
        });
        setOrders(records);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const highlighted = orderId ? orders.find((o) => o.id === orderId) : null;

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
          Account
        </div>
        <h1
          data-testid="orders-title"
          style={{ fontFamily: "var(--font-display)", fontSize: 48, letterSpacing: "0.06em", marginBottom: 32 }}
        >
          MY ORDERS
        </h1>

        {highlighted && (
          <div
            data-testid="order-success-banner"
            style={{
              background: "rgba(68, 170, 102, 0.1)",
              border: "1px solid rgba(68, 170, 102, 0.3)",
              color: "var(--success)",
              padding: "14px 18px",
              borderRadius: "var(--radius)",
              fontSize: 13,
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>✓ Order #{orderId.slice(0, 8).toUpperCase()} placed successfully!</span>
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: "var(--radius)" }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div
            data-testid="no-orders"
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--text-dim)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.1em",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>◻</div>
            NO ORDERS YET
            <div style={{ marginTop: 16 }}>
              <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((order) => {
              const items = JSON.parse(order.items || "[]");
              const isNew = order.id === orderId;
              return (
                <div
                  key={order.id}
                  data-testid={`order-${order.id}`}
                  style={{
                    background: isNew ? "rgba(200, 169, 110, 0.06)" : "var(--surface)",
                    border: `1px solid ${isNew ? "var(--accent-dim)" : "var(--border)"}`,
                    borderRadius: "var(--radius)",
                    padding: "20px",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--text-dim)",
                          letterSpacing: "0.08em",
                          marginBottom: 4,
                        }}
                      >
                        ORDER #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {new Date(order.created).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric"
                        })}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 16,
                          color: "var(--accent)",
                          marginBottom: 4,
                        }}
                      >
                        ${parseFloat(order.total).toFixed(2)}
                      </div>
                      <span
                        data-testid={`order-status-${order.id}`}
                        style={{
                          fontSize: 10,
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: order.status === "shipped" ? "var(--success)" : "var(--accent-dim)",
                          background: order.status === "shipped" ? "rgba(68,170,102,0.1)" : "rgba(200,169,110,0.1)",
                          padding: "2px 8px",
                          borderRadius: 2,
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
