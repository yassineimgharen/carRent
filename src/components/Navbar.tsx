import { Link, useLocation, useNavigate } from "react-router-dom";
import { Car, LayoutDashboard, Menu, Moon, Sun, User, X, Languages, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import AuthModal from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const links = [
    { to: "/", label: t('nav.home') },
    { to: "/cars", label: t('nav.cars') },
    ...(user && user.role !== "admin" ? [{ to: "/my-bookings", label: "My Bookings", icon: Calendar }] : []),
    ...(user && user.role === "admin" ? [{ to: "/admin", label: t('nav.admin'), icon: LayoutDashboard }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-gradient">Sihabi Cars</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('fr')} className={language === 'fr' ? 'bg-primary/10' : ''}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')} className={language === 'ar' ? 'bg-primary/10' : ''}>
                  العربية
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-primary/10' : ''}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-xs text-muted-foreground" disabled>{user.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>{t('nav.profile')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">{t('nav.logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={() => setAuthOpen(true)}>{t('nav.login')}</Button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('fr')} className={language === 'fr' ? 'bg-primary/10' : ''}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')} className={language === 'ar' ? 'bg-primary/10' : ''}>
                  العربية
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-primary/10' : ''}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden glass-card border-t border-border/30 p-4 space-y-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <button
                  onClick={() => { navigate("/profile"); setMobileOpen(false); }}
                  className="block w-full text-start px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {t('nav.profile')}
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-start px-4 py-3 rounded-lg text-sm font-medium text-destructive"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <button
                onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                className="block w-full text-start px-4 py-3 rounded-lg text-sm font-medium text-primary"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        )}
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
