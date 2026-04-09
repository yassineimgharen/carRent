const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/cars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only images are allowed"));
  }
});

router.get("/", (req, res) => {
  const { category, available } = req.query;
  let query = "SELECT * FROM cars WHERE 1=1";
  const params = [];
  if (category) { query += " AND category = ?"; params.push(category); }
  if (available !== undefined) { query += " AND is_available = ?"; params.push(available === "true" ? 1 : 0); }
  query += " ORDER BY created_at DESC";
  res.json(db.prepare(query).all(...params));
});

router.get("/:id/images", (req, res) => {
  const images = db.prepare("SELECT * FROM car_images WHERE car_id = ? ORDER BY display_order ASC").all(req.params.id);
  res.json(images.map(img => ({
    ...img,
    image_url: img.image_url.startsWith('http') ? img.image_url : `http://localhost:4000${img.image_url}`
  })));
});

router.get("/:id", (req, res) => {
  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id);
  if (!car) return res.status(404).json({ error: "Car not found" });
  res.json(car);
});

router.post("/", auth, adminOnly, (req, res) => {
  const { name, brand, category, price_per_day, image_url, description, seats, transmission, fuel_type, is_available, is_featured } = req.body;
  if (!name || !brand || !category || !price_per_day) return res.status(400).json({ error: "Missing required fields" });
  const result = db.prepare(
    "INSERT INTO cars (name, brand, category, price_per_day, image_url, description, seats, transmission, fuel_type, is_available, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(name, brand, category, price_per_day, image_url || null, description || null, seats || 5, transmission || "Automatic", fuel_type || "Gasoline", is_available !== false ? 1 : 0, is_featured ? 1 : 0);
  res.status(201).json(db.prepare("SELECT * FROM cars WHERE id = ?").get(result.lastInsertRowid));
});

router.post("/upload", auth, adminOnly, upload.array("images", 10), (req, res) => {
  const { car_id } = req.body;
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });
  
  const images = req.files.map((file, index) => {
    const imageUrl = `/uploads/cars/${file.filename}`;
    if (car_id) {
      const result = db.prepare(
        "INSERT INTO car_images (car_id, image_url, display_order) VALUES (?, ?, ?)"
      ).run(car_id, imageUrl, index);
      return { id: result.lastInsertRowid, car_id, image_url: imageUrl, display_order: index };
    }
    return { image_url: imageUrl, filename: file.filename };
  });
  
  res.json({ images });
});

router.post("/save-images", auth, adminOnly, (req, res) => {
  const { car_id, existing_images } = req.body;
  if (!car_id) return res.status(400).json({ error: "car_id required" });

  const imageList = Array.isArray(existing_images) ? existing_images : [existing_images];
  imageList.forEach((filename, index) => {
    if (filename) {
      const imageUrl = `/uploads/cars/${filename}`;
      db.prepare(
        "INSERT INTO car_images (car_id, image_url, display_order) VALUES (?, ?, ?)"
      ).run(car_id, imageUrl, index);
    }
  });

  res.json({ success: true });
});

router.put("/:id", auth, adminOnly, (req, res) => {
  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id);
  if (!car) return res.status(404).json({ error: "Car not found" });
  const { name, brand, category, price_per_day, image_url, description, seats, transmission, fuel_type, is_available, is_featured } = req.body;
  db.prepare(
    "UPDATE cars SET name=?, brand=?, category=?, price_per_day=?, image_url=?, description=?, seats=?, transmission=?, fuel_type=?, is_available=?, is_featured=?, updated_at=datetime('now') WHERE id=?"
  ).run(name ?? car.name, brand ?? car.brand, category ?? car.category, price_per_day ?? car.price_per_day, image_url ?? car.image_url, description ?? car.description, seats ?? car.seats, transmission ?? car.transmission, fuel_type ?? car.fuel_type, is_available !== undefined ? (is_available ? 1 : 0) : car.is_available, is_featured !== undefined ? (is_featured ? 1 : 0) : car.is_featured, req.params.id);
  res.json(db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id));
});

router.delete("/:id", auth, adminOnly, (req, res) => {
  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(req.params.id);
  if (!car) return res.status(404).json({ error: "Car not found" });
  db.prepare("DELETE FROM cars WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
