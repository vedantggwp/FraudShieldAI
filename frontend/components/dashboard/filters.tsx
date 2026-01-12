"use client";

import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RiskLevel } from "@/lib/types";

interface DashboardFiltersProps {
  onSearchChange: (query: string) => void;
  onRiskLevelChange: (level: RiskLevel | "all") => void;
  searchQuery: string;
  riskLevel: RiskLevel | "all";
}

export function DashboardFilters({
  onSearchChange,
  onRiskLevelChange,
  searchQuery,
  riskLevel,
}: DashboardFiltersProps) {
  const riskLevels: Array<{ value: RiskLevel | "all"; label: string; color: string }> = [
    { value: "all", label: "All Transactions", color: "bg-zinc-100 dark:bg-zinc-800" },
    { value: "high", label: "High Risk", color: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200" },
    { value: "medium", label: "Medium Risk", color: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-200" },
    { value: "low", label: "Low Risk", color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-200" },
  ];

  return (
    <Card>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by payee or reference..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Risk Level Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {riskLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => onRiskLevelChange(level.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                riskLevel === level.value
                  ? level.color + " ring-2 ring-offset-2 dark:ring-offset-zinc-950"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
