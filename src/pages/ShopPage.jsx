import { useState, useEffect } from "react";
import pb from "../lib/pb";
import ProductCard from "../components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("name");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const records = await pb.collection("products").getFullList({
          sort: sort === "price_asc" ? "price" : sort === "price_desc" ? "-price" : "name",
        });
        setProducts(records);
      } catch {
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sort]);

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ paddingTop: "var(--nav-h)", minHeight: "100vh" }}>
      {/* Page header */}
      <div
        style={{
          padding: "48px 32px 32px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
            Inventory
          </div>
          <h1
            data-testid="shop-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            THE SHOP
          </h1>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px",
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: 32,
        }}
      >
        {/* Sidebar — scrollable filter panel */}
        <aside
          data-testid="shop-sidebar"
          style={{
            position: "sticky",
            top: "calc(var(--nav-h) + 16px)",
            height: "calc(100vh - var(--nav-h) - 32px)",
            overflowY: "auto",
          }}
        >
          {/* Search */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                fontFamily: "var(--font-mono)",
                marginBottom: 8,
              }}
            >
              Search
            </label>
            <input
              data-testid="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              style={{
                width: "100%",
                background: "var(--surface)",
                border: "1px solid var(--border-bright)",
                color: "var(--text)",
                padding: "8px 12px",
                borderRadius: "var(--radius)",
                fontSize: 13,
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-bright)")}
            />
          </div>

          {/* Sort */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                fontFamily: "var(--font-mono)",
                marginBottom: 8,
              }}
            >
              Sort By
            </label>
            <select
              data-testid="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                width: "100%",
                background: "var(--surface)",
                border: "1px solid var(--border-bright)",
                color: "var(--text)",
                padding: "8px 12px",
                borderRadius: "var(--radius)",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="name">Name A–Z</option>
              <option value="price_asc">Price Low–High</option>
              <option value="price_desc">Price High–Low</option>
            </select>
          </div>

          {/* Categories */}
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                fontFamily: "var(--font-mono)",
                marginBottom: 8,
              }}
            >
              Category
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  data-testid={`cat-${cat}`}
                  onClick={() => setCategory(cat)}
                  style={{
                    background: category === cat ? "var(--accent)" : "transparent",
                    border: "1px solid",
                    borderColor: category === cat ? "var(--accent)" : "var(--border)",
                    color: category === cat ? "var(--bg)" : "var(--text-muted)",
                    borderRadius: "var(--radius)",
                    padding: "7px 12px",
                    fontSize: 12,
                    textAlign: "left",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    transition: "all 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <main data-testid="product-grid">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <span
              data-testid="product-count"
              style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}
            >
              {filtered.length} ITEM{filtered.length !== 1 ? "S" : ""}
            </span>
          </div>

          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ aspectRatio: "3/4", borderRadius: "var(--radius)" }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-testid="no-products"
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--text-dim)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.1em",
              }}
            >
              NO PRODUCTS FOUND
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Fallback products if PocketBase isn't seeded yet
const FALLBACK_PRODUCTS = [
  { id: "1", name: "Ceramic Espresso Cup", category: "drinkware", price: 28, stock: 12, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=60" },
  { id: "2", name: "Pour-Over Coffee Kit", category: "equipment", price: 89, stock: 4, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=60" },
  { id: "3", name: "Single Origin Beans 250g", category: "coffee", price: 18, stock: 0, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=60" },
  { id: "4", name: "Stainless Travel Tumbler", category: "drinkware", price: 42, stock: 7, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=60" },
  { id: "5", name: "Burr Grinder", category: "equipment", price: 145, stock: 3, image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400&q=60" },
  { id: "6", name: "Cold Brew Jar", category: "drinkware", price: 35, stock: 9, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=60" },
];
