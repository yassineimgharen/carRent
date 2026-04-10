const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "wheelie.db"));

console.log("🔄 Fixing created_at timestamps for seed bookings...\n");

try {
  // Find all bookings with date-only timestamps (no time component)
  const bookingsToFix = db.prepare(`
    SELECT id, customer_name, created_at 
    FROM bookings 
    WHERE created_at NOT LIKE '%:%'
  `).all();

  console.log(`Found ${bookingsToFix.length} bookings with date-only timestamps\n`);

  // Update each one to have a proper datetime format
  // Set time to 00:00:00 so they appear older than new bookings
  const updateStmt = db.prepare(`
    UPDATE bookings 
    SET created_at = datetime(created_at || ' 00:00:00')
    WHERE id = ?
  `);

  bookingsToFix.forEach(booking => {
    updateStmt.run(booking.id);
    console.log(`✅ Fixed booking #${booking.id} (${booking.customer_name})`);
  });

  console.log(`\n✅ Fixed ${bookingsToFix.length} bookings`);

  // Verify the fix
  console.log("\n📊 Latest 5 bookings (should show newest first):");
  const latest = db.prepare(`
    SELECT id, customer_name, customer_email, created_at 
    FROM bookings 
    ORDER BY created_at DESC 
    LIMIT 5
  `).all();

  latest.forEach((b, i) => {
    console.log(`  ${i + 1}. #${b.id} - ${b.customer_name} - ${b.created_at}`);
  });

} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}

db.close();
console.log("\n🎉 Timestamps fixed successfully!");
