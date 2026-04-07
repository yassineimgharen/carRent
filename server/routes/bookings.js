const router = require("express").Router();
const db = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/", auth, adminOnly, (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, c.name as car_name, c.brand as car_brand,
           u.first_name as user_first_name, u.last_name as user_last_name,
           u.email as user_email, u.phone as user_phone, u.city as user_city
    FROM bookings b 
    LEFT JOIN cars c ON b.car_id = c.id
    LEFT JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `).all();
  res.json(bookings);
});

router.get("/my", auth, (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, c.name as car_name, c.brand as car_brand
    FROM bookings b LEFT JOIN cars c ON b.car_id = c.id
    WHERE b.user_id = ? ORDER BY b.created_at DESC
  `).all(req.user.id);
  res.json(bookings);
});

router.get("/car/:carId", (req, res) => {
  const bookings = db.prepare(
    "SELECT * FROM bookings WHERE car_id = ? AND status IN ('pending','confirmed')"
  ).all(req.params.carId);
  res.json(bookings);
});

router.post("/", (req, res) => {
  const { car_id, customer_name, customer_email, customer_phone, start_date, end_date, total_price, payment_method } = req.body;
  if (!car_id || !customer_name || !customer_email || !start_date || !end_date || !total_price)
    return res.status(400).json({ error: "Missing required fields" });

  const carId = Number(car_id);
  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(carId);
  if (!car) return res.status(400).json({ error: "Car not found" });

  // Check date conflicts
  const conflict = db.prepare(
    "SELECT id FROM bookings WHERE car_id = ? AND status IN ('pending','confirmed') AND start_date <= ? AND end_date >= ?"
  ).get(carId, end_date, start_date);
  if (conflict) return res.status(409).json({ error: "Car already booked for these dates" });

  const token = req.headers.authorization?.split(" ")[1];
  let user_id = null;
  if (token) {
    try {
      const jwt = require("jsonwebtoken");
      const { SECRET } = require("../middleware/auth");
      user_id = jwt.verify(token, SECRET).id;
    } catch {}
  }

  const result = db.prepare(
    "INSERT INTO bookings (car_id, user_id, customer_name, customer_email, customer_phone, start_date, end_date, total_price, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(carId, user_id, customer_name, customer_email, customer_phone || null, start_date, end_date, total_price, payment_method || "card", "pending");

  res.status(201).json(db.prepare("SELECT * FROM bookings WHERE id = ?").get(result.lastInsertRowid));
});

router.patch("/:id/status", auth, adminOnly, (req, res) => {
  const { status } = req.body;
  if (!["pending", "confirmed", "completed", "cancelled"].includes(status))
    return res.status(400).json({ error: "Invalid status" });
  db.prepare("UPDATE bookings SET status=?, updated_at=datetime('now') WHERE id=?").run(status, req.params.id);
  res.json({ success: true });
});

router.delete("/:id", auth, adminOnly, (req, res) => {
  db.prepare("DELETE FROM bookings WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
