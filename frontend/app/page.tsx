"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { StatsRow } from "@/components/dashboard/stats-row";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { StatsSkeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { transactions, stats, isLoading, isError } = useTransactions();

  return (
    <div className="space-y-8">
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
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          isError={isError}
        />
      </section>
    </div>
  );
}
