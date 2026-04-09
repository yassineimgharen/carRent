import { motion } from "framer-motion";
import { Users, Car, Award, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const StatsBar = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: t('stats.clients'), label: t('stats.clientsLabel') },
    { icon: Car, value: t('stats.cars'), label: t('stats.carsLabel') },
    { icon: Award, value: t('stats.experience'), label: t('stats.experienceLabel') },
    { icon: MapPin, value: t('stats.cities'), label: t('stats.citiesLabel') },
  ];

  return (
    <section className="relative z-10 -mt-16 container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-border/40 p-4 md:p-0"
      >
        {stats.map(({ icon: Icon, value, label }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 md:p-6 text-center md:text-left"
          >
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-2xl md:text-2xl font-bold">{value}</p>
              <p className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default StatsBar;
