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

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-secondary flex items-center justify-center text-muted-foreground">
        No Images
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-video rounded-xl overflow-hidden bg-secondary relative group">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[activeIndex].id}
            src={images[activeIndex].image_url}
            alt={`${carName} - photo ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-9 w-9"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-9 w-9"
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

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarGallery;
