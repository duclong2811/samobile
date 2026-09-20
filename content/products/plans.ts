export type ProductCategory = "mobile" | "internet" | "tv" | "sim";
type ProductBase = {
  id: string;
  monthlyPrice: number;
  currency: "KRW";
  source: "SAmobile-provided";
  verificationStatus: "agency-provided";
  lastVerified: string | null;
};
export type MobilePlan = ProductBase & {
  category: "mobile";
  identifier: string;
  dataAllowance: number | null; // GB per month
  dailyDataAllowance: number | null; // GB per day
  throttledSpeed: number; // Mbps, unlimited after allowance
  calls: "unlimited" | number; // minutes
  sms: "unlimited" | number; // messages
};
export type InternetPlan = ProductBase & {
  category: "internet";
  speed: number; // Mbps
  contractMonths: number;
};
export type Plan = MobilePlan | InternetPlan;
export const agencyMetadata = {
  currency: "KRW", source: "SAmobile-provided",
  verificationStatus: "agency-provided", lastVerified: null,
} as const;
