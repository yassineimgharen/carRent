import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/80",
  confirmed: "bg-blue-500/80",
  completed: "bg-green-500/80",
  cancelled: "bg-red-500/40",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "border-amber-500/30 text-amber-400",
  confirmed: "border-blue-500/30 text-blue-400",
  completed: "border-green-500/30 text-green-400",
  cancelled: "border-red-500/30 text-red-400",
};

interface Props {
  bookings: any[];
  cars: any[];
}

export default function BookingCalendar({ bookings, cars }: Props) {
  const { t, language } = useLanguage();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const todayDay = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : null;

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthLabel = new Date(year, month).toLocaleString(
    language === "ar" ? "ar-MA" : language === "fr" ? "fr-FR" : "en-US",
    { month: "long", year: "numeric" }
  );

  const getMonthBookings = (carId: number) =>
    bookings.filter((b) => {
      if (b.car_id !== carId) return false;
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);
      return start <= new Date(year, month, daysInMonth) && end >= new Date(year, month, 1);
    });

  const getBookingsForDay = (carId: number, day: number) => {
    const date = new Date(year, month, day);
    return getMonthBookings(carId).filter((b) => {
      return date >= new Date(b.start_date) && date <= new Date(b.end_date);
    });
  };

  // All bookings in this month (for mobile list)
  const allMonthBookings = bookings.filter((b) => {
    const start = new Date(b.start_date);
    const end = new Date(b.end_date);
    return start <= new Date(year, month, daysInMonth) && end >= new Date(year, month, 1);
  }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: t('admin.pending'),
      confirmed: t('admin.confirmed'),
      completed: t('admin.completed'),
      cancelled: t('admin.cancelled'),
    };
    return map[status] ?? status;
  };

  const Header = () => (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
      <h2 className="font-display font-semibold text-base md:text-lg capitalize">{monthLabel}</h2>
      <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
    </div>
  );

  const Legend = () => (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {Object.entries(STATUS_COLORS).map(([status, cls]) => (
        <span key={status} className="flex items-center gap-1">
          <span className={`inline-block w-3 h-3 rounded-sm ${cls}`} />
          {statusLabel(status)}
        </span>
      ))}
    </div>
  );

  return (
    <div className="glass-card p-4 space-y-4">
      <Header />
      <Legend />

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {allMonthBookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">{t('admin.calendarMobileNoBookings')}</p>
        ) : (
          allMonthBookings.map((b) => {
            const car = cars.find(c => c.id === b.car_id);
            return (
              <div key={b.id} className={`rounded-lg border p-3 space-y-2 border-l-4 ${
                b.status === 'pending' ? 'border-l-amber-500' :
                b.status === 'confirmed' ? 'border-l-blue-500' :
                b.status === 'completed' ? 'border-l-green-500' : 'border-l-red-500'
              } bg-secondary/30`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">#{b.id}</span>
                  <Badge variant="outline" className={`text-xs ${STATUS_BADGE[b.status]}`}>
                    {statusLabel(b.status)}
                  </Badge>
                </div>
                <p className="font-medium text-sm">{b.customer_name}</p>
                <p className="text-xs text-muted-foreground">
                  {car ? `${car.brand} ${car.name}` : t('admin.deletedCar')}
                </p>
                <p className="text-xs text-muted-foreground">{b.start_date} → {b.end_date}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop: grid calendar */}
      <div className="hidden md:block overflow-x-auto">
        <div style={{ minWidth: `${36 + daysInMonth * 28}px` }}>
          {/* Day headers */}
          <div className="flex">
            <div className="w-36 shrink-0" />
            {days.map((d) => (
              <div
                key={d}
                className={`w-7 text-center text-[10px] font-medium pb-1 border-l border-border/30 ${
                  d === todayDay ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Car rows */}
          {cars.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">{t('admin.calendarNoCars')}</p>
          ) : (
            cars.map((car) => (
              <div key={car.id} className="flex border-t border-border/30 hover:bg-secondary/20 transition-colors">
                <div className="w-36 shrink-0 py-2 px-2">
                  <p className="text-xs font-medium truncate">{car.brand} {car.name}</p>
                  <p className="text-muted-foreground text-[10px]">{car.price_per_day} {t('currency')}/{t('cars.day')}</p>
                </div>
                {days.map((d) => {
                  const dayBookings = getBookingsForDay(car.id, d);
                  const isToday = d === todayDay;
                  return (
                    <div
                      key={d}
                      className={`w-7 min-h-[40px] border-l border-border/20 relative ${isToday ? "bg-primary/5" : ""}`}
                    >
                      {dayBookings.map((b) => {
                        const isStart = new Date(b.start_date).toDateString() === new Date(year, month, d).toDateString();
                        return (
                          <div
                            key={b.id}
                            title={`#${b.id} ${b.customer_name} (${statusLabel(b.status)})`}
                            className={`absolute inset-x-0 top-1 bottom-1 mx-px rounded-sm ${STATUS_COLORS[b.status] ?? "bg-gray-500/50"} cursor-pointer`}
                          >
                            {isStart && (
                              <span className="text-[9px] text-white font-medium px-0.5 truncate block leading-tight pt-0.5">
                                {b.customer_name?.split(" ")[0]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
