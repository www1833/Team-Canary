import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export const Section = ({ id, title, description, children }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.section
      id={id}
      className="mx-auto mt-20 max-w-6xl px-4 sm:px-6"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-canaria-dark sm:text-3xl">
            <span className="border-b-4 border-canaria-yellow pb-1">{title}</span>
          </h2>
          {description && <p className="mt-2 max-w-2xl text-slate-600">{description}</p>}
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </motion.section>
  );
};
