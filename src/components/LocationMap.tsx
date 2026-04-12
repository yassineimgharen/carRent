import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguage } from "@/hooks/use-language";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMap = () => {
  const { t } = useLanguage();
  const position: [number, number] = [30.4012715, -9.5770416];
  const mapsUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}`;

  return (
    <section className="container py-24">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-primary font-medium uppercase tracking-wider">{t('contact.findUs')}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t('contact.location')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('contact.visitText')}</p>
        </div>

        <div className="glass-card overflow-hidden rounded-xl relative">
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
            <Marker position={position} />
          </MapContainer>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
            {t('contact.getDirections')}
          </a>
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
