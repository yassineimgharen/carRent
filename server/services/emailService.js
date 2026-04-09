const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const emailTemplates = {
  bookingConfirmation: (booking, car) => ({
    subject: `Booking Confirmation - ${car.brand} ${car.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #667eea; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Booking Confirmed!</h1>
            <p>Thank you for choosing Sihabi Cars</p>
          </div>
          <div class="content">
            <p>Dear ${booking.customer_name},</p>
            <p>Your booking has been successfully confirmed! We're excited to serve you.</p>
            
            <div class="booking-details">
              <h2 style="color: #667eea; margin-top: 0;">Booking Details</h2>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span>#${booking.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Car:</span>
                <span>${car.brand} ${car.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pickup Date:</span>
                <span>${new Date(booking.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Return Date:</span>
                <span>${new Date(booking.end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Price:</span>
                <span style="font-size: 18px; font-weight: bold; color: #667eea;">${booking.total_price} MAD</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span>${booking.payment_method === 'cash' ? 'Cash' : 'Card'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span style="color: #f59e0b; font-weight: bold;">PENDING</span>
              </div>
            </div>

            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Our team will review your booking and confirm within 24 hours</li>
              <li>You'll receive another email once your booking is confirmed</li>
              <li>Please bring your driver's license and ID on pickup day</li>
            </ul>

            <p><strong>Need Help?</strong></p>
            <p>Contact us at:</p>
            <ul>
              <li>📧 Email: sihabi.cars@gmail.com</li>
              <li>📱 Phone: +212 661 604 965</li>
              <li>📍 Address: 132 Ahmed Zakaria Street, Agadir</li>
            </ul>

            <div class="footer">
              <p>© 2026 Sihabi Cars - Your trusted car rental partner in Morocco</p>
              <p>132 Rue Ahmed Zakaria, Bloc Abtih Extension Dakhla, Agadir</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  statusChange: (booking, car, newStatus) => {
    const statusMessages = {
      confirmed: {
        title: '✅ Booking Confirmed!',
        message: 'Great news! Your booking has been confirmed by our team.',
        color: '#10b981',
        instructions: [
          'Your car is reserved and ready for pickup',
          'Please arrive on time at our location',
          'Bring your driver\'s license, ID, and payment',
          'Contact us if you need to make any changes',
        ],
      },
      completed: {
        title: '🎉 Rental Completed',
        message: 'Thank you for choosing Sihabi Cars! We hope you enjoyed your ride.',
        color: '#667eea',
        instructions: [
          'We hope you had a great experience',
          'Please leave us a review',
          'Book again anytime for special discounts',
          'Share your experience with friends',
        ],
      },
      cancelled: {
        title: '❌ Booking Cancelled',
        message: 'Your booking has been cancelled as requested.',
        color: '#ef4444',
        instructions: [
          'Your booking has been cancelled',
          'No charges will be applied',
          'Feel free to book again anytime',
          'Contact us if you have any questions',
        ],
      },
    };

    const status = statusMessages[newStatus] || statusMessages.confirmed;

    return {
      subject: `Booking ${newStatus.toUpperCase()} - ${car.brand} ${car.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${status.color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: ${status.color}; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${status.title}</h1>
              <p>${status.message}</p>
            </div>
            <div class="content">
              <p>Dear ${booking.customer_name},</p>
              
              <div class="booking-details">
                <h2 style="color: ${status.color}; margin-top: 0;">Booking Information</h2>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span>#${booking.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Car:</span>
                  <span>${car.brand} ${car.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Pickup Date:</span>
                  <span>${new Date(booking.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Return Date:</span>
                  <span>${new Date(booking.end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Price:</span>
                  <span style="font-size: 18px; font-weight: bold; color: ${status.color};">${booking.total_price} MAD</span>
                </div>
              </div>

              <p><strong>Important Information:</strong></p>
              <ul>
                ${status.instructions.map(inst => `<li>${inst}</li>`).join('')}
              </ul>

              <p><strong>Contact Us:</strong></p>
              <ul>
                <li>📧 Email: sihabi.cars@gmail.com</li>
                <li>📱 Phone: +212 661 604 965</li>
                <li>📍 Address: 132 Ahmed Zakaria Street, Agadir</li>
              </ul>

              <div class="footer">
                <p>© 2026 Sihabi Cars - Your trusted car rental partner in Morocco</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  },

  reminder24h: (booking, car) => ({
    subject: `⏰ Reminder: Pickup Tomorrow - ${car.brand} ${car.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reminder-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .checklist { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .checklist-item { padding: 10px; border-bottom: 1px solid #eee; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Pickup Reminder</h1>
            <p>Your rental starts tomorrow!</p>
          </div>
          <div class="content">
            <p>Dear ${booking.customer_name},</p>
            
            <div class="reminder-box">
              <h2 style="margin-top: 0; color: #d97706;">🚗 Your ${car.brand} ${car.name} is ready!</h2>
              <p style="font-size: 18px; margin: 0;">Pickup Date: <strong>${new Date(booking.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
            </div>

            <p>This is a friendly reminder that your car rental begins tomorrow. We're looking forward to serving you!</p>

            <div class="checklist">
              <h3 style="color: #f59e0b; margin-top: 0;">📋 Pickup Checklist</h3>
              <div class="checklist-item">✅ Valid driver's license</div>
              <div class="checklist-item">✅ National ID (CIN) or Passport</div>
              <div class="checklist-item">✅ Payment (${booking.payment_method === 'cash' ? 'Cash' : 'Credit/Debit Card'})</div>
              <div class="checklist-item">✅ Booking confirmation (ID: #${booking.id})</div>
            </div>

            <p><strong>📍 Pickup Location:</strong></p>
            <p>Sihabi Cars<br>
            132 Ahmed Zakaria Street<br>
            Bloc Abtih Extension Dakhla<br>
            Agadir, Morocco</p>

            <p><strong>💰 Total Amount:</strong> ${booking.total_price} MAD</p>

            <p><strong>Need to make changes?</strong><br>
            Contact us immediately:</p>
            <ul>
              <li>📧 Email: sihabi.cars@gmail.com</li>
              <li>📱 Phone: +212 661 604 965</li>
            </ul>

            <div class="footer">
              <p>© 2026 Sihabi Cars - Your trusted car rental partner in Morocco</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  adminNewBooking: (booking, car) => ({
    subject: `🔔 New Booking Alert - ${car.brand} ${car.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #667eea; }
          .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Booking Received</h1>
            <p>Action Required</p>
          </div>
          <div class="content">
            <div class="alert">
              <strong>⚠️ Please review and confirm this booking as soon as possible</strong>
            </div>

            <div class="booking-details">
              <h2 style="color: #667eea; margin-top: 0;">Booking Details</h2>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span>#${booking.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer:</span>
                <span>${booking.customer_name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span>${booking.customer_email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span>${booking.customer_phone || 'Not provided'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">CIN:</span>
                <span>${booking.cin || 'Not provided'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Driver License:</span>
                <span>${booking.driver_license || 'Not provided'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Car:</span>
                <span>${car.brand} ${car.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pickup Date:</span>
                <span>${new Date(booking.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Return Date:</span>
                <span>${new Date(booking.end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Price:</span>
                <span style="font-size: 18px; font-weight: bold; color: #667eea;">${booking.total_price} MAD</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span>${booking.payment_method === 'cash' ? 'Cash' : 'Card'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Booked At:</span>
                <span>${new Date(booking.created_at).toLocaleString()}</span>
              </div>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Log in to the admin dashboard</li>
              <li>Review the booking details</li>
              <li>Confirm or contact the customer</li>
              <li>Update the booking status</li>
            </ol>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function
async function sendEmail(to, template) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("⚠️  Email not configured. Would have sent:", template.subject);
      return { success: false, message: "Email not configured" };
    }

    const info = await transporter.sendMail({
      from: `"Sihabi Cars" <${process.env.SMTP_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    });

    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email error:", error.message);
    return { success: false, error: error.message };
  }
}

// Main email functions
async function sendBookingConfirmation(booking, car) {
  const template = emailTemplates.bookingConfirmation(booking, car);
  return await sendEmail(booking.customer_email, template);
}

async function sendStatusChangeEmail(booking, car, newStatus) {
  const template = emailTemplates.statusChange(booking, car, newStatus);
  return await sendEmail(booking.customer_email, template);
}

async function sendReminderEmail(booking, car) {
  const template = emailTemplates.reminder24h(booking, car);
  return await sendEmail(booking.customer_email, template);
}

async function sendAdminNotification(booking, car) {
  const adminEmail = process.env.ADMIN_EMAIL || "sihabi.cars@gmail.com";
  const template = emailTemplates.adminNewBooking(booking, car);
  return await sendEmail(adminEmail, template);
}

module.exports = {
  sendBookingConfirmation,
  sendStatusChangeEmail,
  sendReminderEmail,
  sendAdminNotification,
};
