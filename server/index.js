require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const path = require("path");
const { startReminderScheduler } = require("./services/reminderScheduler");

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 4000;

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL]
  : [/^http:\/\/localhost:\d+$/];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/auth", require("./routes/passwordReset"));
app.use("/api/cars", require("./routes/cars"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/users", require("./routes/users"));
app.use("/api/contact", require("./routes/contact"));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }
  });
}

// Start reminder scheduler
try {
  startReminderScheduler();
} catch (error) {
  console.error("Failed to start reminder scheduler:", error.message);
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
