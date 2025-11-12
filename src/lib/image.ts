import * as exifr from "exifr";

export type ResizeOptions = {
  maxWidth: number;
  maxHeight?: number;
  quality?: number;
};

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function getTargetSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio)
  };
}

async function applyOrientation(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, orientation = 1) {
  const width = canvas.width;
  const height = canvas.height;
  if (orientation > 4) {
    canvas.width = height;
    canvas.height = width;
  }
  switch (orientation) {
    case 2:
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
    default:
      break;
  }
}

export async function resizeImage(file: File, options: ResizeOptions): Promise<{ dataUrl: string; width: number; height: number }> {
  const dataUrl = await readFileAsDataURL(file);
  const [image, orientation] = await Promise.all([loadImage(dataUrl), exifr.orientation(file).catch(() => 1)]);
  const maxHeight = options.maxHeight ?? options.maxWidth;
  const { width, height } = getTargetSize(image.width, image.height, options.maxWidth, maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas がサポートされていません。");

  await applyOrientation(canvas, ctx, orientation ?? 1);
  ctx.drawImage(image, 0, 0, width, height);

  const resultUrl = canvas.toDataURL("image/jpeg", options.quality ?? 0.8);
  return { dataUrl: resultUrl, width: canvas.width, height: canvas.height };
}

export async function createThumbnail(file: File, maxSize: number): Promise<string> {
  const resized = await resizeImage(file, { maxWidth: maxSize, maxHeight: maxSize, quality: 0.7 });
  return resized.dataUrl;
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
