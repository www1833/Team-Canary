import { useEffect, useState } from "react";
import { Photo } from "@/types/photo";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbox } from "./Lightbox";

interface GalleryStripProps {
  photos: Photo[];
}

export const GalleryStrip = ({ photos }: GalleryStripProps) => {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (photos.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photos.length]);

  const active = photos[current];

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-canaria-dark/10 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={active?.id}
            src={active?.src}
            alt={active?.title}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6 }}
            className="h-[420px] w-full object-cover"
            onClick={() => setOpen(true)}
          />
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            className={`h-2 w-10 rounded-full transition ${
              current === index ? "bg-canaria-green" : "bg-canaria-green/30"
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`${index + 1}枚目の写真を表示`}
          />
        ))}
      </div>
      {active && <Lightbox open={open} setOpen={setOpen} photos={photos} initialId={active.id} />}
    </div>
  );
};
