const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "wheelie.db"));

console.log("🔄 Setting seed bookings to older dates...\n");

try {
  // Find the earliest real booking (not seed data)
  // Real bookings have customer names like "yassine fakihi", "lmilan imgharen"
  // Seed bookings have names like "Customer 1", "Recent Customer 1"
  
  const realBookings = db.prepare(`
    SELECT MIN(created_at) as earliest
    FROM bookings 
    WHERE customer_name NOT LIKE 'Customer %' 
      AND customer_name NOT LIKE 'Recent Customer %'
  `).get();

  console.log("Earliest real booking:", realBookings.earliest);

  // Update all seed bookings to be 1 year older than the earliest real booking
  // This ensures they always appear below real bookings
  const result = db.prepare(`
    UPDATE bookings 
    SET created_at = datetime(?, '-1 year')
    WHERE customer_name LIKE 'Customer %' 
       OR customer_name LIKE 'Recent Customer %'
  `).run(realBookings.earliest || '2026-04-10 00:00:00');

  console.log(`\n✅ Updated ${result.changes} seed bookings to older dates`);

  // Verify the fix
  console.log("\n📊 Latest 10 bookings (newest first):");
  const latest = db.prepare(`
    SELECT id, customer_name, customer_email, created_at 
    FROM bookings 
    ORDER BY created_at DESC 
    LIMIT 10
  `).all();

  latest.forEach((b, i) => {
    console.log(`  ${i + 1}. #${b.id} - ${b.customer_name} - ${b.created_at}`);
  });

  console.log("\n✅ Now all real bookings will appear at the top!");

} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}

db.close();
console.log("\n🎉 Seed bookings moved to older dates successfully!");
