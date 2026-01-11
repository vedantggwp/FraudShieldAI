"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ActionButtonsProps {
  transactionId: string;
  riskLevel: "high" | "medium" | "low";
}

export function ActionButtons({ transactionId, riskLevel }: ActionButtonsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/transactions/${transactionId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to approve transaction");
      }

      setToast({ type: "success", message: "Transaction marked as legitimate" });
      setShowApproveDialog(false);
      
      // Auto-hide toast and refresh page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setToast({ type: "error", message: "Failed to approve transaction" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/transactions/${transactionId}/reject`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reject transaction");
      }

      setToast({ type: "success", message: "Transaction marked as fraud" });
      setShowRejectDialog(false);
      
      // Auto-hide toast and refresh page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setToast({ type: "error", message: "Failed to reject transaction" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top ${
            toast.type === "success"
              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
              : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => setShowRejectDialog(true)}
        >
          Mark as Fraud
        </Button>
        <Button
          variant="default"
          className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          onClick={() => setShowApproveDialog(true)}
        >
          Mark as Legitimate
        </Button>
      </div>

      {/* Approve Confirmation Dialog */}
      {showApproveDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Mark as Legitimate?</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  This will mark the transaction as approved and legitimate. You can review your decision later in the audit log.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowApproveDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Yes, Approve"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Mark as Fraud?</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  This will flag the transaction as fraudulent and may trigger additional security measures. This action can be reviewed later.
                </p>
                {riskLevel === "low" && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium">
                    ⚠️ This transaction has a LOW risk score. Are you sure it's fraud?
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowRejectDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Yes, Mark as Fraud"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
