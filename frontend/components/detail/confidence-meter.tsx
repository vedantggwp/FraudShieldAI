"use client";

import { motion } from "framer-motion";
import { RiskLevel } from "@/lib/types";
import { riskColors } from "@/lib/utils";

interface ConfidenceMeterProps {
  confidence: number;
  level: RiskLevel;
}

export function ConfidenceMeter({ confidence, level }: ConfidenceMeterProps) {
  const colors = riskColors[level];
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl border bg-[var(--card)]">
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Confidence Level
      </p>

      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-zinc-200 dark:text-zinc-700"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={colors.text}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-3xl font-bold tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {confidence}%
          </motion.span>
        </div>
      </div>
    </div>
  );
}
