import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/lib/supabase-helpers";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigate } from "react-router-dom";
import { User, Pencil, Check, X } from "lucide-react";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", city: "" });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => updateMe(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["me"] }); setEditing(false); },
  });

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  const startEdit = () => {
    setForm({ first_name: user.first_name ?? "", last_name: user.last_name ?? "", phone: user.phone ?? "", city: user.city ?? "" });
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
              {(["first_name", "last_name", "phone", "city"] as const).map((field) => (
                <div key={field} className="space-y-1">
                  <Label>{t(`profile.${field.replace('_', '')}` as any)}</Label>
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
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-muted-foreground text-xs">{label}</p>
                  <p>{value ?? <span className="italic text-muted-foreground">—</span>}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
