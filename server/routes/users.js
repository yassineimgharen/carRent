const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/me", auth, (req, res) => {
  const user = db.prepare("SELECT id, email, first_name, last_name, phone, city, role, created_at FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.put("/me", auth, (req, res) => {
  const { first_name, last_name, phone, city } = req.body;
  db.prepare("UPDATE users SET first_name=?, last_name=?, phone=?, city=? WHERE id=?")
    .run(first_name || null, last_name || null, phone || null, city || null, req.user.id);
  const user = db.prepare("SELECT id, email, first_name, last_name, phone, city, role, created_at FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

router.put("/me/password", auth, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) return res.status(400).json({ error: "Both passwords required" });
  if (new_password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!bcrypt.compareSync(current_password, user.password))
    return res.status(401).json({ error: "Current password is incorrect" });
  db.prepare("UPDATE users SET password=? WHERE id=?").run(bcrypt.hashSync(new_password, 10), req.user.id);
  res.json({ success: true });
});

router.get("/", auth, adminOnly, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.city, u.role, u.created_at,
           COUNT(b.id) as booking_count,
           COALESCE(SUM(b.total_price), 0) + COALESCE(u.manual_spent_adjustment, 0) as total_spent
    FROM users u
    LEFT JOIN bookings b ON u.id = b.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();
  res.json(users);
});

router.get("/analytics", auth, adminOnly, (req, res) => {
  const { day, month, year } = req.query;
  
  console.log('Analytics request:', { day, month, year });
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  const thisYear = new Date().getFullYear();
  const lastYear = thisYear - 1;

  const selectedDay = day || today;
  const selectedMonth = month || thisMonth;
  const selectedYear = year || thisYear.toString();

  console.log('Selected periods:', { selectedDay, selectedMonth, selectedYear });

  const dailyRevenue = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings WHERE DATE(created_at) = ?"
  ).get(selectedDay);

  console.log('Daily revenue for', selectedDay, ':', dailyRevenue.revenue);

  const yesterdayRevenue = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings WHERE DATE(created_at) = ?"
  ).get(yesterday);

  const monthlyRevenue = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings WHERE strftime('%Y-%m', created_at) = ?"
  ).get(selectedMonth);

  const lastMonthRevenue = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings WHERE strftime('%Y-%m', created_at) = ?"
  ).get(lastMonth);

  const yearlyRevenue = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings WHERE strftime('%Y', created_at) = ?"
  ).get(selectedYear);

  const lastYearRevenue = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings WHERE strftime('%Y', created_at) = ?"
  ).get(lastYear.toString());

  const totalRevenue = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings"
  ).get();

  const totalBookings = db.prepare("SELECT COUNT(*) as count FROM bookings").get();
  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get();
  const totalCars = db.prepare("SELECT COUNT(*) as count FROM cars").get();

  res.json({
    daily: dailyRevenue.revenue,
    yesterday: yesterdayRevenue.revenue,
    monthly: monthlyRevenue.revenue,
    lastMonth: lastMonthRevenue.revenue,
    yearly: yearlyRevenue.revenue,
    lastYear: lastYearRevenue.revenue,
    total: totalRevenue.revenue,
    bookings: totalBookings.count,
    users: totalUsers.count,
    cars: totalCars.count,
  });
});

router.put("/:id", auth, adminOnly, (req, res) => {
  const { first_name, last_name, email, phone, city, role, total_spent } = req.body;
  const userId = parseInt(req.params.id);
  
  console.log('PUT /users/:id - Received data:', { userId, first_name, last_name, email, phone, city, role, total_spent });
  
  if (!email) return res.status(400).json({ error: "Email is required" });
  
  const existingUser = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, userId);
  if (existingUser) return res.status(400).json({ error: "Email already in use" });
  
  if (total_spent !== undefined) {
    const actualTotal = db.prepare(
      "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE user_id = ?"
    ).get(userId);
    const adjustment = total_spent - actualTotal.total;
    
    console.log('Calculating adjustment:', { total_spent, actualTotal: actualTotal.total, adjustment });
    
    db.prepare(`
      UPDATE users 
      SET first_name=?, last_name=?, email=?, phone=?, city=?, role=?, manual_spent_adjustment=?
      WHERE id=?
    `).run(first_name || null, last_name || null, email, phone || null, city || null, role || "user", adjustment, userId);
  } else {
    console.log('No total_spent provided, skipping adjustment');
    db.prepare(`
      UPDATE users 
      SET first_name=?, last_name=?, email=?, phone=?, city=?, role=?
      WHERE id=?
    `).run(first_name || null, last_name || null, email, phone || null, city || null, role || "user", userId);
  }
  
  const user = db.prepare(`
    SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.city, u.role, u.created_at,
           COUNT(b.id) as booking_count,
           COALESCE(SUM(b.total_price), 0) + COALESCE(u.manual_spent_adjustment, 0) as total_spent
    FROM users u
    LEFT JOIN bookings b ON u.id = b.user_id
    WHERE u.id = ?
    GROUP BY u.id
  `).get(userId);
  
  console.log('Returning updated user:', user);
  res.json(user);
});

module.exports = router;
