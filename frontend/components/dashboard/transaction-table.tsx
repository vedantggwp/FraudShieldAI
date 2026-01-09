"use client";

import { Transaction } from "@/lib/types";
import { TransactionRow } from "./transaction-row";
import { TableSkeleton } from "../ui/skeleton";
import { AlertCircle } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
}

export function TransactionTable({
  transactions,
  isLoading,
  isError,
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-[var(--card)] p-4">
        <TableSkeleton rows={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-[var(--card)] p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">
          Cannot connect to FraudShield API. Is the backend running?
        </p>
        <code className="block bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-sm">
          uvicorn app.main:app --port 8000
        </code>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border bg-[var(--card)] p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          No transactions found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="hidden md:flex items-center gap-4 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        <div className="w-6">Risk</div>
        <div className="w-28">Amount</div>
        <div className="flex-1">Payee</div>
        <div className="w-32">Time</div>
        <div className="w-20">Score</div>
        <div className="w-5"></div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {transactions.map((transaction, index) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
