import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CarCard from "@/components/CarCard";
import LocationMap from "@/components/LocationMap";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StatsBar from "@/components/StatsBar";
import { fetchCars } from "@/lib/supabase-helpers";

const Index = () => {
  const { data: cars } = useQuery({ queryKey: ["cars"], queryFn: fetchCars });
  const { t } = useLanguage();

  const featured = cars?.filter((c) => c.is_featured === 1) ?? [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />

      {/* Featured cars */}
      <section className="container py-24 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">{t('home.featured')}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">{t('home.popularCars')}</h2>
          </div>
          <Button asChild variant="ghost" className="text-primary">
            <Link to="/cars">{t('home.viewAll')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} animate />
          ))}
          {featured.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-12">{t('home.noCars')}</p>
          )}
        </div>
      </section>

      <LocationMap />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <ContactSection />
      </motion.div>

      <Footer />
    </div>
  );
};

export default Index;
