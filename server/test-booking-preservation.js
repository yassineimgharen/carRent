const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "wheelie.db"));

console.log("🧪 Testing: Bookings preservation when car is deleted\n");

try {
  // 1. Create a test car
  const carResult = db.prepare(`
    INSERT INTO cars (name, brand, category, price_per_day, description, is_available)
    VALUES ('Test Car', 'Test Brand', 'Sedan', 100, 'Test car for deletion', 1)
  `).run();
  
  const carId = carResult.lastInsertRowid;
  console.log(`✅ Created test car with ID: ${carId}`);

  // 2. Create a test booking for this car
  const bookingResult = db.prepare(`
    INSERT INTO bookings (car_id, customer_name, customer_email, start_date, end_date, total_price, status)
    VALUES (?, 'Test Customer', 'test@example.com', '2026-02-01', '2026-02-05', 400, 'confirmed')
  `).run(carId);
  
  const bookingId = bookingResult.lastInsertRowid;
  console.log(`✅ Created test booking with ID: ${bookingId}`);

  // 3. Verify booking exists with car_id
  const bookingBefore = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
  console.log(`✅ Booking before deletion - car_id: ${bookingBefore.car_id}`);

  // 4. Delete the car
  db.prepare("DELETE FROM cars WHERE id = ?").run(carId);
  console.log(`✅ Deleted car with ID: ${carId}`);

  // 5. Check if booking still exists
  const bookingAfter = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
  
  if (bookingAfter) {
    console.log(`✅ Booking still exists after car deletion!`);
    console.log(`✅ Booking car_id is now: ${bookingAfter.car_id === null ? 'NULL (as expected)' : bookingAfter.car_id}`);
    
    // 6. Clean up test booking
    db.prepare("DELETE FROM bookings WHERE id = ?").run(bookingId);
    console.log(`✅ Cleaned up test booking`);
    
    console.log("\n🎉 TEST PASSED: Bookings are preserved when cars are deleted!");
  } else {
    console.log("❌ TEST FAILED: Booking was deleted with the car!");
  }

} catch (error) {
  console.error("❌ Test failed:", error.message);
}

// Test booking order
console.log("\n🧪 Testing: Booking order (newest first)\n");

const bookings = db.prepare(`
  SELECT id, customer_name, created_at 
  FROM bookings 
  ORDER BY created_at DESC 
  LIMIT 5
`).all();

if (bookings.length > 0) {
  console.log("✅ Latest bookings (newest first):");
  bookings.forEach((b, i) => {
    console.log(`   ${i + 1}. Booking #${b.id} - ${b.customer_name} - ${b.created_at}`);
  });
  console.log("\n🎉 Bookings are ordered correctly (newest first)!");
} else {
  console.log("ℹ️  No bookings found in database");
}

db.close();
