export const luckyWheelSegments = [
  { id: "discount-10-percent", reward: "discount10Percent", tone: "prize" },
  { id: "no-prize-1", reward: "noPrize", tone: "neutral" },
  { id: "no-prize-2", reward: "noPrize", tone: "neutral" },
  { id: "discount-10000-krw", reward: "discount10000Krw", tone: "prize" },
  { id: "no-prize-3", reward: "noPrize", tone: "neutral" },
  { id: "no-prize-4", reward: "noPrize", tone: "neutral" },
  { id: "discount-50000-krw", reward: "discount50000Krw", tone: "prize" },
  { id: "no-prize-5", reward: "noPrize", tone: "neutral" },
  { id: "no-prize-6", reward: "noPrize", tone: "neutral" },
  { id: "no-prize-7", reward: "noPrize", tone: "neutral" },
] as const;

export type LuckyWheelSegment = (typeof luckyWheelSegments)[number];
export type LuckyWheelReward = LuckyWheelSegment["reward"];

