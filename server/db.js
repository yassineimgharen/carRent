const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = new Database(path.join(__dirname, "wheelie.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    city TEXT,
    cin TEXT,
    driver_license TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    account_status TEXT NOT NULL DEFAULT 'active',
    status_reason TEXT,
    status_changed_at TEXT,
    status_changed_by INTEGER,
    reset_token TEXT,
    reset_token_expiry TEXT,
    manual_spent_adjustment REAL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price_per_day REAL NOT NULL,
    image_url TEXT,
    description TEXT,
    seats INTEGER NOT NULL DEFAULT 5,
    transmission TEXT NOT NULL DEFAULT 'Automatic',
    fuel_type TEXT NOT NULL DEFAULT 'Gasoline',
    is_available INTEGER NOT NULL DEFAULT 1,
    is_featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS car_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    cin TEXT,
    driver_license TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_price REAL NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'card',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed cars if empty
const count = db.prepare("SELECT COUNT(*) as c FROM cars").get();
if (count.c === 0) {
  const insertCar = db.prepare(`
    INSERT INTO cars (name, brand, category, price_per_day, image_url, description, seats, transmission, fuel_type, is_available, is_featured)
    VALUES (@name, @brand, @category, @price_per_day, @image_url, @description, @seats, @transmission, @fuel_type, @is_available, @is_featured)
  `);
  const insertImg = db.prepare(`INSERT INTO car_images (car_id, image_url, display_order) VALUES (?, ?, ?)`);

  const cars = [
    {
      name: "Model 3", brand: "Tesla", category: "Electric", price_per_day: 120,
      description: "Premium electric sedan with autopilot", seats: 5, transmission: "Automatic", fuel_type: "Electric", is_available: 1, is_featured: 1,
      image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
        "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
      ],
    },
    {
      name: "Mustang GT", brand: "Ford", category: "Sports", price_per_day: 150,
      description: "Iconic American muscle car", seats: 4, transmission: "Manual", fuel_type: "Gasoline", is_available: 1, is_featured: 1,
      image_url: "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=800&q=80",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
        "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80",
      ],
    },
    {
      name: "X5", brand: "BMW", category: "SUV", price_per_day: 180,
      description: "Luxury SUV with all-wheel drive", seats: 7, transmission: "Automatic", fuel_type: "Diesel", is_available: 1, is_featured: 1,
      image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
        "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80",
        "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80",
      ],
    },
    {
      name: "Civic", brand: "Honda", category: "Sedan", price_per_day: 60,
      description: "Reliable and fuel-efficient", seats: 5, transmission: "Automatic", fuel_type: "Gasoline", is_available: 1, is_featured: 0,
      image_url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
      ],
    },
    {
      name: "Range Rover", brand: "Land Rover", category: "Luxury", price_per_day: 250,
      description: "Ultimate luxury off-roader", seats: 5, transmission: "Automatic", fuel_type: "Diesel", is_available: 1, is_featured: 0,
      image_url: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&q=80",
        "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      ],
    },
    {
      name: "Clio", brand: "Renault", category: "Compact", price_per_day: 45,
      description: "Compact city car", seats: 5, transmission: "Manual", fuel_type: "Gasoline", is_available: 1, is_featured: 0,
      image_url: "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      ],
    },
  ];

  cars.forEach(({ images, ...car }) => {
    const result = insertCar.run(car);
    images.forEach((url, i) => insertImg.run(result.lastInsertRowid, url, i));
  });
}

// Seed car_images for existing cars if table is empty
const imgCount = db.prepare("SELECT COUNT(*) as c FROM car_images").get();
if (imgCount.c === 0) {
  const insertImg = db.prepare(`INSERT INTO car_images (car_id, image_url, display_order) VALUES (?, ?, ?)`);
  const existingCars = db.prepare("SELECT id, image_url FROM cars").all();
  const extraImages = [
    ["https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80", "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80"],
    ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80", "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80"],
    ["https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80", "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80"],
    ["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80", "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"],
    ["https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"],
    ["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80", "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"],
  ];
  existingCars.forEach((car, idx) => {
    if (car.image_url) insertImg.run(car.id, car.image_url, 0);
    (extraImages[idx] || []).forEach((url, i) => insertImg.run(car.id, url, i + 1));
  });
}

// Seed admin user from .env if no admin exists
const adminExists = db.prepare("SELECT COUNT(*) as c FROM users WHERE email = ?").get(process.env.ADMIN_EMAIL || "admin@drivex.com");
if (adminExists.c === 0) {
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin1234", 10);
  db.prepare(`
    INSERT INTO users (email, password, first_name, last_name, phone, city, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    process.env.ADMIN_EMAIL || "admin@drivex.com",
    hashedPassword,
    process.env.ADMIN_FIRST_NAME || "Admin",
    process.env.ADMIN_LAST_NAME || "User",
    process.env.ADMIN_PHONE || "+212661604965",
    process.env.ADMIN_CITY || "Agadir",
    "admin"
  );
  console.log(`✅ Admin user created: ${process.env.ADMIN_EMAIL || "admin@drivex.com"}`);
}

module.exports = db;
