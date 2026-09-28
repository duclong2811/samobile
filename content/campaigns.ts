export const campaignIds = ["basic", "new-semester", "chuseok", "christmas"] as const;

export type CampaignId = (typeof campaignIds)[number];

export type CampaignCopy = {
  badge: string;
  title: string;
  accent: string;
  description: string;
  strip: string;
  primary: string;
};

export type CampaignMessages = {
  previewLabel: string;
  previewAriaLabel: string;
  options: Record<CampaignId, string>;
  campaigns: Record<Exclude<CampaignId, "basic">, CampaignCopy>;
};

export const CAMPAIGN_STORAGE_KEY = "samobile-campaign";

export function isCampaignId(value: string | null): value is CampaignId {
  return campaignIds.some((campaign) => campaign === value);
}
