import { forwardRef } from "react";
import { cn } from "@/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canaria-green",
        className
      )}
      {...props}
    />
  );
});
