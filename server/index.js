require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const path = require("path");
const { startReminderScheduler } = require("./services/reminderScheduler");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/auth", require("./routes/passwordReset"));
app.use("/api/cars", require("./routes/cars"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/users", require("./routes/users"));
app.use("/api/contact", require("./routes/contact"));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Start reminder scheduler
try {
  startReminderScheduler();
} catch (error) {
  console.error("Failed to start reminder scheduler:", error.message);
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
