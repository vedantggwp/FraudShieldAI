export interface Transaction {
  id: string;
  amount: number;
  payee: string;
  timestamp: string;
  reference: string;
  risk_score: number;
  risk_level: "high" | "medium" | "low";
  created_at: string;
}

export interface TransactionDetail extends Transaction {
  confidence: number;
  explanation: string;
  risk_factors: string[];
  recommended_action: string;
}

export interface PaginatedResponse {
  items: Transaction[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type RiskLevel = "high" | "medium" | "low";
