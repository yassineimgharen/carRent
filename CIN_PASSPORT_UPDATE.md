# CIN Field Updated - Now Accepts CIN or Passport

## Change Summary
Updated the CIN field in the booking form to accept both **CIN** (Carte d'Identité Nationale) and **Passport** numbers, making it more flexible for international customers.

## What Changed

### Before:
- Label: "CIN"
- Placeholder: "Numéro CIN" / "CIN Number"
- Only mentioned CIN (Moroccan National ID)

### After:
- Label: "CIN ou Passeport" / "CIN or Passport"
- Placeholder: "Numéro CIN ou Passeport" / "CIN or Passport Number"
- Accepts both CIN and Passport

## Translations

### French (FR)
```javascript
'booking.cin': 'CIN ou Passeport'
'booking.cinPlaceholder': 'Numéro CIN ou Passeport'
```

### Arabic (AR)
```javascript
'booking.cin': 'رقم البطاقة الوطنية أو جواز السفر'
'booking.cinPlaceholder': 'رقم البطاقة الوطنية أو جواز السفر'
```

### English (EN)
```javascript
'booking.cin': 'CIN or Passport'
'booking.cinPlaceholder': 'CIN or Passport Number'
```

## Visual Changes

### Booking Form Display:

**French:**
```
┌─────────────────────────────────┐
│ CIN ou Passeport                │
│ ┌─────────────────────────────┐ │
│ │ Numéro CIN ou Passeport     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Arabic:**
```
┌─────────────────────────────────┐
│ رقم البطاقة الوطنية أو جواز السفر │
│ ┌─────────────────────────────┐ │
│ │ رقم البطاقة الوطنية أو جواز السفر │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**English:**
```
┌─────────────────────────────────┐
│ CIN or Passport                 │
│ ┌─────────────────────────────┐ │
│ │ CIN or Passport Number      │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Why This Change?

### ✅ International Customers
- Tourists and foreigners don't have Moroccan CIN
- Passport is the universal travel document
- Makes booking accessible to all customers

### ✅ Flexibility
- Moroccan customers can use CIN
- International customers can use Passport
- No need for separate fields

### ✅ Better UX
- Clear that both documents are accepted
- Reduces confusion during booking
- More inclusive for all customers

## Database Impact

### No Database Changes Required
- The field is still stored as `cin` in the database
- It's just a text field that can contain either:
  - CIN number (e.g., "AB123456")
  - Passport number (e.g., "P1234567")
- Admin can see what the customer entered

## Where It Appears

### 1. Booking Form (Car Details Page)
- Customer enters CIN or Passport when booking
- Field label shows "CIN ou Passeport"

### 2. User Profile
- Users can save their CIN or Passport
- Auto-fills in booking form

### 3. Admin Panel
- Admin sees the entered value
- Label still shows as "CIN" in admin (can be updated if needed)

## Files Modified

1. ✅ `src/hooks/use-language.tsx` - Updated translations
   - French: "CIN ou Passeport"
   - Arabic: "رقم البطاقة الوطنية أو جواز السفر"
   - English: "CIN or Passport"

## Testing

### Test Scenarios:

1. **Moroccan Customer:**
   - Enter CIN: "AB123456"
   - Should work ✅

2. **International Customer:**
   - Enter Passport: "P1234567"
   - Should work ✅

3. **Language Switch:**
   - Switch to French → "CIN ou Passeport"
   - Switch to Arabic → "رقم البطاقة الوطنية أو جواز السفر"
   - Switch to English → "CIN or Passport"

## Benefits

✅ **More inclusive** - Accepts international customers  
✅ **Clearer labeling** - No confusion about what to enter  
✅ **Better UX** - One field for both document types  
✅ **No breaking changes** - Existing data still works  

---

**Status:** ✅ Complete  
**Impact:** Improved booking accessibility for international customers  
**Date:** April 10, 2026
