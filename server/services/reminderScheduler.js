const cron = require("node-cron");
const db = require("../db");
const { sendReminderEmail } = require("./emailService");

// Run every hour to check for bookings starting in 24 hours
function startReminderScheduler() {
  cron.schedule("0 * * * *", async () => {
    console.log("🔍 Checking for bookings needing reminders...");

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      const bookings = db
        .prepare(
          `
        SELECT b.*, c.name as car_name, c.brand as car_brand
        FROM bookings b
        LEFT JOIN cars c ON b.car_id = c.id
        WHERE b.start_date = ? AND b.status = 'confirmed'
      `
        )
        .all(tomorrowStr);

      console.log(`📧 Found ${bookings.length} bookings for tomorrow`);

      for (const booking of bookings) {
        const car = { name: booking.car_name, brand: booking.car_brand };
        await sendReminderEmail(booking, car);
        console.log(`✅ Reminder sent for booking #${booking.id}`);
      }
    } catch (error) {
      console.error("❌ Reminder scheduler error:", error);
    }
  });

  console.log("⏰ Reminder scheduler started (runs every hour)");
}

module.exports = { startReminderScheduler };
