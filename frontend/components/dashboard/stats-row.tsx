"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "../ui/card";

interface StatsRowProps {
  total: number;
  high: number;
  medium: number;
  low: number;
}

function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = Math.round(startValue + (value - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="tabular-nums">{displayValue}</span>;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${color}/10`}>
            <Icon className={`h-5 w-5 ${color.replace("bg-", "text-")}`} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
            <p className="text-2xl font-bold">
              <AnimatedNumber value={value} />
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function StatsRow({ total, high, medium, low }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Transactions"
        value={total}
        icon={BarChart3}
        color="bg-accent"
        delay={0}
      />
      <StatCard
        label="High Risk"
        value={high}
        icon={AlertTriangle}
        color="bg-red-500"
        delay={0.1}
      />
      <StatCard
        label="Medium Risk"
        value={medium}
        icon={AlertCircle}
        color="bg-amber-500"
        delay={0.2}
      />
      <StatCard
        label="Low Risk"
        value={low}
        icon={CheckCircle}
        color="bg-emerald-500"
        delay={0.3}
      />
    </div>
  );
}
