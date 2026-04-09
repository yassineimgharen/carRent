import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, LogIn } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;

const AuthModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("login");

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
      <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{t('auth.account')}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => { setActiveTab(v); setError(""); setSuccess(""); }}>
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">{t('auth.signup')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="animate-in fade-in-50 slide-in-from-left-5 duration-300">
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="login-email">{t('profile.email')}</Label>
                <Input id="login-email" name="email" type="email" required className="transition-all focus:scale-[1.02]" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="login-password">{t('auth.password')}</Label>
                <Input id="login-password" name="password" type="password" required className="transition-all focus:scale-[1.02]" />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { onClose(); window.location.href = "/forgot-password"; }}
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.forgotPassword') || 'Forgot password?'}
                </button>
              </div>
              {error && <p className="text-sm text-destructive animate-in fade-in-50 slide-in-from-top-2 duration-200">{error}</p>}
              <Button type="submit" className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "..." : t('auth.login')}
              </Button>
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  {t('auth.noAccount') || "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-primary font-semibold hover:underline transition-all"
                  >
                    {t('auth.registerHere') || "Register here"}
                  </button>
                </p>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="animate-in fade-in-50 slide-in-from-right-5 duration-300">
            <form onSubmit={handleSignup} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="first_name">{t('auth.firstName')}</Label>
                  <Input id="first_name" name="first_name" required className="transition-all focus:scale-[1.02]" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="last_name">{t('auth.lastName')}</Label>
                  <Input id="last_name" name="last_name" required className="transition-all focus:scale-[1.02]" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <Input id="phone" name="phone" type="tel" placeholder={t('auth.phonePlaceholder')} required className="transition-all focus:scale-[1.02]" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="city">{t('auth.city')}</Label>
                <Input id="city" name="city" required className="transition-all focus:scale-[1.02]" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-email">{t('profile.email')}</Label>
                <Input id="signup-email" name="email" type="email" required className="transition-all focus:scale-[1.02]" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-password">{t('auth.password')}</Label>
                <Input id="signup-password" name="password" type="password" placeholder={t('auth.passwordMin')} required className="transition-all focus:scale-[1.02]" />
              </div>
              {error && <p className="text-sm text-destructive animate-in fade-in-50 slide-in-from-top-2 duration-200">{error}</p>}
              {success && <p className="text-sm text-success animate-in fade-in-50 slide-in-from-top-2 duration-200">{success}</p>}
              <Button type="submit" className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? "..." : t('auth.createAccount')}
              </Button>
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  {t('auth.haveAccount') || "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-primary font-semibold hover:underline transition-all"
                  >
                    {t('auth.loginHere') || "Login here"}
                  </button>
                </p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
