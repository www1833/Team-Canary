import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bird, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/members", label: "メンバー" },
    { to: "/admin/login", label: "管理" }
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur shadow-header" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-canaria-green text-canaria-yellow shadow-md">
            <Bird className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-canaria-dark">カナリア軍団</p>
            <p className="text-xs text-canaria-dark/70">黄色と緑で、勝利へ。</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-canaria-dark md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative transition hover:text-canaria-green ${
                  isActive ? "text-canaria-green" : "text-canaria-dark"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="header-underline"
                        className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-canaria-yellow"
                      />
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <Button className="md:hidden" variant="ghost" size="sm" onClick={() => setOpen((prev) => !prev)} aria-label="メニュー">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-canaria-dark/10 bg-white px-4 py-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className="text-canaria-dark">
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
