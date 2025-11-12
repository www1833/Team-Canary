import { forwardRef } from "react";
import { cn } from "@/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canaria-green",
        className
      )}
      {...props}
    />
  );
});
