import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarImage {
  id: string;
  image_url: string;
  display_order: number;
}

const CarGallery = ({ images, carName }: { images: CarImage[]; carName: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-secondary flex items-center justify-center text-muted-foreground">
        No Images
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setImagePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setImagePosition({ x: 50, y: 50 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Thumbnails - Left side on desktop, top on mobile */}
      {images.length > 1 && (
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-1 md:pb-0">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`flex-shrink-0 w-20 md:w-full aspect-[3/2] rounded-lg overflow-hidden border-2 transition-colors ${
                  i === activeIndex
                    ? "border-primary"
                    : "border-border opacity-60"
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main image - Right side on desktop, top on mobile */}
      <div className={`${images.length > 1 ? 'md:col-span-3' : 'md:col-span-4'} order-1 md:order-2`}>
        <div 
          className="aspect-[3/2] md:h-[500px] md:aspect-auto rounded-xl overflow-hidden bg-secondary relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={images[activeIndex].id}
              src={images[activeIndex].image_url}
              alt={`${carName} - photo ${activeIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 ease-out"
              style={{ 
                objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                transform: 'scale(1.0)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm rounded-full h-9 w-9"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm rounded-full h-9 w-9"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarGallery;
