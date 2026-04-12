import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguage } from "@/hooks/use-language";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMap = () => {
  const { t } = useLanguage();
  // Agadir, Morocco - Your exact location
  const position: [number, number] = [30.4012715, -9.5770416];

  return (
    <section className="container py-24">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-primary font-medium uppercase tracking-wider">{t('contact.findUs')}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t('contact.location')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('contact.visitText')}
          </p>
        </div>

        <div className="glass-card overflow-hidden rounded-xl">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <div className="text-center space-y-2">
                  <p className="font-semibold">Sihabi Cars</p>
                  <p className="text-sm text-muted-foreground">NATURAFRIKA, Agadir</p>
                  <a
                    href="https://www.google.com/maps?q=30.4012715,-9.5770416"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {t('contact.getDirections')}
                  </a>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-1">{t('contact.address')}</p>
            <p className="font-semibold">{t('contact.addressLine1')}</p>
            <p className="text-sm">{t('contact.addressLine2')}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-1">{t('contact.email')}</p>
            <p className="font-semibold">sihabi.cars@gmail.com</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-1">{t('contact.hours')}</p>
            <p className="font-semibold">Mon-Sat: 8AM - 8PM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
