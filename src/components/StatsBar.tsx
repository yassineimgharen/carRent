import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Users, Car, Award, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useEffect, useRef } from "react";

const Counter = ({ value, duration = 2 }: { value: string; duration?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const nodeRef = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const numericValue = parseInt(value.replace(/\D/g, ''));
            if (!isNaN(numericValue)) {
              const controls = animate(count, numericValue, { duration });
              return () => controls.stop();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [count, value, duration]);

  // If value contains non-numeric characters, show as is
  if (!/\d/.test(value)) {
    return <p className="font-display text-2xl font-bold">{value}</p>;
  }

  return (
    <p ref={nodeRef} className="font-display text-2xl font-bold">
      <motion.span>{rounded}</motion.span>
      {value.includes('+') && '+'}
    </p>
  );
};

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
              <Counter value={value} duration={2} />
              <p className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default StatsBar;
