import { consultationChannels } from "@/content/consultation";
import type { Messages } from "@/lib/i18n/messages";
import { ContactIcon } from "./ui-icons";
import { Arrow } from "./service-icon";
import { ConsultationSelection } from "./consultation-selection";

export function Consultation({ m }: { m: Messages }) {
  return <section id="consultation" className="consultation-section" aria-labelledby="consultation-title">
    <div className="shell consultation-inner">
      <div className="consultation-heading"><div><p className="section-kicker">{m.ctaEyebrow}</p><h2 id="consultation-title">{m.ctaTitle}</h2><p>{m.ctaDescription}</p></div><span className="consultation-emblem" aria-hidden="true"><ContactIcon type="chat" /></span></div>
      <div className="contact-channels">
        {consultationChannels.map(channel => <div className={`contact-channel channel-${channel.id}`} key={channel.id}>
          <span className="channel-icon"><ContactIcon type={channel.kind} /></span>
          <h3>{m.channelNames[channel.id]}</h3><p>{m.channelDescriptions[channel.id]}</p>
          {channel.available && channel.destination
            ? <a href={channel.destination} className="channel-link">{m.consult}<Arrow /></a>
            : <span className="channel-unavailable">{m.channelUnavailable}<span aria-hidden="true">—</span></span>}
        </div>)}
      </div>
      <ConsultationSelection m={m} />
      <div className="contact-disclosure" id="availability"><strong>{m.channelStatus}</strong><p>{m.availabilityBody}</p></div>
    </div>
  </section>;
}
