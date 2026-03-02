/**
 * pb-seed.js — Run this ONCE to create collections + seed product data
 *
 * Usage:
 *   node pb-seed.js
 *
 * Requires PocketBase running on http://127.0.0.1:8090
 * and an admin account created at http://127.0.0.1:8090/_/
 */

import PocketBase from "pocketbase";

const pb = new PocketBase("<enter your pocketbase url her>");

const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "<enter your admin email>";
const ADMIN_PASS  = process.env.PB_ADMIN_PASS  || "<enter yur admin password>";

const PRODUCTS = [
  { name: "Ceramic Espresso Cup",       category: "drinkware",  price: 28,  stock: 12, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=60" },
  { name: "Pour-Over Coffee Kit",        category: "equipment",  price: 89,  stock: 4,  image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=60" },
  { name: "Single Origin Beans 250g",    category: "coffee",     price: 18,  stock: 0,  image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=60" },
  { name: "Stainless Travel Tumbler",    category: "drinkware",  price: 42,  stock: 7,  image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=60" },
  { name: "Burr Grinder Pro",            category: "equipment",  price: 145, stock: 3,  image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400&q=60" },
  { name: "Cold Brew Jar 1L",            category: "drinkware",  price: 35,  stock: 9,  image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=60" },
  { name: "Ethiopian Yirgacheffe 200g",  category: "coffee",     price: 22,  stock: 15, image: "https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?w=400&q=60" },
  { name: "Gooseneck Kettle",            category: "equipment",  price: 78,  stock: 6,  image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=60" },
  { name: "Linen Tote Bag",              category: "accessories",price: 19,  stock: 20, image: "https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=400&q=60" },
  { name: "Digital Coffee Scale",        category: "equipment",  price: 55,  stock: 8,  image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=60" },
];

async function main() {
  console.log("🔐 Authenticating as admin…");
  await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  console.log("✓ Admin authenticated");

  // Create products collection
  console.log("\n📦 Creating 'products' collection…");
  try {
    await pb.collections.create({
      name: "products",
      type: "base",
      fields: [
        { name: "name",        type: "text",   required: true },
        { name: "category",    type: "text",   required: false },
        { name: "price",       type: "number", required: true },
        { name: "stock",       type: "number", required: true },
        { name: "image",       type: "url",    required: false },
        { name: "description", type: "text",   required: false },
      ],
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
    console.log("✓ products collection created");
  } catch (e) {
    if (e.status === 400) console.log("  (products collection already exists, skipping)");
    else throw e;
  }

  // Create orders collection
  console.log("📋 Creating 'orders' collection…");
  try {
    await pb.collections.create({
      name: "orders",
      type: "base",
      fields: [
        { name: "user",   type: "text",   required: true },
        { name: "items",  type: "text",   required: true },
        { name: "total",  type: "number", required: true },
        { name: "status", type: "text",   required: true },
      ],
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: null,
      deleteRule: null,
    });
    console.log("✓ orders collection created");
  } catch (e) {
    if (e.status === 400) console.log("  (orders collection already exists, skipping)");
    else throw e;
  }

  // Seed products
  console.log("\n🌱 Seeding products…");
  for (const p of PRODUCTS) {
    try {
      await pb.collection("products").create(p);
      console.log(`  ✓ ${p.name}`);
    } catch (e) {
      console.log(`  ⚠ ${p.name}: ${e.message}`);
    }
  }

  console.log("\n✅ Seed complete! Your shop is ready.");
  console.log("   Admin UI: http://127.0.0.1:8090/_/");
  console.log("   Web:       http://localhost:5173");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
