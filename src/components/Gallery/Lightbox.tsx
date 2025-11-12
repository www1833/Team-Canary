import { useEffect, useMemo, useState } from "react";
import { Photo } from "@/types/photo";
import { Dialog, DialogContent } from "../ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface LightboxProps {
  photos: Photo[];
  open: boolean;
  setOpen: (open: boolean) => void;
  initialId: string;
}

export const Lightbox = ({ photos, open, setOpen, initialId }: LightboxProps) => {
  const startIndex = useMemo(() => photos.findIndex((photo) => photo.id === initialId), [photos, initialId]);
  const [current, setCurrent] = useState(Math.max(0, startIndex));

  useEffect(() => {
    setCurrent(Math.max(0, startIndex));
  }, [startIndex]);

  const photo = photos[current];

  const prev = () => setCurrent((current - 1 + photos.length) % photos.length);
  const next = () => setCurrent((current + 1) % photos.length);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl bg-black/90 p-4 text-white">
        {photo && (
          <div className="relative">
            <img src={photo.src} alt={photo.title} className="mx-auto max-h-[70vh] w-full rounded-lg object-contain" />
            <div className="mt-4 space-y-2 text-center">
              <h3 className="text-lg font-semibold">{photo.title}</h3>
              {photo.description && <p className="text-sm text-white/80">{photo.description}</p>}
            </div>
            <div className="absolute left-0 top-1/2 flex w-full -translate-y-1/2 justify-between">
              <Button variant="ghost" className="bg-white/10" onClick={prev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="bg-white/10" onClick={next}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
