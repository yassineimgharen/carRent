import { useLanguage } from "@/hooks/use-language";
import { Car, Shield, Clock, Mail, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16 mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg text-gray-700 leading-relaxed">{t("about.intro")}</p>
        </motion.div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-1 h-8 bg-primary rounded"></div>
            {t("about.missionTitle")}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {i === 1 && <Clock className="w-10 h-10 text-primary mb-4" />}
                {i === 2 && <Shield className="w-10 h-10 text-primary mb-4" />}
                {i === 3 && <Car className="w-10 h-10 text-primary mb-4" />}
                <p className="text-muted-foreground">{t(`about.mission${i}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-1 h-8 bg-primary rounded"></div>
            {t("about.whyTitle")}
          </motion.h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <h3 className="font-semibold text-lg text-foreground mb-2">{t(`about.why${i}Title`)}</h3>
                <p className="text-muted-foreground">{t(`about.why${i}Text`)}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quality & Safety */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded"></div>
            {t("about.qualityTitle")}
          </h2>
          <div className="bg-primary text-primary-foreground p-8 rounded-xl">
            <p className="text-lg leading-relaxed">{t("about.qualityText")}</p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded"></div>
            {t("about.contactTitle")}
          </h2>
          <div className="bg-card p-8 rounded-xl shadow-lg border">
            <p className="text-muted-foreground mb-6">{t("about.contactText")}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:sihabi.cars@gmail.com"
                className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-5 h-5" />
                sihabi.cars@gmail.com
              </a>
              <a
                href="https://sihabicars.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Globe className="w-5 h-5" />
                sihabicars.com
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
