"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UploadTransactionsPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setError("Please upload a CSV file");
      return;
    }

    setIsUploading(true);
    setError(null);
    setResults(null);

    try {
      // Parse CSV
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        throw new Error("CSV file must contain header and at least one row");
      }

      // Parse header
      const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const requiredFields = ["amount", "payee", "reference", "timestamp"];
      const missingFields = requiredFields.filter((field) => !header.includes(field));

      if (missingFields.length > 0) {
        throw new Error(
          `CSV missing required columns: ${missingFields.join(", ")}. Required: amount, payee, reference, timestamp`
        );
      }

      // Parse rows
      const transactions = [];
      let successCount = 0;
      let failCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const row: Record<string, string> = {};

        header.forEach((field, index) => {
          row[field] = values[index] || "";
        });

        try {
          // Build transaction object
          const transaction = {
            amount: parseFloat(row.amount),
            payee: row.payee,
            reference: row.reference,
            timestamp: new Date(row.timestamp).toISOString(),
            payee_is_new: row.payee_is_new?.toLowerCase() === "true",
          };

          // Validate
          if (!transaction.amount || transaction.amount <= 0) {
            throw new Error("Invalid amount");
          }
          if (!transaction.payee) {
            throw new Error("Payee required");
          }
          if (!transaction.reference) {
            throw new Error("Reference required");
          }
          if (!transaction.timestamp || transaction.timestamp === "Invalid Date") {
            throw new Error("Invalid timestamp");
          }

          transactions.push(transaction);
          successCount++;
        } catch (rowError) {
          failCount++;
          console.error(`Row ${i + 1} failed:`, rowError);
        }
      }

      // Upload transactions
      if (transactions.length === 0) {
        throw new Error("No valid transactions found in CSV");
      }

      let uploadedCount = 0;
      let uploadFailedCount = 0;

      for (const transaction of transactions) {
        try {
          const response = await fetch(`${API_BASE}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transaction),
          });

          if (response.ok) {
            uploadedCount++;
          } else {
            uploadFailedCount++;
          }
        } catch (err) {
          uploadFailedCount++;
        }
      }

      setResults({
        success: uploadedCount,
        failed: uploadFailedCount,
      });

      // Redirect after success
      if (uploadedCount > 0) {
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Import Transactions</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Upload a CSV file to bulk import transactions
            </p>
          </div>

          {/* File Upload Area */}
          {!results && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-8 w-8 text-zinc-400" />
                <div>
                  <p className="font-medium">Drop your CSV file here</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    or click to select
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Import Complete
              </h3>
              <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                <p>✅ Successfully imported: {results.success} transactions</p>
                {results.failed > 0 && (
                  <p>❌ Failed: {results.failed} transactions</p>
                )}
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-3">
                Redirecting to dashboard...
              </p>
            </div>
          )}

          {/* CSV Format Help */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              CSV Format Required
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Your CSV must include these columns:
            </p>
            <code className="block bg-white dark:bg-zinc-900 p-3 rounded text-xs text-zinc-900 dark:text-zinc-100 overflow-x-auto">
              amount,payee,reference,timestamp,payee_is_new
            </code>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
              Example:
              <br />
              2000,ABC Holdings Ltd,Invoice 2847,2026-01-05T15:30:00Z,true
            </p>
          </div>

          {/* Upload Button */}
          <label className="block">
            <Button
              disabled={isUploading}
              className="w-full"
              onClick={() => {
                const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                input?.click();
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Select CSV File
                </>
              )}
            </Button>
          </label>
        </div>
      </Card>
    </div>
  );
}
