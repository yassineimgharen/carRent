# Welcome to your Lovable project

## Sihabi Cars - Car Rental Website

A full-stack car rental web application for a Moroccan car rental company.

### Recent Updates

#### ✅ CIN & Driver License Fields Added
- Added CIN (Carte d'Identité Nationale) field to booking form
- Added Driver License number field to booking form
- Updated database schema and backend API
- Fully translated in FR/AR/EN

#### ✅ Email Notification System Implemented
- **Booking Confirmation Emails** - Sent to customer and admin on new booking
- **Status Change Notifications** - Sent when admin changes booking status
- **24h Reminder Emails** - Automated reminders sent before pickup
- **Admin Alerts** - Instant notifications for new bookings
- Professional HTML email templates with responsive design
- Automated cron scheduler for reminders

### Setup Email Notifications

1. Add to `.env` file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

2. For Gmail: Generate App Password at https://myaccount.google.com/apppasswords

3. See `EMAIL_SETUP.md` for detailed configuration guide

### Documentation

- `EMAIL_SETUP.md` - Complete email setup guide
- `EMAIL_IMPLEMENTATION.md` - Implementation details and testing
- `.env.example` - Environment variables template
