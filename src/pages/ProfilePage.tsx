import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateMe, fetchMyBookings, deleteBooking } from "@/lib/supabase-helpers";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navigate, Link } from "react-router-dom";
import { User, Pencil, Check, X, Car, Calendar, CreditCard, Trash2 } from "lucide-react";
import { toast } from "sonner";
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

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", city: "", cin: "", driver_license: "" });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => updateMe(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["me"] }); setEditing(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Booking deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete booking");
    },
  });

  const handleDeleteBooking = (bookingId: number) => {
    deleteMutation.mutate(bookingId);
  };

  const { data: bookings } = useQuery({ queryKey: ["my-bookings"], queryFn: fetchMyBookings });

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  const startEdit = () => {
    setForm({ 
      first_name: user.first_name ?? "", 
      last_name: user.last_name ?? "", 
      phone: user.phone ?? "", 
      city: user.city ?? "",
      cin: user.cin ?? "",
      driver_license: user.driver_license ?? ""
    });
    setEditing(true);
  };

  const displayName = user.first_name ? `${user.first_name} ${user.last_name ?? ""}`.trim() : user.email;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-28 pb-16">

        {/* Profile card */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">{displayName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {!editing ? (
              <Button variant="ghost" size="icon" onClick={startEdit}><Pencil className="h-4 w-4" /></Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => save()} disabled={saving}><Check className="h-4 w-4 text-success" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setEditing(false)}><X className="h-4 w-4 text-destructive" /></Button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {(["first_name", "last_name", "phone", "city", "cin", "driver_license"] as const).map((field) => (
                <div key={field} className="space-y-1">
                  <Label>{field === 'cin' ? t('booking.cin') : field === 'driver_license' ? t('booking.driverLicense') : t(`profile.${field.replace('_', '')}` as any)}</Label>
                  <Input value={form[field]} onChange={(e) => setForm(f => ({ ...f, [field]: e.target.value }))} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: t('profile.firstName'), value: user.first_name },
                { label: t('profile.lastName'), value: user.last_name },
                { label: t('profile.phone'), value: user.phone },
                { label: t('profile.city'), value: user.city },
                { label: t('booking.cin'), value: user.cin },
                { label: t('booking.driverLicense'), value: user.driver_license },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-muted-foreground text-xs">{label}</p>
                  <p>{value ?? <span className="italic text-muted-foreground">—</span>}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings */}
        <div className="mt-8 space-y-4">
          <h2 className="font-display text-xl font-bold">{t('profile.myBookings')}</h2>
          {(!bookings || bookings.length === 0) ? (
            <div className="glass-card p-10 text-center text-muted-foreground">
              <Car className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>{t('profile.noBookings')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b: any) => {
                const statusColor = {
                  pending: "border-amber-500/30 text-amber-400 bg-amber-500/10",
                  confirmed: "border-blue-500/30 text-blue-400 bg-blue-500/10",
                  completed: "border-success/30 text-success bg-success/10",
                }[b.status as string] ?? "border-border text-muted-foreground";

                const steps = ["pending", "confirmed", "completed"];
                const stepIdx = steps.indexOf(b.status);

                return (
                  <div key={b.id} className="glass-card p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-muted-foreground">{t('profile.bookingId')}{b.id}</p>
                        <Link to={`/cars/${b.car_id}`} className="font-display font-semibold hover:text-primary transition-colors">
                          {b.car_brand} {b.car_name}
                        </Link>
                      </div>
                      <Badge variant="outline" className={statusColor}>
                        {t(`profile.status.${b.status}`)}
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      {steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-2 flex-1">
                          <div className={`h-2 flex-1 rounded-full transition-all ${
                            i <= stepIdx ? "bg-primary" : "bg-secondary"
                          }`} />
                          {i < steps.length - 1 && null}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {steps.map((step) => (
                        <span key={step}>{t(`profile.status.${step}`)}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm pt-1 border-t border-border/40">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="whitespace-nowrap">{b.start_date} → {b.end_date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-3.5 w-3.5 shrink-0" />
                        <span>{t(`admin.${b.payment_method}`)}</span>
                      </div>
                      <div className="sm:text-right font-display font-bold text-primary">
                        {b.total_price} {t('currency')}
                      </div>
                    </div>

                    {/* Admin Delete Button */}
                    {user.role === 'admin' && (
                      <div className="pt-3 border-t border-border/40 flex justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Booking #{b.id}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this booking for {b.car_brand} {b.car_name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBooking(b.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Yes, Delete Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
