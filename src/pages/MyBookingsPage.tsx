import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyBookings, deleteBooking } from "@/lib/supabase-helpers";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";
import { Calendar, Car, CreditCard, DollarSign, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusColor: Record<string, string> = {
  confirmed: "bg-success/20 text-success border-success/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const MyBookingsPage = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ["my-bookings"],
    enabled: !!user,
    queryFn: fetchMyBookings,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      toast.success(t('profile.bookingCancelledSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('profile.bookingCancelledError'));
    },
  });

  const handleCancelBooking = (bookingId: number) => {
    deleteMutation.mutate(bookingId);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('profile.status.pending'),
      confirmed: t('profile.status.confirmed'),
      completed: t('profile.status.completed'),
      cancelled: t('profile.status.cancelled'),
    };
    return statusMap[status] || status;
  };

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-16 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">{t('profile.myBookings')}</h1>
          <Badge variant="secondary" className="text-sm">
            {bookings?.length || 0} {bookings?.length === 1 ? t('profile.booking') : t('profile.bookings')}
          </Badge>
        </div>

        {!bookings?.length ? (
          <div className="glass-card p-12 text-center space-y-3">
            <Car className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-lg">{t('profile.noBookings')}</p>
            <p className="text-sm text-muted-foreground">Start exploring our cars and make your first reservation!</p>
          </div>
        ) : (
          <motion.div 
            className="grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {bookings.map((b: any, index: number) => (
              <motion.div 
                key={b.id} 
                className="glass-card p-6 space-y-4 hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <p className="font-display font-semibold text-xl">{b.car_brand} {b.car_name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Booking ID: #{b.id}</p>
                  </div>
                  <Badge variant="outline" className={`${statusColor[b.status] ?? ""} text-sm px-3 py-1`}>
                    {getStatusLabel(b.status)}
                  </Badge>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-card p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <p className="text-xs font-medium">{t('profile.rentalPeriod')}</p>
                    </div>
                    <p className="font-medium text-sm">{b.start_date}</p>
                    <p className="text-xs text-muted-foreground">{t('profile.to')}</p>
                    <p className="font-medium text-sm">{b.end_date}</p>
                  </div>
                  
                  <div className="glass-card p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <p className="text-xs font-medium">{t('profile.totalPrice')}</p>
                    </div>
                    <p className="font-display font-bold text-primary text-2xl">{b.total_price} {t('currency')}</p>
                  </div>
                  
                  <div className="glass-card p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <p className="text-xs font-medium">{t('profile.paymentMethod')}</p>
                    </div>
                    <p className="font-medium capitalize">{b.payment_method}</p>
                  </div>
                  
                  <div className="glass-card p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <p className="text-xs font-medium">{t('profile.bookedOn')}</p>
                    </div>
                    <p className="font-medium">{new Date(b.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Cancel Button for Pending Bookings */}
                {b.status === 'pending' && (
                  <div className="pt-2 border-t border-border/50">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('profile.cancelBooking')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('profile.cancelBookingTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('profile.cancelBookingConfirm')} {b.car_brand} {b.car_name}? {t('profile.cancelBookingWarning')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('profile.keepBooking')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelBooking(b.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t('profile.yesCancelBooking')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}

                {b.status === 'confirmed' && (
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
                      <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-warning">{t('profile.bookingConfirmed')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('profile.bookingConfirmedText')}{' '}
                          <a href="mailto:sihabi.cars@gmail.com" className="text-primary hover:underline">
                            sihabi.cars@gmail.com
                          </a>
                          {' '}{t('profile.orCall')}{' '}
                          <a href="tel:+212661604965" className="text-primary hover:underline">
                            +212 661 604 965
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
