import { useEffect, useRef } from "react";
import { useCart } from "../hooks/useCart";

// ProductCard wraps the "Add to Cart" badge in a Web Component (shadow DOM)
// This is intentional for Playwright testing practice
class AddToCartWidget extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const price = this.getAttribute("price");
    const stock = parseInt(this.getAttribute("stock") || "0");
    const outOfStock = stock === 0;

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .price {
          font-family: 'DM Mono', monospace;
          font-size: 18px;
          color: #c8a96e;
        }
        button {
          padding: 8px 16px;
          background: ${outOfStock ? "transparent" : "#c8a96e"};
          color: ${outOfStock ? "#555550" : "#0a0a0a"};
          border: 1px solid ${outOfStock ? "#2a2a2a" : "#c8a96e"};
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: ${outOfStock ? "not-allowed" : "pointer"};
          transition: all 0.2s;
        }
        button:not(:disabled):hover {
          background: #e0c080;
          border-color: #e0c080;
        }
        .stock {
          font-size: 10px;
          color: ${stock < 5 && stock > 0 ? "#cc8844" : "#555550"};
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
        }
      </style>
      <div class="wrap">
        <div>
          <div class="price">$${parseFloat(price).toFixed(2)}</div>
          <div class="stock">${
            outOfStock ? "OUT OF STOCK" : stock < 5 ? `ONLY ${stock} LEFT` : `${stock} IN STOCK`
          }</div>
        </div>
        <button data-shadow-btn ${outOfStock ? "disabled" : ""}>
          ${outOfStock ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    `;

    const btn = shadow.querySelector("button");
    if (btn && !outOfStock) {
      btn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("add-to-cart", { bubbles: true, composed: true }));
      });
    }
  }
}

if (!customElements.get("add-to-cart-widget")) {
  customElements.define("add-to-cart-widget", AddToCartWidget);
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const widgetRef = useRef(null);

  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;
    const handler = () => addToCart(product);
    el.addEventListener("add-to-cart", handler);
    return () => el.removeEventListener("add-to-cart", handler);
  }, [product, addToCart]);

  return (
    <article
      data-testid={`product-card-${product.id}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s",
        animation: "fadeUp 0.4s ease both",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-bright)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div
        style={{
          aspectRatio: "4/3",
          background: "var(--surface-2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            data-testid={`product-img-${product.id}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "var(--text-dim)", fontSize: 12, letterSpacing: "0.1em" }}>NO IMAGE</span>
          </div>
        )}
        {product.stock === 0 && (
          <div
            style={{
              position: "absolute", inset: 0,
              background: "rgba(10,10,10,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: "0.15em", color: "var(--text-dim)" }}>
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            marginBottom: 4,
            fontFamily: "var(--font-mono)",
          }}
        >
          {product.category || "ITEM"}
        </div>
        <h3
          data-testid={`product-name-${product.id}`}
          style={{
            fontSize: 15,
            fontWeight: 500,
            marginBottom: 12,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>

        {/* Shadow DOM widget for add to cart */}
        <add-to-cart-widget
          ref={widgetRef}
          data-testid={`product-widget-${product.id}`}
          price={product.price}
          stock={product.stock}
        />
      </div>
    </article>
  );
}
