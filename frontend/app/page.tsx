"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { StatsRow } from "@/components/dashboard/stats-row";
import { DashboardFilters } from "@/components/dashboard/filters";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { StatsSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RiskLevel } from "@/lib/types";
import { formatAmount } from "@/lib/utils";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel | "all">("all");

  const { transactions, stats, isLoading, isError } = useTransactions({
    searchQuery,
    riskLevel,
  });

  // Calculate fraud rate
  const fraudRate =
    stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <DashboardFilters
        searchQuery={searchQuery}
        riskLevel={riskLevel}
        onSearchChange={setSearchQuery}
        onRiskLevelChange={setRiskLevel}
      />

      {/* Financial Summary */}
      {!isLoading && (
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Amount at Risk */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Amount at Risk
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                £{formatAmount(stats.atRisk)}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                High-risk transactions
              </p>
            </div>

            {/* Fraud Rate */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Fraud Rate
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {fraudRate}%
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                {stats.high} of {stats.total} transactions
              </p>
            </div>

            {/* Transaction Count */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                in current view
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Row */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <StatsRow
          total={stats.total}
          high={stats.high}
          medium={stats.medium}
          low={stats.low}
        />
      )}

      {/* Transaction Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <div className="flex gap-2">
            <Link href="/transactions/upload">
              <Button variant="ghost" className="gap-2">
                <Plus className="h-4 w-4" />
                Import CSV
              </Button>
            </Link>
            <Link href="/transactions/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </div>
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          isError={isError}
        />
      </section>
    </div>
  );
}
