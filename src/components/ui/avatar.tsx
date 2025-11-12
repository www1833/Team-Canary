import { cn } from "@/utils/cn";

export function Avatar({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("h-16 w-16 rounded-full object-cover", className)} {...props} />;
}
