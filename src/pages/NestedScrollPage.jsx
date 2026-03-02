export default function NestedScrollPage() {
  return (
    <div style={{ paddingTop: "var(--nav-h)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>

        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
          Testing Playground
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 64, letterSpacing: "0.06em", lineHeight: 1, marginBottom: 16 }}>
          NESTED SCROLL
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: 600, lineHeight: 1.8, marginBottom: 48 }}>
          Nested horizontal and vertical scroll containers. Practice
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: 13 }}> mouse.wheel()</code>,
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: 13 }}> locator.evaluate()</code>, and
          scroll-into-view interactions.
        </p>

        {/* Scenario 1: Vertical outer, horizontal inner */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Scenario 1 — Vertical outer / Horizontal inner
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 16 }}>
            SCROLL INSIDE SCROLL
          </h2>
          <div
            data-testid="outer-scroll"
            style={{ height: 320, overflowY: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface)", padding: "20px 20px 0" }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16 }}>↕ Scroll this container vertically. Each row scrolls horizontally.</p>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                  ROW {i + 1}
                </div>
                <div
                  data-testid={`inner-scroll-${i}`}
                  style={{ overflowX: "auto", display: "flex", gap: 8, paddingBottom: 8 }}
                >
                  {Array.from({ length: 12 }, (_, j) => (
                    <div
                      key={j}
                      data-testid={`scroll-cell-${i}-${j}`}
                      style={{
                        flexShrink: 0, width: 90, height: 56,
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)",
                      }}
                    >
                      {i},{j}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <CodeBlock code={`// Scroll the outer container vertically
const outer = page.getByTestId('outer-scroll');
await outer.evaluate(el => el.scrollTop = 200);

// Scroll an inner row horizontally
const inner = page.getByTestId('inner-scroll-0');
await inner.evaluate(el => el.scrollLeft = 300);

// Or use mouse wheel
await inner.hover();
await page.mouse.wheel(200, 0); // horizontal`} />
        </section>

        {/* Scenario 2: Infinite-style long list */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Scenario 2 — Long list scroll
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 16 }}>
            SCROLL TO ITEM
          </h2>
          <div
            data-testid="long-list"
            style={{ height: 280, overflowY: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface)" }}
          >
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                data-testid={`list-item-${i}`}
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)", fontSize: 11 }}>
                  ITEM {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  {["Coffee Beans", "Espresso Cup", "Pour-Over Kit", "Travel Mug", "Burr Grinder"][i % 5]}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)" }}>
                  ${((i + 1) * 7.99).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <CodeBlock code={`// Scroll to a specific item deep in the list
const item = page.getByTestId('list-item-35');
await item.scrollIntoViewIfNeeded();
await expect(item).toBeVisible();

// Or scroll the container to the bottom
const list = page.getByTestId('long-list');
await list.evaluate(el => el.scrollTop = el.scrollHeight);`} />
        </section>

        {/* Scenario 3: Horizontal scroll with sticky first column */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Scenario 3 — Sticky column table
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 16 }}>
            STICKY HEADER SCROLL
          </h2>
          <div
            data-testid="sticky-scroll"
            style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface)" }}
          >
            <table style={{ borderCollapse: "collapse", minWidth: 900, width: "100%" }}>
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  {["Product", "Category", "Price", "Stock", "Sales", "Rating", "SKU"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--text-dim)",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        position: h === "Product" ? "sticky" : "static",
                        left: 0,
                        background: h === "Product" ? "var(--surface-2)" : "transparent",
                        zIndex: h === "Product" ? 1 : "auto",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p, i) => (
                  <tr
                    key={i}
                    data-testid={`table-row-${i}`}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", position: "sticky", left: 0, background: "var(--surface)", zIndex: 1 }}>{p.name}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{p.category}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)", whiteSpace: "nowrap" }}>${p.price}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{p.stock}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{p.sales}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{"★".repeat(p.rating)}{"☆".repeat(5 - p.rating)}</td>
                    <td style={{ padding: "10px 16px", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-dim)", whiteSpace: "nowrap" }}>{p.sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CodeBlock code={`// Scroll the table horizontally
const table = page.getByTestId('sticky-scroll');
await table.evaluate(el => el.scrollLeft = 400);

// The sticky Product column stays visible
// Access a specific row
const row = page.getByTestId('table-row-3');
await expect(row).toBeVisible();`} />
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

const PRODUCTS = [
  { name: "Ceramic Espresso Cup",     category: "Drinkware",   price: "28.00",  stock: 12, sales: 340, rating: 5, sku: "DRW-001" },
  { name: "Pour-Over Coffee Kit",     category: "Equipment",   price: "89.00",  stock: 4,  sales: 128, rating: 4, sku: "EQP-002" },
  { name: "Single Origin Beans 250g", category: "Coffee",      price: "18.00",  stock: 0,  sales: 892, rating: 5, sku: "COF-003" },
  { name: "Stainless Travel Tumbler", category: "Drinkware",   price: "42.00",  stock: 7,  sales: 215, rating: 4, sku: "DRW-004" },
  { name: "Burr Grinder Pro",         category: "Equipment",   price: "145.00", stock: 3,  sales: 67,  rating: 5, sku: "EQP-005" },
  { name: "Cold Brew Jar 1L",         category: "Drinkware",   price: "35.00",  stock: 9,  sales: 183, rating: 3, sku: "DRW-006" },
  { name: "Gooseneck Kettle",         category: "Equipment",   price: "78.00",  stock: 6,  sales: 94,  rating: 4, sku: "EQP-007" },
  { name: "Linen Tote Bag",           category: "Accessories", price: "19.00",  stock: 20, sales: 412, rating: 4, sku: "ACC-008" },
];
