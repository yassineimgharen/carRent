# Account Status Translations Summary

## Added Translations

### French (Français)
- `admin.accountStatus`: "Statut du compte"
- `admin.accountActive`: "Actif"
- `admin.accountSuspended`: "Suspendu"
- `admin.accountBanned`: "Banni"
- `admin.changeStatus`: "Changer le statut"
- `admin.statusReason`: "Raison (Optionnel)"
- `admin.statusReasonPlaceholder`: "ex: Paiements échoués multiples, Violation des conditions, etc."
- `admin.statusWarning`: "Cet utilisateur ne pourra pas se connecter tant qu'il n'est pas réactivé."
- `admin.updateStatus`: "Mettre à jour le statut"
- `admin.updating`: "Mise à jour..."
- `admin.statusActiveDesc`: "Actif - Accès complet"
- `admin.statusSuspendedDesc`: "Suspendu - Temporairement bloqué"
- `admin.statusBannedDesc`: "Banni - Bloqué définitivement"

### Arabic (العربية)
- `admin.accountStatus`: "حالة الحساب"
- `admin.accountActive`: "نشط"
- `admin.accountSuspended`: "معلق"
- `admin.accountBanned`: "محظور"
- `admin.changeStatus`: "تغيير الحالة"
- `admin.statusReason`: "السبب (اختياري)"
- `admin.statusReasonPlaceholder`: "مثال: فشل دفعات متعددة، انتهاك الشروط، إلخ."
- `admin.statusWarning`: "لن يتمكن هذا المستخدم من تسجيل الدخول حتى يتم إعادة تفعيله."
- `admin.updateStatus`: "تحديث الحالة"
- `admin.updating`: "جاري التحديث..."
- `admin.statusActiveDesc`: "نشط - وصول كامل"
- `admin.statusSuspendedDesc`: "معلق - محظور مؤقتًا"
- `admin.statusBannedDesc`: "محظور - محظور نهائيًا"

### English
- `admin.accountStatus`: "Account Status"
- `admin.accountActive`: "Active"
- `admin.accountSuspended`: "Suspended"
- `admin.accountBanned`: "Banned"
- `admin.changeStatus`: "Change Status"
- `admin.statusReason`: "Reason (Optional)"
- `admin.statusReasonPlaceholder`: "e.g., Multiple failed payments, Terms violation, etc."
- `admin.statusWarning`: "This user will not be able to login until reactivated."
- `admin.updateStatus`: "Update Status"
- `admin.updating`: "Updating..."
- `admin.statusActiveDesc`: "Active - Full access"
- `admin.statusSuspendedDesc`: "Suspended - Temporarily blocked"
- `admin.statusBannedDesc`: "Banned - Permanently blocked"

## Files Modified
- `src/hooks/use-language.tsx` - Added 13 new translation keys per language
- `src/pages/AdminPage.tsx` - Applied translations to UI components

## UI Elements Translated
✅ Status column badges (Active/Suspended/Banned)
✅ Dialog title
✅ Status dropdown options
✅ Reason field label and placeholder
✅ Warning message
✅ Submit button text
✅ Loading state text

## RTL Support
Arabic translations automatically display right-to-left with proper text alignment.
