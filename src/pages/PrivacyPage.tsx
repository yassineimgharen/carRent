import { useLanguage } from "@/hooks/use-language";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-6">{t("privacy.title")}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("privacy.intro")}</p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Sections with lists */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <motion.div
              key={num}
              className="bg-card p-6 rounded-xl border"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: num * 0.05 }}
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">{num}</span>
                {t(`privacy.section${num}Title`)}
              </h2>
              {num === 2 ? (
                <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
                  <li>{t("privacy.section2Item1")}</li>
                  <li>{t("privacy.section2Item2")}</li>
                  <li>{t("privacy.section2Item3")}</li>
                  <li>{t("privacy.section2Item4")}</li>
                </ul>
              ) : num === 3 ? (
                <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
                  <li>{t("privacy.section3Item1")}</li>
                  <li>{t("privacy.section3Item2")}</li>
                  <li>{t("privacy.section3Item3")}</li>
                  <li>{t("privacy.section3Item4")}</li>
                </ul>
              ) : num === 4 ? (
                <>
                  <p className="text-muted-foreground leading-relaxed mb-3">{t("privacy.section4Text")}</p>
                  <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
                    <li>{t("privacy.section4Item1")}</li>
                    <li>{t("privacy.section4Item2")}</li>
                  </ul>
                </>
              ) : (
                <p className="text-muted-foreground leading-relaxed">{t(`privacy.section${num}Text`)}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
