# 📧 How to Test Email Notifications - Quick Guide

## 🎯 Option 1: Test with Real Gmail (Recommended)

### Step 1: Get Gmail App Password (5 minutes)

1. **Go to Google Account Security:**
   https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled)
   - Click "2-Step Verification"
   - Follow the setup wizard

3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Sihabi Cars"
   - Click "Generate"
   - Copy the 16-character password (example: `abcd efgh ijkl mnop`)

### Step 2: Add to .env File

Open your `.env` file and add:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
FRONTEND_URL=http://localhost:5173
```

**Replace:**
- `your-email@gmail.com` with your Gmail address
- `abcd efgh ijkl mnop` with your actual app password

### Step 3: Restart Backend Server

```bash
# Kill current server
pkill -f "node server/index.js"

# Start fresh
npm run server
```

### Step 4: Test Emails

Run the test script:

```bash
cd server
TEST_EMAIL=your-email@gmail.com node test-emails.js
```

**Replace** `your-email@gmail.com` with your actual email.

This will send 6 test emails to your inbox!

---

## 🎯 Option 2: Test via Website (Real Booking)

### Step 1: Configure Email (same as above)

Add SMTP credentials to `.env` and restart server.

### Step 2: Create a Test Booking

1. Go to: http://localhost:5173
2. Browse cars and click "Book Now"
3. Fill in the booking form with YOUR email
4. Submit the booking

### Step 3: Check Your Email

You should receive:
- ✅ **Booking Confirmation Email** (immediately)

### Step 4: Test Status Change Email

1. Login as admin: http://localhost:5173/admin
   - Email: `admin@drivex.com`
   - Password: `admin1234`

2. Go to "Bookings" tab
3. Find your booking
4. Change status to "Confirmed"
5. Check your email again!

You should receive:
- ✅ **Status Change Email** (confirmed)

---

## 🎯 Option 3: Preview Mode (No Email Setup)

If you don't want to configure email yet, the system will still work but emails won't be sent.

You'll see in the backend logs:

```
⚠️  Email not configured. Would have sent: Booking Confirmation - BMW X5
```

This shows what emails WOULD be sent if configured.

---

## 📧 What Emails You'll Receive

### 1. Booking Confirmation (Customer)
**Subject:** Booking Confirmation - BMW X5  
**When:** Customer creates booking  
**Contains:**
- Booking ID
- Car details
- Dates and price
- Status: PENDING
- What's next instructions

### 2. Admin Notification (Admin)
**Subject:** 🔔 New Booking Alert - BMW X5  
**When:** Customer creates booking  
**Contains:**
- All booking details
- Customer info (CIN, license)
- Action required notice
- Link to admin dashboard

### 3. Status Change - Confirmed (Customer)
**Subject:** Booking CONFIRMED - BMW X5  
**When:** Admin confirms booking  
**Contains:**
- Confirmation message
- Pickup instructions
- Contact information

### 4. Status Change - Completed (Customer)
**Subject:** Booking COMPLETED - BMW X5  
**When:** Admin marks as completed  
**Contains:**
- Thank you message
- Request for review

### 5. Status Change - Cancelled (Customer)
**Subject:** Booking CANCELLED - BMW X5  
**When:** Admin cancels booking  
**Contains:**
- Cancellation confirmation
- No charges notice

### 6. 24h Reminder (Customer)
**Subject:** ⏰ Reminder: Pickup Tomorrow - BMW X5  
**When:** Automated (24h before pickup)  
**Contains:**
- Pickup reminder
- Checklist (license, ID, payment)
- Location details

---

## 🧪 Quick Test Commands

### Test All Emails at Once:
```bash
cd server
TEST_EMAIL=your-email@gmail.com node test-emails.js
```

### Test Single Booking Flow:
```bash
# 1. Create booking via website
# 2. Check email for confirmation
# 3. Login as admin and confirm booking
# 4. Check email for status change
```

### Check Backend Logs:
```bash
tail -f backend.log
```

Look for:
```
✅ Email sent: <message-id>
```

---

## 🐛 Troubleshooting

### "Invalid login" error?
- ❌ Using regular Gmail password
- ✅ Use App Password (16 characters)

### Emails not arriving?
1. Check spam folder
2. Verify SMTP_USER is correct
3. Verify SMTP_PASS is the app password
4. Check backend logs for errors

### "Email not configured" message?
- ❌ Missing SMTP credentials in .env
- ✅ Add SMTP_USER and SMTP_PASS
- ✅ Restart backend server

---

## 📊 Expected Results

After running `node test-emails.js`, you should see:

```
🧪 Testing Email Notification System
==================================================

✅ Email configuration found
📧 SMTP User: your-email@gmail.com
📧 Test Email: your-email@gmail.com

==================================================
Test 1: Booking Confirmation Email
==================================================
✅ PASSED: { success: true, messageId: '<...>' }

==================================================
Test 2: Admin Notification Email
==================================================
✅ PASSED: { success: true, messageId: '<...>' }

... (4 more tests)

📊 Test Summary
==================================================
✅ Passed: 6/6
❌ Failed: 0/6

🎉 All tests passed! Email system is working correctly.
📬 Check your inbox (and spam folder) for test emails.
```

---

## 💡 Pro Tips

1. **Use a test email** - Don't use your main email for testing
2. **Check spam folder** - First emails might go to spam
3. **Mark as "Not Spam"** - So future emails go to inbox
4. **Test incrementally** - Test one email type at a time
5. **Keep backend logs open** - Watch for errors in real-time

---

## 🎯 Recommended Testing Flow

1. ✅ Configure Gmail App Password
2. ✅ Add to .env file
3. ✅ Restart backend server
4. ✅ Run test script: `node server/test-emails.js`
5. ✅ Check your email inbox
6. ✅ Create real booking via website
7. ✅ Verify emails are sent automatically

---

## 📞 Need Help?

See `EMAIL_SETUP.md` for detailed troubleshooting and configuration options.

**Ready to test?** Follow Option 1 above! 🚀
