# Account Status Management Feature

## Overview
Implemented a secure account status management system that allows admins to suspend or ban users instead of deleting them. This preserves data integrity and maintains booking history while preventing problematic users from accessing the system.

## Features Implemented

### 1. Account Status Types
- **Active** ✅ - Full access to the system
- **Suspended** ⚠️ - Temporarily blocked from login
- **Banned** 🚫 - Permanently blocked from login

### 2. Database Changes
Added to `users` table:
- `account_status` - Current status (active/suspended/banned)
- `status_reason` - Optional reason for status change
- `status_changed_at` - Timestamp of last status change
- `status_changed_by` - Admin user ID who made the change

### 3. Backend Security

#### Login Protection (`server/routes/auth.js`)
- Users with `suspended` status cannot login
- Users with `banned` status cannot login
- Clear error messages for blocked accounts

#### Status Change Endpoint (`server/routes/users.js`)
- `PATCH /api/users/:id/status` - Change user account status
- Validates status values (active/suspended/banned)
- Prevents admins from changing their own status
- Records who made the change and when
- Optional reason field for documentation

### 4. Frontend Admin UI

#### Users Table (`src/pages/AdminPage.tsx`)
- New "Status" column with color-coded badges:
  - 🟢 Green for Active
  - 🟡 Amber for Suspended
  - 🔴 Red for Banned
- Ban icon button to change status (hidden for current admin)

#### Status Change Dialog
- User information display
- Status dropdown with descriptions
- Optional reason textarea
- Warning message for non-active statuses
- Prevents self-status changes

### 5. API Helper (`src/lib/api.ts`)
- `changeUserStatus()` function for status updates

## Why This Approach?

### ❌ Why NOT Delete Users:
1. **Legal Compliance** - Moroccan business records must be kept
2. **Data Integrity** - Booking history needs user references
3. **Revenue Tracking** - Analytics require complete data
4. **Audit Trail** - Need to track who rented what
5. **Irreversible** - Cannot undo accidental deletions

### ✅ Why Suspend/Ban Instead:
1. **Reversible** - Can reactivate if mistake was made
2. **Preserves History** - All bookings remain intact
3. **Audit Trail** - Track who changed status and why
4. **Flexible** - Temporary (suspend) or permanent (ban)
5. **Professional** - Industry standard approach

## Usage

### Admin Actions:
1. Go to Admin Dashboard → Users tab
2. Click the Ban icon next to any user (except yourself)
3. Select new status:
   - Active - Restore full access
   - Suspended - Temporary block
   - Banned - Permanent block
4. Optionally add reason (recommended)
5. Click "Update Status"

### User Experience:
- Suspended users see: "Your account has been suspended. Please contact support."
- Banned users see: "Your account has been permanently banned."
- Cannot login until admin reactivates account

## Security Features

1. **Self-Protection** - Admins cannot change their own status
2. **Validation** - Only valid status values accepted
3. **Authentication** - Admin-only endpoint
4. **Audit Logging** - Tracks who made changes and when
5. **Reason Tracking** - Optional documentation for decisions

## Testing

### Test Suspended Account:
```bash
# In server directory
sqlite3 wheelie.db "UPDATE users SET account_status='suspended' WHERE email='test@example.com';"
# Try to login - should be blocked
```

### Test Banned Account:
```bash
sqlite3 wheelie.db "UPDATE users SET account_status='banned' WHERE email='test@example.com';"
# Try to login - should be blocked
```

### Reactivate Account:
```bash
sqlite3 wheelie.db "UPDATE users SET account_status='active' WHERE email='test@example.com';"
# Can now login again
```

## Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  city TEXT,
  cin TEXT,
  driver_license TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  account_status TEXT NOT NULL DEFAULT 'active',
  status_reason TEXT,
  status_changed_at TEXT,
  status_changed_by INTEGER,
  reset_token TEXT,
  reset_token_expiry TEXT,
  manual_spent_adjustment REAL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Future Enhancements

1. **Email Notifications** - Notify users when status changes
2. **Status History** - Track all status changes over time
3. **Auto-Suspension** - Suspend after X failed payments
4. **Appeal System** - Allow users to request reactivation
5. **Expiring Suspensions** - Auto-reactivate after X days

## Files Modified

- `server/db.js` - Updated schema
- `server/routes/auth.js` - Added login checks
- `server/routes/users.js` - Added status endpoint
- `src/lib/api.ts` - Added status change function
- `src/pages/AdminPage.tsx` - Added UI components
- Database: Added 4 new columns to users table

## Status: ✅ Complete and Ready to Use

## Multi-Language Support

All UI elements are fully translated in:
- 🇫🇷 **French** (Français)
- 🇸🇦 **Arabic** (العربية) with RTL support
- 🇬🇧 **English**

### Translated Elements:
- Status badges (Active/Suspended/Banned)
- Dialog title and labels
- Status descriptions
- Warning messages
- Button text
- All form fields
