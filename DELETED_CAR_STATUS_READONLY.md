# Deleted Car Booking Status - Read-Only

## Problem
When a car is deleted, the admin could still change the booking status to "confirmed" or "completed", which doesn't make sense since there's no car to deliver.

## Solution
Made the status **read-only** for bookings with deleted cars. The admin can only view the current status but cannot change it.

## Implementation

### Before:
```tsx
// Status dropdown was always editable
<Select value={b.status} onValueChange={...}>
  <SelectItem value="pending">Pending</SelectItem>
  <SelectItem value="confirmed">Confirmed</SelectItem>
  <SelectItem value="completed">Completed</SelectItem>
</Select>
```

### After:
```tsx
// Check if car exists
{b.car_name ? (
  // Car exists - Show editable dropdown
  <Select value={b.status} onValueChange={...}>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="confirmed">Confirmed</SelectItem>
    <SelectItem value="completed">Completed</SelectItem>
  </Select>
) : (
  // Car deleted - Show read-only badge
  <Badge variant="outline">
    {b.status === 'pending' && 'En attente'}
    {b.status === 'confirmed' && 'Confirmé'}
    {b.status === 'completed' && 'Terminé'}
    {b.status === 'cancelled' && 'Annulé'}
  </Badge>
)}
```

## Visual Comparison

### Normal Booking (Car Exists):
```
Client: lmilan imgharen
Voiture: audi Q8
Status: [Dropdown ▼] ← Can change status
Actions: [👁️] [🗑️]
```

### Deleted Car Booking:
```
Client: Customer 8
Voiture: [Voiture supprimée]
Status: [Badge: Terminé] ← Read-only, cannot change
Actions: [👁️] [🗑️]
```

## Why This Makes Sense

### ✅ Logical Consistency
- Can't confirm a booking if the car doesn't exist
- Can't complete a rental if there's no car to deliver
- Status becomes historical record only

### ✅ Prevents Confusion
- Admin won't accidentally confirm impossible bookings
- Clear visual indication (badge vs dropdown)
- Status is preserved for records but not editable

### ✅ Data Integrity
- Booking history remains intact
- Revenue calculations stay accurate
- Admin can still view what the status was

## What Admin Can Still Do

### ✅ Allowed Actions:
- **View** booking details (👁️ icon)
- **Delete** the booking (🗑️ icon)
- **See** the current status (read-only)
- **Export** booking data to CSV

### ❌ Disabled Actions:
- **Change** status to confirmed
- **Change** status to completed
- **Change** status to pending

## Status Display

The status badge shows in the selected language:

| Status | French | Arabic | English |
|--------|--------|--------|---------|
| Pending | En attente | قيد الانتظار | Pending |
| Confirmed | Confirmé | مؤكد | Confirmed |
| Completed | Terminé | مكتمل | Completed |
| Cancelled | Annulé | ملغى | Cancelled |

## Files Modified

1. ✅ `src/pages/AdminPage.tsx` - Added conditional rendering for status
2. ✅ `src/hooks/use-language.tsx` - Added 'cancelled' status translations

## Testing

### Test Case 1: Normal Booking
1. Go to Admin → Bookings
2. Find a booking with an existing car
3. Status should be a **dropdown** (editable)
4. You can change the status ✅

### Test Case 2: Deleted Car Booking
1. Delete a car that has bookings
2. Go to Admin → Bookings
3. Find the booking with "[Voiture supprimée]"
4. Status should be a **badge** (read-only)
5. You cannot change the status ✅

## Benefits

✅ **Prevents errors** - Can't confirm non-existent cars  
✅ **Clear UI** - Visual difference between editable/read-only  
✅ **Preserves history** - Status remains visible for records  
✅ **Better UX** - Admin knows immediately which bookings are actionable  

---

**Status:** ✅ Implemented  
**Date:** April 10, 2026  
**Impact:** Improved admin workflow and data integrity
