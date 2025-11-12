import { useMemo, useState } from "react";
import { Photo } from "@/types/photo";
import { UploadDropzone } from "../Gallery/UploadDropzone";
import { createThumbnail, resizeImage } from "@/lib/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { PhotoCard } from "../Gallery/PhotoCard";
import { filterPhotos } from "@/lib/photos";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

interface GalleryManagerProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
}

interface SortablePhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SortablePhotoCard = ({ photo, onClick, onEdit, onDelete }: SortablePhotoCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: photo.id });
  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      layout
      className="relative"
      {...attributes}
      {...listeners}
    >
      <PhotoCard photo={photo} onClick={onClick} />
      <div className="absolute right-3 top-3 flex gap-2">
        <Button size="sm" variant="ghost" onClick={onEdit}>
          編集
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete}>
          削除
        </Button>
      </div>
    </motion.div>
  );
};

export const GalleryManager = ({ photos, onChange }: GalleryManagerProps) => {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Photo | null>(null);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    photos.forEach((photo) => photo.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [photos]);

  const filtered = useMemo(() => filterPhotos(photos, query, tagsFilter, onlyFeatured), [photos, query, tagsFilter, onlyFeatured]);

  const handleUpload = async (files: File[]) => {
    const uploads: Photo[] = [];
    for (const file of files) {
      const resized = await resizeImage(file, { maxWidth: 2048 });
      const thumb = await createThumbnail(file, 400);
      uploads.push({
        id: crypto.randomUUID(),
        src: resized.dataUrl,
        thumb,
        width: resized.width,
        height: resized.height,
        order: photos.length + uploads.length + 1
      });
    }
    onChange([...photos, ...uploads]);
  };

  const handleEditSubmit = (values: Photo) => {
    const next = photos.map((photo) => (photo.id === values.id ? { ...photo, ...values } : photo));
    onChange(next);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("この写真を削除しますか？")) return;
    onChange(photos.filter((photo) => photo.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const oldIndex = photos.findIndex((item) => item.id === active.id);
    const newIndex = photos.findIndex((item) => item.id === over.id);
    const items = arrayMove(photos, oldIndex, newIndex).map((photo, index) => ({ ...photo, order: index + 1 }));
    onChange(items);
  };

  return (
    <div className="space-y-10">
      <UploadDropzone onFiles={handleUpload} />
      <div className="flex flex-col gap-4 rounded-2xl border border-canaria-dark/15 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="タイトル・説明で検索"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <Checkbox checked={onlyFeatured} onCheckedChange={(checked) => setOnlyFeatured(Boolean(checked))} />
            featuredのみ
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = tagsFilter.includes(tag);
              return (
                <button
                  key={tag}
                  className={`rounded-full border px-3 py-1 text-xs ${active ? "border-canaria-green bg-canaria-green/10" : "border-slate-300"}`}
                  onClick={() =>
                    setTagsFilter((prev) => (active ? prev.filter((value) => value !== tag) : [...prev, tag]))
                  }
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map((photo) => photo.id)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((photo) => (
              <SortablePhotoCard
                key={photo.id}
                photo={photo}
                onClick={() => setEditing(photo)}
                onEdit={() => setEditing(photo)}
                onDelete={() => handleDelete(photo.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>写真を編集</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget as HTMLFormElement);
                const next: Photo = {
                  ...editing,
                  title: formData.get("title")?.toString() ?? undefined,
                  description: formData.get("description")?.toString() ?? undefined,
                  takenAt: formData.get("takenAt")?.toString() ?? undefined,
                  tags: formData
                    .get("tags")
                    ?.toString()
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                  featured: Boolean(formData.get("featured"))
                };
                handleEditSubmit(next);
              }}
            >
              <img src={editing.src} alt={editing.title} className="h-48 w-full rounded-xl object-cover" />
              <div>
                <label className="text-sm font-medium text-canaria-dark">タイトル</label>
                <Input name="title" defaultValue={editing.title} />
              </div>
              <div>
                <label className="text-sm font-medium text-canaria-dark">説明</label>
                <Textarea name="description" defaultValue={editing.description} rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium text-canaria-dark">撮影日</label>
                <Input type="date" name="takenAt" defaultValue={editing.takenAt?.slice(0, 10)} />
              </div>
              <div>
                <label className="text-sm font-medium text-canaria-dark">タグ（カンマ区切り）</label>
                <Input name="tags" defaultValue={editing.tags?.join(", ")} />
              </div>
              <label className="flex items-center gap-2 text-sm text-canaria-dark">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={editing.featured}
                  className="h-4 w-4 rounded border-canaria-green text-canaria-green focus:ring-canaria-green"
                />
                トップに表示
              </label>
              <div className="flex justify-end gap-3">
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </DialogTrigger>
                <Button type="submit">保存</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-2xl border border-canaria-dark/15 bg-white/80 p-4 text-sm text-slate-500">
        <h3 className="text-base font-semibold text-canaria-dark">ストレージに関する注意</h3>
        <p className="mt-2">
          画像はブラウザの localStorage に保存されます。容量に上限があるため、定期的に JSON エクスポートでバックアップを取ることを推奨します。
        </p>
      </div>
    </div>
  );
};
