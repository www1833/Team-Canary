import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-canaria-dark/30 bg-white/70 p-12 text-center">
    {icon && <div className="text-canaria-green">{icon}</div>}
    <p className="text-lg font-semibold text-canaria-dark">{title}</p>
    {description && <p className="text-sm text-slate-500">{description}</p>}
    {action}
  </div>
);
