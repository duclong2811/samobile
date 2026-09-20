import { agencyMetadata, type MobilePlan } from "./plans";
export const mobilePlans: readonly MobilePlan[] = [
  { ...agencyMetadata, id: "mobile-a", category: "mobile", identifier: "A", monthlyPrice: 18500, dataAllowance: 7, dailyDataAllowance: null, throttledSpeed: 1, calls: "unlimited", sms: "unlimited" },
  { ...agencyMetadata, id: "mobile-b", category: "mobile", identifier: "B", monthlyPrice: 26400, dataAllowance: 15, dailyDataAllowance: null, throttledSpeed: 3, calls: 100, sms: 100 },
  { ...agencyMetadata, id: "mobile-c", category: "mobile", identifier: "C", monthlyPrice: 34900, dataAllowance: 11, dailyDataAllowance: 2, throttledSpeed: 3, calls: "unlimited", sms: "unlimited" },
  { ...agencyMetadata, id: "mobile-d", category: "mobile", identifier: "D", monthlyPrice: 41900, dataAllowance: null, dailyDataAllowance: 5, throttledSpeed: 5, calls: "unlimited", sms: "unlimited" },
];
