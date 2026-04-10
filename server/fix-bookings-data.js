const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "wheelie.db"));

console.log("🔄 Fixing corrupted bookings data...\n");

try {
  db.exec("BEGIN TRANSACTION");

  // Create a temporary table with correct structure
  db.exec(`
    CREATE TABLE bookings_fixed (
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
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))\n    )
  `);

  // Copy data with EXPLICIT column mapping
  // Old order: id, car_id, user_id, customer_name, customer_email, customer_phone,
  //            start_date, end_date, total_price, payment_method, status, 
  //            created_at, updated_at, cin, driver_license, language
  // Current corrupted: cin and driver_license are in wrong positions
  
  // Map from current corrupted positions to correct positions:
  // cin (pos 6) actually contains start_date
  // driver_license (pos 7) actually contains end_date  
  // start_date (pos 8) actually contains total_price
  // end_date (pos 9) actually contains payment_method
  // total_price (pos 10) actually contains status
  // payment_method (pos 11) actually contains created_at
  // status (pos 12) actually contains updated_at
  // language (pos 13) actually contains cin
  // created_at (pos 14) actually contains driver_license
  // updated_at (pos 15) actually contains language

  db.exec(`
    INSERT INTO bookings_fixed 
    (id, car_id, user_id, customer_name, customer_email, customer_phone,
     cin, driver_license, start_date, end_date, total_price, payment_method, status,
     language, created_at, updated_at)
    SELECT 
      id, car_id, user_id, customer_name, customer_email, customer_phone,
      language, created_at, cin, driver_license, CAST(start_date AS REAL), end_date, total_price,
      updated_at, payment_method, status
    FROM bookings
  `);

  // Drop old table
  db.exec("DROP TABLE bookings");

  // Rename fixed table
  db.exec("ALTER TABLE bookings_fixed RENAME TO bookings");

  db.exec("COMMIT");

  // Verify the fix
  const sample = db.prepare("SELECT * FROM bookings WHERE id = 57").get();
  console.log("✅ Fixed booking (ID 57):");
  console.log("  Customer:", sample.customer_name);
  console.log("  Email:", sample.customer_email);
  console.log("  Start Date:", sample.start_date);
  console.log("  End Date:", sample.end_date);
  console.log("  Total Price:", sample.total_price, "DH");
  console.log("  Payment:", sample.payment_method);
  console.log("  Status:", sample.status);
  console.log("  CIN:", sample.cin);
  console.log("  Driver License:", sample.driver_license);

  // Check total revenue
  const revenue = db.prepare("SELECT SUM(total_price) as total FROM bookings").get();
  console.log("\n✅ Total Revenue:", revenue.total, "DH");

  console.log("\n🎉 Data fixed successfully!");

} catch (error) {
  db.exec("ROLLBACK");
  console.error("❌ Fix failed:", error.message);
  console.error(error.stack);
  process.exit(1);
}

db.close();
