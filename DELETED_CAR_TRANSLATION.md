# Translation Added - Deleted Car Placeholder

## What Was Added

Added translations for the "[Deleted Car]" placeholder that appears in the admin bookings table when a car has been deleted but its bookings are preserved.

## Translations

### French (FR)
```
'admin.deletedCar': '[Voiture supprimée]'
```

### Arabic (AR)
```
'admin.deletedCar': '[سيارة محذوفة]'
```

### English (EN)
```
'admin.deletedCar': '[Deleted Car]'
```

## Implementation

### File: `src/hooks/use-language.tsx`
Added the translation key `admin.deletedCar` to all three language objects (fr, ar, en).

### File: `src/pages/AdminPage.tsx`
Updated the bookings table to use the translation:

**Before:**
```tsx
<span className="text-muted-foreground italic">[Deleted Car]</span>
```

**After:**
```tsx
<span className="text-muted-foreground italic">{t('admin.deletedCar')}</span>
```

## How It Works

When viewing the admin bookings table:
- If a car exists: Shows "BMW X5" (car brand + name)
- If a car was deleted: Shows the translated placeholder:
  - French: "[Voiture supprimée]"
  - Arabic: "[سيارة محذوفة]"
  - English: "[Deleted Car]"

## Example Display

### French Interface:
```
Client: lmilan imgharen
Voiture: [Voiture supprimée]
Total: 100 DH
```

### Arabic Interface:
```
العميل: lmilan imgharen
سيارة: [سيارة محذوفة]
الإجمالي: 100 درهم
```

### English Interface:
```
Customer: lmilan imgharen
Car: [Deleted Car]
Total: 100 MAD
```

## Files Modified

1. ✅ `src/hooks/use-language.tsx` - Added translation keys
2. ✅ `src/pages/AdminPage.tsx` - Updated to use translation

## Testing

To test the translation:
1. Switch language in the navbar (FR/AR/EN)
2. Go to Admin → Bookings tab
3. Find a booking with a deleted car
4. The placeholder will show in the selected language

---

**Status:** ✅ Complete  
**Languages:** French, Arabic, English  
**Date:** April 10, 2026
