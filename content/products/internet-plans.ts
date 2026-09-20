import { agencyMetadata, type InternetPlan } from "./plans";
export const internetPlans: readonly InternetPlan[] = [
  { ...agencyMetadata, id: "internet-100", category: "internet", speed: 100, monthlyPrice: 22000, contractMonths: 36 },
  { ...agencyMetadata, id: "internet-500", category: "internet", speed: 500, monthlyPrice: 33000, contractMonths: 36 },
];
