const router = require("express").Router();
const db = require("../db");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService");

// Request password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  
  // Always return success even if user doesn't exist (security best practice)
  if (!user) {
    return res.json({ message: "If an account exists, a reset email has been sent" });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  // Store token in database
  db.prepare(
    "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?"
  ).run(resetToken, resetTokenExpiry.toISOString(), user.id);

  // Send reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken, user.first_name);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Failed to send reset email:", error);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// Validate reset token
router.get("/validate-reset-token", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const user = db.prepare(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > datetime('now')"
  ).get(token);

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  res.json({ valid: true });
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const user = db.prepare(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > datetime('now')"
  ).get(token);

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  // Hash new password
  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password and clear reset token
  db.prepare(
    "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?"
  ).run(hashedPassword, user.id);

  res.json({ message: "Password reset successfully" });
});

module.exports = router;
