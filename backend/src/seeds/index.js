// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DK's Cake World — Database Seed Script
// Run with: npm run seed
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Models ─────────────────────────────────
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Branding = require('../models/Branding');
const About = require('../models/About');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEED DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const categorySeedData = [
  { name: 'Brownies',         slug: 'brownies',         order: 1 },
  { name: 'Pastries',         slug: 'pastries',         order: 2 },
  { name: 'Chocolate Cakes',  slug: 'chocolate-cakes',  order: 3 },
  { name: 'Special Cakes',    slug: 'special-cakes',    order: 4 },
];

// Products keyed by category slug
const productSeedData = {
  brownies: [
    { name: 'Choco Chip Brownie',      halfKg: 270, oneKg: 450, isVeg: true },
    { name: 'Classic Brownie',         halfKg: 250, oneKg: 450, isVeg: true },
    { name: 'Double Chocolate Brownie',halfKg: 300, oneKg: 550, isVeg: true },
    { name: 'Nuts Brownie',            halfKg: 270, oneKg: 500, isVeg: true },
    { name: 'Walnut Brownie',          halfKg: 250, oneKg: 500, isVeg: true },
    { name: 'White Chocolate Brownie', halfKg: 250, oneKg: 500, isVeg: true },
    { name: 'Biscoff Brownie',         halfKg: 350, oneKg: 600, isVeg: true },
  ],
  pastries: [
    { name: 'Black Forest',  halfKg: 400, oneKg: 800,  isVeg: true  },
    { name: 'Black Currant', halfKg: 750, oneKg: 900,  isVeg: true  },
    { name: 'Butterscotch',  halfKg: 450, oneKg: 800,  isVeg: true  },
    { name: 'Irish Coffee',  halfKg: 500, oneKg: 850,  isVeg: false }, // non-veg
    { name: 'Mango',         halfKg: 400, oneKg: 700,  isVeg: true  },
    { name: 'Pineapple',     halfKg: 400, oneKg: 700,  isVeg: true  },
    { name: 'Strawberry',    halfKg: 400, oneKg: 790,  isVeg: true  },
    { name: 'Vanilla',       halfKg: 400, oneKg: 760,  isVeg: true  },
  ],
  'chocolate-cakes': [
    { name: 'Chocolate Cake',    halfKg: 800, oneKg: 1000, isVeg: true },
    { name: 'Chocolate Truffle', halfKg: 900, oneKg: 1200, isVeg: true },
    { name: 'KitKat Cake',       halfKg: 600, oneKg: 900,  isVeg: true },
    { name: 'Nutella Hazelnut',  halfKg: 900, oneKg: 1200, isVeg: true },
    { name: 'Oreo Cake',         halfKg: 700, oneKg: 1000, isVeg: true },
  ],
  'special-cakes': [
    { name: 'Gulab Jamun Cake', halfKg: 400, oneKg: 800, isVeg: true },
    { name: 'Rasamalai Cake',   halfKg: 450, oneKg: 900, isVeg: true },
    { name: 'Rasgulla Cake',    halfKg: 400, oneKg: 800, isVeg: true },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEED FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const seedAdmin = async () => {
  const existing = await Admin.findOne();
  if (existing) {
    console.log('   ⚡ Admin already exists — skipping.');
    return;
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ username: username.toLowerCase().trim(), passwordHash });
  console.log(`   ✅ Admin created: ${username}`);
};

const seedCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) {
    console.log(`   ⚡ ${count} categories already exist — skipping.`);
    return null;
  }

  const created = await Category.insertMany(categorySeedData);
  console.log(`   ✅ ${created.length} categories seeded.`);
  return created;
};

const seedProducts = async (categories) => {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`   ⚡ ${count} products already exist — skipping.`);
    return;
  }

  // If categories were just created, use them; otherwise fetch from DB
  const cats = categories || (await Category.find());

  const categoryMap = {};
  cats.forEach((c) => {
    categoryMap[c.slug] = c._id;
  });

  const productsToInsert = [];

  for (const [slug, items] of Object.entries(productSeedData)) {
    const categoryId = categoryMap[slug];
    if (!categoryId) {
      console.warn(`   ⚠️  No category found for slug: ${slug}`);
      continue;
    }
    items.forEach((item) => {
      productsToInsert.push({
        name: item.name,
        category: categoryId,
        prices: { halfKg: item.halfKg, oneKg: item.oneKg },
        isVeg: item.isVeg,
        imageUrl: '',
        imagePublicId: '',
        description: '',
      });
    });
  }

  await Product.insertMany(productsToInsert);
  console.log(`   ✅ ${productsToInsert.length} products seeded.`);
};

const seedSingletons = async () => {
  // Branding singleton
  const brandingCount = await Branding.countDocuments();
  if (brandingCount === 0) {
    await Branding.create({});
    console.log('   ✅ Branding singleton created.');
  } else {
    console.log('   ⚡ Branding already exists — skipping.');
  }

  // About singleton
  const aboutCount = await About.countDocuments();
  if (aboutCount === 0) {
    await About.create({
      content:
        "Welcome to DK's Cake World! We are a homemade cake business based in Hosur, crafting delicious, freshly baked cakes for every occasion. From rich chocolate cakes to delicate pastries and special occasion cakes, every bite is made with love and the finest ingredients.",
    });
    console.log('   ✅ About singleton created.');
  } else {
    console.log('   ⚡ About already exists — skipping.');
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const runSeed = async () => {
  try {
    console.log('\n🌱 DK\'s Cake World — Seeding Database...\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected.\n');

    console.log('── Seeding Admin ─────────────────────────');
    await seedAdmin();

    console.log('\n── Seeding Categories ────────────────────');
    const newCategories = await seedCategories();

    console.log('\n── Seeding Products ──────────────────────');
    await seedProducts(newCategories);

    console.log('\n── Seeding Singletons ────────────────────');
    await seedSingletons();

    console.log('\n🎂 Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
};

runSeed();
