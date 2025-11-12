import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-canaria-yellow via-white to-canaria-green/30">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute -left-10 top-20 h-64 w-64 rounded-full bg-canaria-green/20 blur-3xl" />
        <div className="absolute right-10 bottom-24 h-56 w-56 rounded-full bg-canaria-yellow/20 blur-3xl" />
      </motion.div>
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-canaria-dark shadow"
        >
          チーム紹介
        </motion.span>
        <motion.h1
          className="mt-6 text-4xl font-bold text-canaria-dark sm:text-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          カナリア軍団
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-slate-700"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          黄色と緑で、勝利へ。情熱と仲間を武器に、地域の頂点を目指す草野球チームです。
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button asChild>
            <Link to="/members">メンバーを見る</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/admin/login">管理者ログイン</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
