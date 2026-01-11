import { PaginatedResponse, TransactionDetail } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getTransactions(
  page = 1,
  pageSize = 100
): Promise<PaginatedResponse> {
  const res = await fetch(
    `${API_BASE}/transactions?page=${page}&page_size=${pageSize}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return res.json();
}

export async function getTransaction(id: string): Promise<TransactionDetail> {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transaction");
  }

  return res.json();
}

// Fetcher for SWR
export const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};
