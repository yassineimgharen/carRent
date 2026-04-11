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
    car_id INTEGER REFERENCES cars(id) ON DELETE SET NULL,
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
    language TEXT DEFAULT 'fr',
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
