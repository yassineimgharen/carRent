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

router.get("/:id", (req, res) => {
  const booking = db.prepare(`
    SELECT b.*, c.name as car_name, c.brand as car_brand, c.image_url, c.category
    FROM bookings b
    LEFT JOIN cars c ON b.car_id = c.id
    WHERE b.id = ?
  `).get(req.params.id);
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  // Return booking with car details
  res.json({
    ...booking,
    car: {
      name: booking.car_name,
      brand: booking.car_brand,
      image_url: booking.image_url,
      category: booking.category
    }
  });
});

router.post("/", async (req, res) => {
  const { car_id, customer_name, customer_email, customer_phone, cin, driver_license, start_date, end_date, total_price, payment_method, language } = req.body;
  if (!car_id || !customer_name || !customer_email || !start_date || !end_date || !total_price)
    return res.status(400).json({ error: "Missing required fields" });

  const carId = Number(car_id);
  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(carId);
  if (!car) return res.status(400).json({ error: "Car not found" });

  // Check if car is available
  if (!car.is_available) {
    return res.status(400).json({ error: "This car is currently unavailable" });
  }

  // Get user_id from token if logged in
  const token = req.headers.authorization?.split(" ")[1];
  let user_id = null;
  if (token) {
    try {
      const jwt = require("jsonwebtoken");
      const { SECRET } = require("../middleware/auth");
      user_id = jwt.verify(token, SECRET).id;
    } catch {}
  }

  // Check if THIS USER already has an overlapping booking for this car
  // Two bookings overlap if: NOT (booking1_end <= booking2_start OR booking1_start >= booking2_end)
  // Simplified: booking1_end > booking2_start AND booking1_start < booking2_end
  let userConflict = null;
  if (user_id) {
    // Check by user_id for logged-in users
    userConflict = db.prepare(
      "SELECT id, start_date, end_date FROM bookings WHERE car_id = ? AND user_id = ? AND status IN ('pending','confirmed') AND end_date > ? AND start_date < ?"
    ).get(carId, user_id, start_date, end_date);
  } else {
    // Check by email for non-logged-in users
    userConflict = db.prepare(
      "SELECT id, start_date, end_date FROM bookings WHERE car_id = ? AND customer_email = ? AND status IN ('pending','confirmed') AND end_date > ? AND start_date < ?"
    ).get(carId, customer_email, start_date, end_date);
  }

  if (userConflict) {
    return res.status(409).json({ 
      error: `You already have a booking for this car from ${userConflict.start_date} to ${userConflict.end_date}. Please cancel it first or choose different dates.` 
    });
  }

  const result = db.prepare(
    "INSERT INTO bookings (car_id, user_id, customer_name, customer_email, customer_phone, cin, driver_license, start_date, end_date, total_price, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(carId, user_id, customer_name, customer_email, customer_phone || null, cin || null, driver_license || null, start_date, end_date, total_price, payment_method || "card", "pending");

  const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(result.lastInsertRowid);

  // Send emails
  const { sendBookingConfirmation, sendAdminNotification } = require("../services/emailService");
  sendBookingConfirmation(booking, car).catch(err => console.error("Email error:", err));
  sendAdminNotification(booking, car).catch(err => console.error("Admin email error:", err));

  res.status(201).json(booking);
});

router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!["pending", "confirmed", "completed", "cancelled"].includes(status))
    return res.status(400).json({ error: "Invalid status" });
  
  const booking = db.prepare(`
    SELECT b.*, c.name as car_name, c.brand as car_brand
    FROM bookings b
    LEFT JOIN cars c ON b.car_id = c.id
    WHERE b.id = ?
  `).get(req.params.id);

  if (!booking) return res.status(404).json({ error: "Booking not found" });

  db.prepare("UPDATE bookings SET status=?, updated_at=datetime('now') WHERE id=?").run(status, req.params.id);
  
  // Send status change email
  const { sendStatusChangeEmail } = require("../services/emailService");
  const car = { name: booking.car_name, brand: booking.car_brand };
  sendStatusChangeEmail({ ...booking, status }, car, status).catch(err => console.error("Email error:", err));

  res.json({ success: true });
});

router.delete("/:id", auth, (req, res) => {
  const bookingId = req.params.id;
  const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  // Allow users to delete their own pending bookings (by user_id or email), or admin to delete any booking
  const isOwner = booking.user_id === req.user.id || booking.customer_email === req.user.email;
  if (req.user.role !== "admin" && (!isOwner || booking.status !== "pending")) {
    return res.status(403).json({ error: "You can only cancel your own pending bookings" });
  }

  db.prepare("DELETE FROM bookings WHERE id = ?").run(bookingId);
  res.json({ success: true });
});

module.exports = router;
