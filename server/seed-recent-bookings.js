const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "wheelie.db"));

const cars = db.prepare("SELECT id FROM cars").all();
const users = db.prepare("SELECT id FROM users").all();

if (cars.length === 0 || users.length === 0) {
  console.log("❌ No cars or users found.");
  process.exit(1);
}

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const insertBooking = db.prepare(`
  INSERT INTO bookings (
    car_id, user_id, customer_name, customer_email, customer_phone,
    cin, driver_license, start_date, end_date, total_price,
    payment_method, status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const statuses = ['pending', 'confirmed', 'completed'];
const paymentMethods = ['cash', 'card'];

console.log("Creating bookings for the last 8 weeks...\n");

let created = 0;
// Create 3-5 bookings per week for the last 8 weeks
for (let week = 0; week < 8; week++) {
  const bookingsThisWeek = getRandomInt(3, 5);
  
  for (let i = 0; i < bookingsThisWeek; i++) {
    const daysAgo = (week * 7) + getRandomInt(0, 6);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const createdAt = date.toISOString().split('T')[0];
    
    const startDate = createdAt;
    const endDateObj = new Date(startDate);
    endDateObj.setDate(endDateObj.getDate() + getRandomInt(3, 7));
    const endDate = endDateObj.toISOString().split('T')[0];
    
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const pricePerDay = getRandomInt(400, 1500);
    const totalPrice = days * pricePerDay;
    
    try {
      insertBooking.run(
        getRandomElement(cars).id,
        getRandomElement(users).id,
        `Recent Customer ${created + 1}`,
        `recent${created + 1}@example.com`,
        `+212${getRandomInt(600000000, 699999999)}`,
        `AB${getRandomInt(100000, 999999)}`,
        `DL${getRandomInt(100000, 999999)}`,
        startDate,
        endDate,
        totalPrice,
        getRandomElement(paymentMethods),
        getRandomElement(statuses),
        createdAt
      );
      created++;
    } catch (error) {
      console.error(`Error:`, error.message);
    }
  }
  
  console.log(`Week ${week + 1}: Created ${bookingsThisWeek} bookings`);
}

console.log(`\n✅ Created ${created} recent bookings for the last 8 weeks!`);

// Show weekly summary
const weeklyData = db.prepare(`
  SELECT 
    strftime('%Y-W%W', created_at) as week,
    COUNT(*) as bookings,
    COALESCE(SUM(total_price), 0) as revenue
  FROM bookings
  WHERE created_at >= date('now', '-8 weeks')
  GROUP BY strftime('%Y-W%W', created_at)
  ORDER BY week ASC
`).all();

console.log("\n📊 Weekly Revenue (Last 8 Weeks):");
weeklyData.forEach(w => {
  console.log(`  ${w.week}: ${w.bookings} bookings, ${w.revenue} DH`);
});

db.close();
console.log("\n✅ Done! Refresh your Charts tab to see the weekly data.");
