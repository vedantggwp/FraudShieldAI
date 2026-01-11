"use client";

import { motion } from "framer-motion";
import { parseRiskFactor } from "@/lib/utils";

interface FactorCardProps {
  factor: string;
  index: number;
}

const iconComponents: Record<string, string> = {
  "👤": "bg-blue-500/10 text-blue-500",
  "🕐": "bg-purple-500/10 text-purple-500",
  "📈": "bg-orange-500/10 text-orange-500",
  "⚠️": "bg-red-500/10 text-red-500",
};

export function FactorCard({ factor, index }: FactorCardProps) {
  const parsed = parseRiskFactor(factor);
  const iconStyle = iconComponents[parsed.icon] || iconComponents["⚠️"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
      className="flex items-start gap-4 p-4 rounded-xl border bg-[var(--card)]"
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl ${iconStyle}`}>
        {parsed.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {parsed.number}.
          </span>
          <h4 className="font-semibold">{parsed.title}</h4>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {parsed.description}
        </p>
      </div>
    </motion.div>
  );
}

export function NoFactors() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-2xl">
        ✓
      </div>
      <div>
        <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">
          No Fraud Indicators Detected
        </h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This transaction appears normal based on our analysis.
        </p>
      </div>
    </motion.div>
  );
}
