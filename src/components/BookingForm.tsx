import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { CalendarIcon, Banknote, CreditCard, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { createBooking, type Car } from "@/lib/supabase-helpers";

const BookingForm = ({ car }: { car: Car }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cin, setCin] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      setName(fullName || user.email);
      setEmail(user.email);
    }
  }, [user]);

  const days = startDate && endDate ? Math.max(differenceInDays(endDate, startDate), 1) : 0;
  const total = days * car.price_per_day;

  const handleWhatsApp = () => {
    const message = `${t('whatsapp.hello')} ${car.brand} ${car.name}`;
    window.open(`https://wa.me/212661604965?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !name.trim() || !email.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        car_id: car.id,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim() || null,
        cin: cin.trim() || null,
        driver_license: driverLicense.trim() || null,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        total_price: total,
        payment_method: paymentMethod,
      });
      toast.success("Booking submitted successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setCin("");
      setDriverLicense("");
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3.5">
      <h3 className="font-display text-base font-semibold">{t('booking.title')}</h3>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{t('booking.startDate')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal text-xs h-9", !startDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {startDate ? format(startDate, "MMM dd") : "Pick"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(d) => d < new Date()} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{t('booking.endDate')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal text-xs h-9", !endDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {endDate ? format(endDate, "MMM dd") : "Pick"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(d) => d < (startDate || new Date())} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Full Name *</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="h-9 text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Email *</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="h-9 text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Phone</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212 XXX XXX XXX" className="h-9 text-sm" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{t('booking.cin')}</Label>
        <Input value={cin} onChange={(e) => setCin(e.target.value)} placeholder={t('booking.cinPlaceholder')} className="h-9 text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{t('booking.driverLicense')}</Label>
        <Input value={driverLicense} onChange={(e) => setDriverLicense(e.target.value)} placeholder={t('booking.driverLicensePlaceholder')} className="h-9 text-sm" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Payment Method *</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-2">
          <Label
            htmlFor="cash"
            className={cn(
              "flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-all",
              paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            )}
          >
            <RadioGroupItem value="cash" id="cash" className="h-3.5 w-3.5" />
            <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Cash</span>
          </Label>
          <Label
            htmlFor="card"
            className={cn(
              "flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-all",
              paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            )}
          >
            <RadioGroupItem value="card" id="card" className="h-3.5 w-3.5" />
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Card</span>
          </Label>
        </RadioGroup>
      </div>

      {days > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
          <span className="text-xs text-muted-foreground">{days} {t('booking.days')} × {car.price_per_day}</span>
          <span className="font-display text-lg font-bold text-primary">{total} {t('currency')}</span>
        </div>
      )}

      <Button type="submit" className="w-full rounded-full font-display h-10 text-sm" disabled={loading || !Number(car.is_available)}>
        {!Number(car.is_available) ? t('cars.unavailable') : loading ? "..." : t('cars.bookNow')}
      </Button>

      <button
        type="button"
        onClick={handleWhatsApp}
        className="w-full flex items-center justify-center gap-2 h-9 rounded-full border border-border hover:border-[#25D366] bg-background hover:bg-[#25D366]/5 transition-all group"
      >
        <div className="h-5 w-5 rounded-full bg-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
        <span className="font-display text-xs">{t('whatsapp.contact')}</span>
      </button>
    </form>
  );
};

export default BookingForm;
