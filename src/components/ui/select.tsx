import { forwardRef } from "react";
import { cn } from "@/utils/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canaria-green",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
