const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "wheelie.db"));

console.log("🔄 Fixing bookings data migration...\n");

try {
  // First, let's check if we have a backup or need to restore from the old structure
  // Check current data
  const sampleBooking = db.prepare("SELECT * FROM bookings WHERE id = 57").get();
  console.log("Sample booking (ID 57):", sampleBooking);
  
  // The issue: columns were copied in wrong order during migration
  // We need to check if there's a backup table or if we need to fix the data
  
  // Let's check what tables exist
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("\nAvailable tables:", tables.map(t => t.name));
  
  // If the data is corrupted, we need to know the original column order
  // Based on the output, it seems the old table had this order:
  // id, car_id, user_id, customer_name, customer_email, customer_phone, 
  // start_date, end_date, total_price, payment_method, status, created_at, updated_at, cin, driver_license, language
  
  console.log("\n⚠️  Data appears to be in wrong column positions");
  console.log("This happened because the old table had cin/driver_license at the end");
  console.log("But the new table has them in the middle");
  
} catch (error) {
  console.error("❌ Error:", error.message);
}

db.close();
