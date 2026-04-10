const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "wheelie.db"));

console.log("🔄 Starting migration: Preserve bookings when car is deleted...");

try {
  // Start transaction
  db.exec("BEGIN TRANSACTION");

  // 1. Create new bookings table with updated foreign key constraint
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings_new (
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
    )
  `);

  // 2. Copy all data from old table to new table
  db.exec(`
    INSERT INTO bookings_new 
    SELECT * FROM bookings
  `);

  // 3. Drop old table
  db.exec("DROP TABLE bookings");

  // 4. Rename new table to original name
  db.exec("ALTER TABLE bookings_new RENAME TO bookings");

  // Commit transaction
  db.exec("COMMIT");

  console.log("✅ Migration completed successfully!");
  console.log("✅ Bookings will now be preserved when cars are deleted");
  console.log("✅ Deleted car bookings will show car_id as NULL");

} catch (error) {
  // Rollback on error
  db.exec("ROLLBACK");
  console.error("❌ Migration failed:", error.message);
  process.exit(1);
}

db.close();
