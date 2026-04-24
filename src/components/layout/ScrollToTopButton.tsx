"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const VISIBILITY_THRESHOLD = 200;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const percentage =
        docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;

      setProgress(percentage);
      setVisible(scrollTop > VISIBILITY_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleScrollTop}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.7, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 24 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "fixed bottom-6 md:bottom-18 right-4 md:right-6 z-500000",
            "h-14 w-14 hover:cursor-pointer",
            "backdrop-blur-xl",
            "bg-white/80 dark:bg-black/60",
            "border border-white/30 dark:border-white/10",
            "shadow-xl",
            "flex flex-col items-center justify-center"
          )}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.div>

          <span className="text-[10px] font-semibold leading-none mt-1">
            {progress}%
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}