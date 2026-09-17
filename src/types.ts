export interface TriageInfo {
  domain: string;
  specialists: string[];
}

export interface StrategyInfo {
  primary_route: string;
  value_range: string;
  playbook: string;
  confidence: number;
}

export interface AnalysisResult {
  identity: string;
  condition: string;
  confidence: number;
  hidden_value: string;
  recommendations: string[];
  triage: TriageInfo;
  strategy: StrategyInfo;
  // Optional extra God-Tier forensic details if available
  forensic_checks?: {
    test: string;
    passed: boolean;
    description: string;
  }[];
  comparable_sales?: {
    platform: string;
    price: string;
    date: string;
    condition: string;
  }[];
}

export interface FlipCalculation {
  buyPrice: number;
  estimatedLow: number;
  estimatedHigh: number;
  selectedPlatform: string;
  platformFeePct: number;
  shippingInsurance: number;
  restorationCost: number;
  
  // Computed
  estimatedMedian: number;
  totalCost: number;
  grossRevenue: number;
  platformFees: number;
  netProfit: number;
  roiPct: number;
  maxRecommendedBuyPrice: number;
}

export interface ForensicCheckItem {
  id: string;
  title: string;
  instruction: string;
  status: "pending" | "pass" | "fail";
  impact: string;
}
