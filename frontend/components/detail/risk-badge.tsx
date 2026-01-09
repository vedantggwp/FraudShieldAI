"use client";

import { motion } from "framer-motion";
import { RiskLevel } from "@/lib/types";
import { riskColors, riskEmoji } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const colors = riskColors[level];
  const isHigh = level === "high";

  return (
    <motion.div
      className={`inline-flex flex-col items-center justify-center p-6 rounded-2xl ${colors.bg} text-white ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.span
        className="text-4xl mb-2"
        animate={
          isHigh
            ? {
                scale: [1, 1.1, 1],
              }
            : undefined
        }
        transition={
          isHigh
            ? {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }
            : undefined
        }
      >
        {riskEmoji[level]}
      </motion.span>
      <span className="text-2xl font-bold uppercase tracking-wider">
        {level}
      </span>
      <span className="text-sm opacity-80">RISK</span>
    </motion.div>
  );
}
