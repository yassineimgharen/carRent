import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";

const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success(t('contact.success'));
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || t('contact.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-24 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-3"
      >
        <p className="text-sm text-primary font-medium uppercase tracking-wider">{t('contact.getInTouch')}</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">{t('contact.contactUs')}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('contact.contactSubtitle')}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-display text-xl font-semibold">{t('contact.contactInfo')}</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t('contact.address')}</p>
                  <p className="text-sm text-muted-foreground">
                    شارع احمد زكرياء رقم 132 بلوك ابطيح تمديد الداخلة<br />
                    Agadir, Morocco
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t('contact.phone')}</p>
                  <a href="tel:+212661604965" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +212 661 604 965
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t('contact.email')}</p>
                  <a href="mailto:sihabi.cars@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    sihabi.cars@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="font-medium mb-2">{t('contact.businessHours')}</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{t('contact.monday')}: 8:00 AM - 8:00 PM</p>
                <p>{t('contact.saturday')}: 9:00 AM - 6:00 PM</p>
                <p>{t('contact.sunday')}: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <h3 className="font-display text-xl font-semibold">{t('contact.sendMessage')}</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('contact.name')} *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('contact.namePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('contact.email')} *</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('contact.emailPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('contact.phone')}</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('contact.phonePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('contact.message')} *</label>
              <Textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('contact.messagePlaceholder')}
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full rounded-full font-display" disabled={loading}>
              {loading ? t('contact.sending') : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t('contact.send')}
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
