import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;

const AuthModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    if (!emailRegex.test(email)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const fd = new FormData(e.currentTarget);
    const data = {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      first_name: fd.get("first_name") as string,
      last_name: fd.get("last_name") as string,
      phone: fd.get("phone") as string,
      city: fd.get("city") as string,
    };
    if (!data.first_name.trim()) return setError("First name is required.");
    if (!data.last_name.trim()) return setError("Last name is required.");
    if (!phoneRegex.test(data.phone)) return setError("Enter a valid phone number.");
    if (!data.city.trim()) return setError("City is required.");
    if (!emailRegex.test(data.email)) return setError("Enter a valid email address.");
    if (data.password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      await register(data);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auth.account')}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" onValueChange={() => { setError(""); setSuccess(""); }}>
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">{t('auth.signup')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="login-email">{t('profile.email')}</Label>
                <Input id="login-email" name="email" type="email" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="login-password">{t('auth.password')}</Label>
                <Input id="login-password" name="password" type="password" required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "..." : t('auth.login')}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="first_name">{t('auth.firstName')}</Label>
                  <Input id="first_name" name="first_name" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="last_name">{t('auth.lastName')}</Label>
                  <Input id="last_name" name="last_name" required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <Input id="phone" name="phone" type="tel" placeholder={t('auth.phonePlaceholder')} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="city">{t('auth.city')}</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-email">{t('profile.email')}</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-password">{t('auth.password')}</Label>
                <Input id="signup-password" name="password" type="password" placeholder={t('auth.passwordMin')} required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-success">{success}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "..." : t('auth.createAccount')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
