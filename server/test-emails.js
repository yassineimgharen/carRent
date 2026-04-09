require("dotenv").config();
const {
  sendBookingConfirmation,
  sendStatusChangeEmail,
  sendReminderEmail,
  sendAdminNotification,
} = require("./services/emailService");

// Test data
const testBooking = {
  id: 999,
  customer_name: "Test Customer",
  customer_email: process.env.TEST_EMAIL || "test@example.com",
  customer_phone: "+212 661 604 965",
  cin: "AB123456",
  driver_license: "DL789012",
  start_date: "2026-02-15",
  end_date: "2026-02-20",
  total_price: 750,
  payment_method: "cash",
  status: "pending",
  created_at: new Date().toISOString(),
};

const testCar = {
  brand: "BMW",
  name: "X5",
};

async function testEmails() {
  console.log("\n🧪 Testing Email Notification System\n");
  console.log("=" .repeat(50));

  // Check configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("\n⚠️  WARNING: Email not configured!");
    console.log("Add SMTP_USER and SMTP_PASS to your .env file");
    console.log("See EMAIL_SETUP.md for instructions\n");
    return;
  }

  console.log("\n✅ Email configuration found");
  console.log(`📧 SMTP User: ${process.env.SMTP_USER}`);
  console.log(`📧 Test Email: ${testBooking.customer_email}`);
  console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL || "sihabi.cars@gmail.com"}`);

  // Test 1: Booking Confirmation
  console.log("\n" + "=".repeat(50));
  console.log("Test 1: Booking Confirmation Email");
  console.log("=".repeat(50));
  const result1 = await sendBookingConfirmation(testBooking, testCar);
  console.log(result1.success ? "✅ PASSED" : "❌ FAILED:", result1);

  // Test 2: Admin Notification
  console.log("\n" + "=".repeat(50));
  console.log("Test 2: Admin Notification Email");
  console.log("=".repeat(50));
  const result2 = await sendAdminNotification(testBooking, testCar);
  console.log(result2.success ? "✅ PASSED" : "❌ FAILED:", result2);

  // Test 3: Status Change - Confirmed
  console.log("\n" + "=".repeat(50));
  console.log("Test 3: Status Change Email (Confirmed)");
  console.log("=".repeat(50));
  const result3 = await sendStatusChangeEmail(testBooking, testCar, "confirmed");
  console.log(result3.success ? "✅ PASSED" : "❌ FAILED:", result3);

  // Test 4: Status Change - Completed
  console.log("\n" + "=".repeat(50));
  console.log("Test 4: Status Change Email (Completed)");
  console.log("=".repeat(50));
  const result4 = await sendStatusChangeEmail(testBooking, testCar, "completed");
  console.log(result4.success ? "✅ PASSED" : "❌ FAILED:", result4);

  // Test 5: Status Change - Cancelled
  console.log("\n" + "=".repeat(50));
  console.log("Test 5: Status Change Email (Cancelled)");
  console.log("=".repeat(50));
  const result5 = await sendStatusChangeEmail(testBooking, testCar, "cancelled");
  console.log(result5.success ? "✅ PASSED" : "❌ FAILED:", result5);

  // Test 6: Reminder Email
  console.log("\n" + "=".repeat(50));
  console.log("Test 6: 24h Reminder Email");
  console.log("=".repeat(50));
  const result6 = await sendReminderEmail(testBooking, testCar);
  console.log(result6.success ? "✅ PASSED" : "❌ FAILED:", result6);

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Summary");
  console.log("=".repeat(50));
  const results = [result1, result2, result3, result4, result5, result6];
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Passed: ${passed}/6`);
  console.log(`❌ Failed: ${failed}/6`);

  if (passed === 6) {
    console.log("\n🎉 All tests passed! Email system is working correctly.");
    console.log("📬 Check your inbox (and spam folder) for test emails.\n");
  } else {
    console.log("\n⚠️  Some tests failed. Check the errors above.");
    console.log("See EMAIL_SETUP.md for troubleshooting.\n");
  }
}

// Run tests
testEmails().catch((error) => {
  console.error("\n❌ Test error:", error);
  process.exit(1);
});
