import { useQuery } from "@tanstack/react-query";
import { fetchMyBookings } from "@/lib/supabase-helpers";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Navigate } from "react-router-dom";
import { Calendar, Car, CreditCard, DollarSign } from "lucide-react";

const statusColor: Record<string, string> = {
  confirmed: "bg-success/20 text-success border-success/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const MyBookingsPage = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  const { data: bookings } = useQuery({
    queryKey: ["my-bookings"],
    enabled: !!user,
    queryFn: fetchMyBookings,
  });

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-16 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">{t('profile.myBookings')}</h1>
          <Badge variant="secondary" className="text-sm">
            {bookings?.length || 0} {bookings?.length === 1 ? 'Booking' : 'Bookings'}
          </Badge>
        </div>

        {!bookings?.length ? (
          <div className="glass-card p-12 text-center space-y-3">
            <Car className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-lg">{t('profile.noBookings')}</p>
            <p className="text-sm text-muted-foreground">Start exploring our cars and make your first reservation!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b: any) => (
              <div key={b.id} className="glass-card p-6 space-y-4 hover:border-primary/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <p className="font-display font-semibold text-xl">{b.car_brand} {b.car_name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Booking ID: #{b.id}</p>
                  </div>
                  <Badge variant="outline" className={`${statusColor[b.status] ?? ""} text-sm px-3 py-1`}>
                    {b.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-card p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <p className="text-xs font-medium">Rental Period</p>
                    </div>
                    <p className="font-medium text-sm">{b.start_date}</p>
                    <p className="text-xs text-muted-foreground">to</p>
                    <p className="font-medium text-sm">{b.end_date}</p>
                  </div>
                  
                  <div className="glass-card p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <p className="text-xs font-medium">Total Price</p>
                    </div>
                    <p className="font-display font-bold text-primary text-2xl">${b.total_price}</p>
                  </div>
                  
                  <div className="glass-card p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <p className="text-xs font-medium">Payment Method</p>
                    </div>
                    <p className="font-medium capitalize">{b.payment_method}</p>
                  </div>
                  
                  <div className="glass-card p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <p className="text-xs font-medium">Booked On</p>
                    </div>
                    <p className="font-medium">{new Date(b.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
