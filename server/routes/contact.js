const router = require("express").Router();
const nodemailer = require("nodemailer");
const db = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  try {
    // Save to database
    const result = db.prepare(
      "INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)"
    ).run(name, email, phone || null, message);

    // Try to send email if configured
    if (process.env.EMAIL_PASS && process.env.EMAIL_PASS !== "your_gmail_app_password_here") {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER || "wheeliehappycar@gmail.com",
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER || "wheeliehappycar@gmail.com",
          to: process.env.ADMIN_EMAIL || "wheeliehappycar@gmail.com",
          subject: `New Contact Form Message from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
            <hr>
            <p><small>This message was sent from the DriveX contact form.</small></p>
          `,
          replyTo: email,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Email sending failed (message saved to database):", emailError.message);
      }
    }
    
    res.json({ success: true, message: "Message sent successfully", id: result.lastInsertRowid });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

// Get all contact messages (admin only)
router.get("/", auth, adminOnly, (req, res) => {
  const messages = db.prepare(
    "SELECT * FROM contact_messages ORDER BY created_at DESC"
  ).all();
  res.json(messages);
});

// Mark message as read (admin only)
router.patch("/:id/status", auth, adminOnly, (req, res) => {
  const { status } = req.body;
  if (!["unread", "read", "replied"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  db.prepare("UPDATE contact_messages SET status=? WHERE id=?").run(status, req.params.id);
  res.json({ success: true });
});

// Delete message (admin only)
router.delete("/:id", auth, adminOnly, (req, res) => {
  db.prepare("DELETE FROM contact_messages WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
