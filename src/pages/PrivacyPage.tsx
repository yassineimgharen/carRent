import { useLanguage } from "@/hooks/use-language";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16 mt-10">
          <h1 className="text-4xl font-bold text-foreground mb-6">{t("privacy.title")}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("privacy.intro")}</p>
        </div>

        {/* Privacy Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
              {t("privacy.section1Title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.section1Text")}</p>
          </div>

          {/* Section 2 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
              {t("privacy.section2Title")}
            </h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>{t("privacy.section2Item1")}</li>
              <li>{t("privacy.section2Item2")}</li>
              <li>{t("privacy.section2Item3")}</li>
              <li>{t("privacy.section2Item4")}</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
              {t("privacy.section3Title")}
            </h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>{t("privacy.section3Item1")}</li>
              <li>{t("privacy.section3Item2")}</li>
              <li>{t("privacy.section3Item3")}</li>
              <li>{t("privacy.section3Item4")}</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
              {t("privacy.section4Title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">{t("privacy.section4Text")}</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>{t("privacy.section4Item1")}</li>
              <li>{t("privacy.section4Item2")}</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">5</span>
              {t("privacy.section5Title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.section5Text")}</p>
          </div>

          {/* Section 6 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">6</span>
              {t("privacy.section6Title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.section6Text")}</p>
          </div>

          {/* Section 7 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">7</span>
              {t("privacy.section7Title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.section7Text")}</p>
          </div>

          {/* Section 8 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">8</span>
              {t("privacy.section8Title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.section8Text")}</p>
          </div>

          {/* Section 9 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">9</span>
              {t("privacy.section9Title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.section9Text")}</p>
          </div>

          {/* Section 10 */}
          <div className="bg-card p-6 rounded-xl border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">10</span>
              {t("privacy.section10Title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.section10Text")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
