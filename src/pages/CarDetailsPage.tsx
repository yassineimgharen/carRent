import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Fuel, Users, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import CarGallery from "@/components/CarGallery";
import { fetchCarById, fetchCarImages } from "@/lib/supabase-helpers";

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { data: car, isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => fetchCarById(id!),
    enabled: !!id,
  });
  const { data: images } = useQuery({
    queryKey: ["car-images", id],
    queryFn: () => fetchCarImages(id!),
    enabled: !!id,
  });


  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24">
          <div className="h-96 glass-card animate-pulse" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24 text-center">
          <h1 className="font-display text-2xl font-bold">Car not found</h1>
          <Button asChild className="mt-4"><Link to="/cars">{t('nav.cars')}</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-16">
        <Button asChild variant="ghost" className="mb-6 text-muted-foreground">
          <Link to="/cars"><ArrowLeft className="mr-2 h-4 w-4" /> {t('nav.cars')}</Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 space-y-6">
            <CarGallery images={images ?? []} carName={car.name} />

            <div className="space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{car.brand}</p>
                  <h1 className="font-display text-3xl font-bold">{car.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={car.is_available ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                    {car.is_available ? t('cars.available') : t('cars.unavailable')}
                  </Badge>
                  <Badge variant="secondary">{car.category}</Badge>
                </div>
              </div>

              <div className="flex gap-6 text-muted-foreground">
                <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {car.seats} {t('cars.seats')}</span>
                <span className="flex items-center gap-2"><Gauge className="h-4 w-4" /> {car.transmission}</span>
                <span className="flex items-center gap-2"><Fuel className="h-4 w-4" /> {car.fuel_type}</span>
              </div>

              <p className="font-display text-3xl font-bold text-primary">{car.price_per_day} <span className="text-sm font-normal text-muted-foreground">{t('currency')}{t('cars.perDay')}</span></p>

              {car.description && <p className="text-muted-foreground leading-relaxed">{car.description}</p>}
            </div>
          </motion.div>

          <div className="lg:col-span-1">
            <BookingForm car={car} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
