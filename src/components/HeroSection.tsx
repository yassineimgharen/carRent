import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useState, useEffect } from "react";
import HeroSearchBar from "@/components/HeroSearchBar";

const heroImages = [
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1920&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80",
  "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=1920&q=80",
  "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=1920&q=80",
];

const HeroSection = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={heroImages[currentIndex]}
            alt="Luxury car"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {t('hero.badge')}
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            {t('hero.title')} <br />
            <span className="text-gradient">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            {t('hero.subtitle')}
          </p>
          <div className="flex gap-4 pt-2">
            <Button asChild size="lg" className="rounded-full px-8 font-display">
              <Link to="/cars">
                {t('hero.cta')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="pt-2">
            <HeroSearchBar />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
