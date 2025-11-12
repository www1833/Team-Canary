import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { cn } from "@/utils/cn";

interface UploadDropzoneProps {
  onFiles: (files: File[]) => void;
}

export const UploadDropzone = ({ onFiles }: UploadDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFiles(acceptedFiles);
      }
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-canaria-green/60 bg-canaria-green/5 p-10 text-center text-sm text-slate-600 transition hover:bg-canaria-green/10",
        isDragActive && "border-solid bg-canaria-green/20"
      )}
    >
      <input {...getInputProps()} />
      <ImagePlus className="h-10 w-10 text-canaria-green" />
      <p>
        画像ファイルをドラッグ＆ドロップ、またはクリックして選択。
        <br /> 最大2048pxに自動調整されます。
      </p>
    </div>
  );
};
