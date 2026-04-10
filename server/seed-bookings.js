const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "wheelie.db"));

// Get all cars and users
const cars = db.prepare("SELECT id FROM cars").all();
const users = db.prepare("SELECT id FROM users").all();

if (cars.length === 0) {
  console.log("❌ No cars found. Please add cars first.");
  process.exit(1);
}

if (users.length === 0) {
  console.log("❌ No users found. Please add users first.");
  process.exit(1);
}

console.log(`Found ${cars.length} cars and ${users.length} users`);

// Generate sample bookings for the last 12 months
const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
const paymentMethods = ['cash', 'card'];
const bookingsToCreate = 100;

const insertBooking = db.prepare(`
  INSERT INTO bookings (
    car_id, user_id, customer_name, customer_email, customer_phone,
    cin, driver_license, start_date, end_date, total_price,
    payment_method, status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate dates for the last 12 months
const generateRandomDate = (monthsAgo) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(getRandomInt(1, 28));
  return date.toISOString().split('T')[0];
};

console.log(`\nCreating ${bookingsToCreate} sample bookings...`);

let created = 0;
for (let i = 0; i < bookingsToCreate; i++) {
  const car = getRandomElement(cars);
  const user = getRandomElement(users);
  const monthsAgo = getRandomInt(0, 11);
  const startDate = generateRandomDate(monthsAgo);
  
  // End date is 3-10 days after start
  const endDateObj = new Date(startDate);
  endDateObj.setDate(endDateObj.getDate() + getRandomInt(3, 10));
  const endDate = endDateObj.toISOString().split('T')[0];
  
  // Calculate days and price
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const pricePerDay = getRandomInt(300, 2000);
  const totalPrice = days * pricePerDay;
  
  const status = getRandomElement(statuses);
  const paymentMethod = getRandomElement(paymentMethods);
  
  try {
    insertBooking.run(
      car.id,
      user.id,
      `Customer ${i + 1}`,
      `customer${i + 1}@example.com`,
      `+212${getRandomInt(600000000, 699999999)}`,
      `AB${getRandomInt(100000, 999999)}`,
      `DL${getRandomInt(100000, 999999)}`,
      startDate,
      endDate,
      totalPrice,
      paymentMethod,
      status,
      startDate // created_at same as start_date for simplicity
    );
    created++;
    
    if ((i + 1) % 20 === 0) {
      console.log(`  Created ${i + 1}/${bookingsToCreate} bookings...`);
    }
  } catch (error) {
    console.error(`Error creating booking ${i + 1}:`, error.message);
  }
}

console.log(`\n✅ Successfully created ${created} sample bookings!`);

// Show summary
const summary = db.prepare(`
  SELECT 
    COUNT(*) as total_bookings,
    COALESCE(SUM(total_price), 0) as total_revenue,
    COUNT(DISTINCT car_id) as cars_booked,
    COUNT(DISTINCT user_id) as unique_customers
  FROM bookings
`).get();

console.log("\n📊 Database Summary:");
console.log(`  Total Bookings: ${summary.total_bookings}`);
console.log(`  Total Revenue: ${summary.total_revenue} DH`);
console.log(`  Cars Booked: ${summary.cars_booked}`);
console.log(`  Unique Customers: ${summary.unique_customers}`);

const byStatus = db.prepare(`
  SELECT status, COUNT(*) as count
  FROM bookings
  GROUP BY status
  ORDER BY count DESC
`).all();

console.log("\n📈 Bookings by Status:");
byStatus.forEach(s => {
  console.log(`  ${s.status}: ${s.count}`);
});

db.close();
console.log("\n✅ Done! Refresh your admin dashboard to see the charts.");
