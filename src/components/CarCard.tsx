import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Fuel, Users, Gauge, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import type { Car } from "@/lib/supabase-helpers";

const CarCard = ({ car, index = 0, animate = false }: { car: Car; index?: number; animate?: boolean }) => {
  const { t } = useLanguage();
  
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `${t('whatsapp.hello')} ${car.brand} ${car.name}`;
    window.open(`https://wa.me/212661604965?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  return (
    <motion.div
      initial={animate ? { opacity: 0, x: -100 } : false}
      whileInView={animate ? { opacity: 1, x: 0 } : {}}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
    >
      <Link to={`/cars/${car.id}`} className="group block glass-card overflow-hidden hover:border-primary/30 transition-all duration-300">
        <div className="aspect-[3/2] relative overflow-hidden bg-secondary">
          {car.image_url ? (
            <img
              src={car.image_url}
              alt={car.name}
              className="w-full h-full object-cover transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <Badge
            className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 ${
              car.is_available
                ? "bg-success/20 text-success border-success/30"
                : "bg-destructive/20 text-destructive border-destructive/30"
            }`}
            variant="outline"
          >
            {car.is_available ? t('cars.available') : t('cars.unavailable')}
          </Badge>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{car.brand}</p>
              <h3 className="font-display text-lg font-semibold">{car.name}</h3>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-bold text-primary">{car.price_per_day} {t('currency')}</p>
              <p className="text-xs text-muted-foreground">{t('cars.perDay')}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground pt-1 border-t border-border/50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {car.seats}</span>
              <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {car.transmission}</span>
              <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" /> {car.fuel_type}</span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="h-8 w-8 rounded-[10px] bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-md transition-all hover:scale-110 shrink-0 mt-0.5"
              aria-label="Contact via WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;
