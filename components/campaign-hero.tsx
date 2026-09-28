"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";
import {
  CAMPAIGN_STORAGE_KEY,
  campaignIds,
  isCampaignId,
  type CampaignId,
  type CampaignMessages,
} from "@/content/campaigns";
import type { Messages } from "@/lib/i18n/messages";
import { Arrow } from "./service-icon";

type CampaignHeroProps = {
  campaignMessages: CampaignMessages;
  m: Messages;
};

const CAMPAIGN_EVENT = "samobile:campaign-change";
let volatileCampaign: CampaignId = "basic";

function getCampaignSnapshot(): CampaignId {
  try {
    const saved = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    return isCampaignId(saved) ? saved : volatileCampaign;
  } catch {
    return volatileCampaign;
  }
}

function subscribeToCampaign(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CAMPAIGN_STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CAMPAIGN_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CAMPAIGN_EVENT, onChange);
  };
}

export function CampaignHero({ campaignMessages, m }: CampaignHeroProps) {
  const campaign = useSyncExternalStore<CampaignId>(subscribeToCampaign, getCampaignSnapshot, () => "basic");

  useEffect(() => {
    window.dispatchEvent(new Event(CAMPAIGN_EVENT));
  }, []);

  function selectCampaign(nextCampaign: CampaignId) {
    volatileCampaign = nextCampaign;
    try {
      localStorage.setItem(CAMPAIGN_STORAGE_KEY, nextCampaign);
    } catch {
      // The preview still works for the current page when storage is blocked.
    }
    window.dispatchEvent(new Event(CAMPAIGN_EVENT));
  }

  const seasonal = campaign === "basic" ? null : campaignMessages.campaigns[campaign];

  return (
    <>
      <section
        className={`commerce-hero campaign-${campaign}`}
        aria-labelledby="hero-heading"
        data-campaign={campaign}
      >
        <div className="campaign-preview shell">
          <label htmlFor="campaign-select">{campaignMessages.previewLabel}</label>
          <select
            id="campaign-select"
            aria-label={campaignMessages.previewAriaLabel}
            value={campaign}
            onChange={(event) => selectCampaign(event.target.value as CampaignId)}
          >
            {campaignIds.map((id) => <option key={id} value={id}>{campaignMessages.options[id]}</option>)}
          </select>
        </div>
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">{seasonal?.badge ?? m.eyebrow}</p>
            <h1 id="hero-heading">{seasonal?.title ?? m.heroTitle}<br/><span>{seasonal?.accent ?? m.heroAccent}</span></h1>
            <p className="hero-description">{seasonal?.description ?? m.heroDescription}</p>
            <div className="hero-actions">
              <a className="button" href="#plans">{seasonal?.primary ?? m.heroPrimary}<Arrow/></a>
              <a className="button button-outline" href="#consultation">{m.heroSecondary}<Arrow/></a>
            </div>
            <p className="hero-service-line">{seasonal?.strip ?? m.heroNote}</p>
          </div>
          <figure className="hero-media">
            <Image src="/images/mobile-internet-concept.png" width={1536} height={1024} preload sizes="(max-width: 760px) 100vw, 55vw" alt={m.visualAlt}/>
            {campaign !== "basic" && <span className="campaign-art" aria-hidden="true"><i/><b/><em/></span>}
            <figcaption>{m.visualPlaceholder}</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
