import { Photo } from "@/types/photo";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PhotoCardProps {
  photo: Photo;
  onClick?: () => void;
}

export const PhotoCard = ({ photo, onClick }: PhotoCardProps) => (
  <button onClick={onClick} className="text-left">
    <Card className="h-full overflow-hidden">
      <CardHeader className="p-0">
        <img src={photo.thumb ?? photo.src} alt={photo.title} className="h-40 w-full object-cover" loading="lazy" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-base">{photo.title ?? "写真"}</CardTitle>
        {photo.tags && (
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-canaria-green">{photo.tags.join(", ")}</p>
        )}
      </CardContent>
    </Card>
  </button>
);
