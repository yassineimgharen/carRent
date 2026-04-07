const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { SECRET } = require("../middleware/auth");

router.post("/register", (req, res) => {
  const { email, password, first_name, last_name, phone, city } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    "INSERT INTO users (email, password, first_name, last_name, phone, city) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(email, hashed, first_name || null, last_name || null, phone || null, city || null);

  const user = db.prepare("SELECT id, email, first_name, last_name, phone, city, role, created_at FROM users WHERE id = ?").get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: "Invalid email or password" });

  const { password: _, ...safeUser } = user;
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: safeUser });
});

module.exports = router;
