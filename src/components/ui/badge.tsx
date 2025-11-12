import { cn } from "@/utils/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-canaria-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wide text-canaria-dark",
        className
      )}
      {...props}
    />
  );
}
