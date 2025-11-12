import { Mail, Twitter, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-24 bg-canaria-dark text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h3 className="text-xl font-semibold">カナリア軍団</h3>
          <p className="mt-1 text-sm text-white/70">© {new Date().getFullYear()} カナリア軍団. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4 text-white/80">
          <a href="#" aria-label="X (旧Twitter)">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="mailto:info@canaria.example" className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" /> info@canaria.example
          </a>
        </div>
      </div>
    </footer>
  );
};
