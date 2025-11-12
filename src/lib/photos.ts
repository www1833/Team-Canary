import { Photo } from "@/types/photo";

export function sortPhotos(photos: Photo[]): Photo[] {
  return [...photos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function filterPhotos(photos: Photo[], query: string, tags: string[], onlyFeatured: boolean): Photo[] {
  return photos.filter((photo) => {
    if (onlyFeatured && !photo.featured) return false;
    const matchQuery = query
      ? (photo.title?.includes(query) ?? false) || (photo.description?.includes(query) ?? false)
      : true;
    const matchTags = tags.length > 0 ? tags.every((tag) => photo.tags?.includes(tag)) : true;
    return matchQuery && matchTags;
  });
}

export function upsertPhoto(photos: Photo[], next: Photo): Photo[] {
  const idx = photos.findIndex((photo) => photo.id === next.id);
  if (idx === -1) {
    return [...photos, next].map((photo, index) => ({ ...photo, order: photo.order ?? index + 1 }));
  }
  const cloned = [...photos];
  cloned[idx] = next;
  return cloned;
}

export function deletePhoto(photos: Photo[], id: string): Photo[] {
  return photos.filter((photo) => photo.id !== id).map((photo, index) => ({ ...photo, order: index + 1 }));
}

export function reorderPhotos(photos: Photo[], activeId: string, overId: string | null): Photo[] {
  if (!overId || activeId === overId) return photos;
  const activeIndex = photos.findIndex((item) => item.id === activeId);
  const overIndex = photos.findIndex((item) => item.id === overId);
  if (activeIndex === -1 || overIndex === -1) return photos;
  const next = [...photos];
  const [moved] = next.splice(activeIndex, 1);
  next.splice(overIndex, 0, moved);
  return next.map((photo, index) => ({ ...photo, order: index + 1 }));
}
