"use client";

import type { TargetAndTransition } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const initialProps: TargetAndTransition = {
  pathLength: 0,
  opacity: 0,
  scale: 0.7,
  rotateY: -15,
};

const animateProps: TargetAndTransition = {
  pathLength: 1,
  opacity: 1,
  scale: 1,
  rotateY: 0,
};

type Props = React.ComponentProps<typeof motion.svg> & {
  speed?: number;
  onAnimationComplete?: () => void;
};

function SamsungHelloEnglishEffect({
  className,
  speed = 1,
  onAnimationComplete,
  ...props
}: Props) {
  const calc = (x: number) => x * speed;

  return (
    <motion.svg
      className={cn("h-28", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 250"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      initial={{ opacity: 1, scale: 0.8, rotateX: 8 }}
      exit={{ opacity: 0, scale: 0.6, rotateX: -8 }}
      transition={{ duration: 0.7, type: "spring", stiffness: 140, damping: 18 }}
      {...props}
    >
      <title>hello</title>
      <motion.g>
        <motion.path d="M40 60L40 190" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.5), type: "spring", stiffness: 280, damping: 20, opacity: { duration: 0.3 } }} />
        <motion.path d="M40 125L100 125" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.4), delay: calc(0.3), type: "spring", stiffness: 320, damping: 22, opacity: { duration: 0.25, delay: calc(0.3) } }} />
        <motion.path d="M100 60L100 190" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.5), delay: calc(0.6), type: "spring", stiffness: 280, damping: 20, opacity: { duration: 0.3, delay: calc(0.6) } }} />
      </motion.g>
      <motion.g>
        <motion.path d="M150 60L150 190" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.5), delay: calc(1.0), type: "spring", stiffness: 260, damping: 19, opacity: { duration: 0.3, delay: calc(1.0) } }} />
        <motion.path d="M150 60L210 60" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.4), delay: calc(1.3), type: "spring", stiffness: 300, damping: 21, opacity: { duration: 0.25, delay: calc(1.3) } }} />
        <motion.path d="M150 125L190 125" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.4), delay: calc(1.6), type: "spring", stiffness: 300, damping: 21, opacity: { duration: 0.25, delay: calc(1.6) } }} />
        <motion.path d="M150 190L210 190" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.4), delay: calc(1.9), type: "spring", stiffness: 300, damping: 21, opacity: { duration: 0.25, delay: calc(1.9) } }} />
      </motion.g>
      <motion.path d="M260 60L260 190L300 190" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.6), delay: calc(2.3), type: "spring", stiffness: 240, damping: 18, opacity: { duration: 0.35, delay: calc(2.3) } }} />
      <motion.path d="M340 60L340 190L380 190" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.6), delay: calc(2.8), type: "spring", stiffness: 240, damping: 18, opacity: { duration: 0.35, delay: calc(2.8) } }} />
      <motion.path d="M450 90L490 110L490 170L450 190L420 170L420 110L450 90" style={{ strokeLinecap: "square" }} initial={initialProps} animate={animateProps} transition={{ duration: calc(0.8), delay: calc(3.3), type: "spring", stiffness: 180, damping: 16, opacity: { duration: 0.4, delay: calc(3.3) } }} />
      <motion.g className="stroke-blue-500 opacity-70">
        <motion.path d="M20 40L20 20L40 20" strokeWidth="3" style={{ strokeLinecap: "square" }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: calc(0.5), delay: calc(4.0) }} />
        <motion.path d="M500 40L520 20L520 40" strokeWidth="3" style={{ strokeLinecap: "square" }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: calc(0.5), delay: calc(4.2) }} />
        <motion.path d="M20 210L20 230L40 230" strokeWidth="3" style={{ strokeLinecap: "square" }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: calc(0.5), delay: calc(4.4) }} />
        <motion.path d="M500 210L520 230L520 210" strokeWidth="3" style={{ strokeLinecap: "square" }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: calc(0.5), delay: calc(4.6) }} onAnimationComplete={onAnimationComplete} />
      </motion.g>
    </motion.svg>
  );
}

export { SamsungHelloEnglishEffect };
