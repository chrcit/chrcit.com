import { motion, useScroll, useTransform } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-40 h-[2px] w-full bg-white/10"
      style={{ opacity }}
    >
      <motion.div
        className="h-full origin-left bg-[color:var(--color-brand)]"
        style={{ scaleX: scrollYProgress }}
      />
    </motion.div>
  );
}
