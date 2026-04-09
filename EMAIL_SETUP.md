# Email Notification System - Setup Guide

## 📧 Overview

The email notification system sends automated emails for:
1. **Booking Confirmation** - When a customer creates a booking
2. **Status Change Notifications** - When admin changes booking status (confirmed/completed/cancelled)
3. **24h Reminder Emails** - Automatic reminder sent 24 hours before pickup
4. **Admin Notifications** - Alert admin when new bookings are created

---

## 🚀 Quick Setup

### Step 1: Install Dependencies (Already Done)
```bash
npm install nodemailer node-cron
```

### Step 2: Configure Email Settings

Add these variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

---

## 📮 Gmail Setup (Recommended)

### Option 1: Using Gmail App Password (Most Secure)

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Sihabi Cars"
   - Copy the 16-character password

3. **Update .env file**
   ```env
   SMTP_USER=sihabi.cars@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # Your 16-char app password
   ```

### Option 2: Using Less Secure Apps (Not Recommended)
- Enable "Less secure app access" in Gmail settings
- Use your regular Gmail password

---

## 🔧 Other Email Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

---

## 📝 Email Templates

### 1. Booking Confirmation Email
**Trigger:** When customer creates a booking  
**Sent to:** Customer  
**Contains:**
- Booking ID
- Car details
- Pickup/Return dates
- Total price
- Payment method
- Status (PENDING)
- Next steps
- Contact information

### 2. Status Change Email
**Trigger:** When admin changes booking status  
**Sent to:** Customer  
**Variants:**
- ✅ **Confirmed** - Green theme, pickup instructions
- 🎉 **Completed** - Purple theme, thank you message
- ❌ **Cancelled** - Red theme, cancellation confirmation

### 3. 24h Reminder Email
**Trigger:** Automated cron job (runs every hour)  
**Sent to:** Customers with confirmed bookings starting tomorrow  
**Contains:**
- Pickup reminder
- Checklist (license, ID, payment)
- Location details
- Contact information

### 4. Admin Notification Email
**Trigger:** When new booking is created  
**Sent to:** Admin (from .env ADMIN_EMAIL)  
**Contains:**
- All booking details
- Customer information (including CIN & license)
- Action required notice
- Link to admin dashboard

---

## ⏰ Reminder Scheduler

The system automatically checks for bookings every hour and sends reminders 24 hours before pickup.

**Cron Schedule:** `0 * * * *` (Every hour at minute 0)

**Logic:**
- Checks for bookings with `start_date = tomorrow`
- Only sends to bookings with status = `confirmed`
- Prevents duplicate emails

---

## 🧪 Testing Emails

### Test Booking Confirmation
1. Create a new booking from the website
2. Check customer email inbox
3. Check admin email inbox

### Test Status Change
1. Go to Admin Dashboard → Bookings
2. Change a booking status to "Confirmed"
3. Check customer email

### Test Reminder (Manual)
```javascript
// In server console or create a test route
const { sendReminderEmail } = require('./services/emailService');
const booking = { /* booking data */ };
const car = { /* car data */ };
sendReminderEmail(booking, car);
```

---

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check Console Logs**
   ```
   ✅ Email sent: <message-id>  // Success
   ⚠️  Email not configured       // Missing SMTP credentials
   ❌ Email error: <error>        // SMTP error
   ```

2. **Common Issues**
   - **Invalid credentials**: Check SMTP_USER and SMTP_PASS
   - **Less secure apps**: Enable in Gmail settings or use App Password
   - **Port blocked**: Try port 465 (secure) instead of 587
   - **Firewall**: Check if SMTP ports are blocked

3. **Test SMTP Connection**
   ```javascript
   // Add to server/index.js temporarily
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });
   transporter.verify((error, success) => {
     if (error) console.log('SMTP Error:', error);
     else console.log('SMTP Ready:', success);
   });
   ```

### Reminder Not Sending

1. Check if cron scheduler is running:
   ```
   ⏰ Reminder scheduler started (runs every hour)
   ```

2. Verify booking dates:
   - Booking must have status = `confirmed`
   - `start_date` must be exactly tomorrow

3. Check server timezone matches your location

---

## 📊 Email Logs

All email operations are logged to console:

```
✅ Email sent: <message-id>
🔍 Checking for bookings needing reminders...
📧 Found 2 bookings for tomorrow
✅ Reminder sent for booking #123
```

---

## 🎨 Customizing Email Templates

Edit `server/services/emailService.js`:

```javascript
const emailTemplates = {
  bookingConfirmation: (booking, car) => ({
    subject: `Your custom subject`,
    html: `Your custom HTML template`,
  }),
  // ... other templates
};
```

**Tips:**
- Use inline CSS (email clients don't support external stylesheets)
- Test in multiple email clients (Gmail, Outlook, Apple Mail)
- Keep HTML simple and table-based for best compatibility
- Use web-safe fonts

---

## 🔒 Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use App Passwords** - Don't use your main Gmail password
3. **Rotate credentials** - Change SMTP password periodically
4. **Limit email rate** - Prevent spam complaints
5. **Validate email addresses** - Before sending

---

## 📈 Future Enhancements

- [ ] Email templates in multiple languages (FR/AR/EN)
- [ ] HTML email builder/editor in admin panel
- [ ] Email delivery tracking (open rates, clicks)
- [ ] SMS notifications integration
- [ ] Email queue system for high volume
- [ ] Unsubscribe functionality
- [ ] Email preferences per user

---

## 📞 Support

If you need help setting up emails:
- Check the troubleshooting section above
- Review server console logs
- Test SMTP connection manually
- Contact: sihabi.cars@gmail.com

---

## ✅ Checklist

- [ ] Install nodemailer and node-cron
- [ ] Configure SMTP settings in .env
- [ ] Test booking confirmation email
- [ ] Test status change email
- [ ] Verify admin notification email
- [ ] Confirm reminder scheduler is running
- [ ] Test all email templates
- [ ] Check spam folder if emails not received
- [ ] Configure production email service (SendGrid/Mailgun)

---

**Status:** ✅ Fully Implemented and Ready to Use!
