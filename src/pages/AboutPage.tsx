import { useLanguage } from "@/hooks/use-language";
import { Car, Shield, Clock, Mail, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16 mt-10">
          <p className="text-lg text-gray-700 leading-relaxed">{t("about.intro")}</p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded"></div>
            {t("about.missionTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <Clock className="w-10 h-10 text-primary mb-4" />
              <p className="text-muted-foreground">{t("about.mission1")}</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <p className="text-muted-foreground">{t("about.mission2")}</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <Car className="w-10 h-10 text-primary mb-4" />
              <p className="text-muted-foreground">{t("about.mission3")}</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded"></div>
            {t("about.whyTitle")}
          </h2>
          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary">
              <h3 className="font-semibold text-lg text-foreground mb-2">{t("about.why1Title")}</h3>
              <p className="text-muted-foreground">{t("about.why1Text")}</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary">
              <h3 className="font-semibold text-lg text-foreground mb-2">{t("about.why2Title")}</h3>
              <p className="text-muted-foreground">{t("about.why2Text")}</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary">
              <h3 className="font-semibold text-lg text-foreground mb-2">{t("about.why3Title")}</h3>
              <p className="text-muted-foreground">{t("about.why3Text")}</p>
            </div>
          </div>
        </div>

        {/* Quality & Safety */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded"></div>
            {t("about.qualityTitle")}
          </h2>
          <div className="bg-primary text-primary-foreground p-8 rounded-xl">
            <p className="text-lg leading-relaxed">{t("about.qualityText")}</p>
          </div>
        </div>

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
