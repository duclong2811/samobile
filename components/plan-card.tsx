import type { Plan } from "@/content/products/plans";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { Arrow, ServiceIcon } from "./service-icon";

export function PlanCard({ plan, locale, m }: { plan: Plan; locale: Locale; m: Messages }) {
  const p = m.product;
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const price = new Intl.NumberFormat(locale, { style: "currency", currency: plan.currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(plan.monthlyPrice);
  const title = plan.category === "mobile" ? `${p.plan} ${plan.identifier}` : `${number(plan.speed)} Mbps`;
  return <article id={plan.id} className={`plan-card plan-${plan.category}`} aria-labelledby={`${plan.id}-title`}>
    <div className="plan-name-row"><h3 id={`${plan.id}-title`}>{title}</h3><span className="plan-icon"><ServiceIcon type={plan.category} /></span></div>
    <div className="plan-price"><strong>{price}</strong><span>{p.perMonth}</span>
      {plan.category === "internet" && <p className="plan-contract">{p.contract}: {number(plan.contractMonths / 12)} {p.years}</p>}
    </div>
    {plan.category === "mobile" && <>
      <div className="plan-main-spec"><span>{p.highSpeedData}</span><strong>
        {plan.dataAllowance !== null && `${number(plan.dataAllowance)} GB`}
        {plan.dataAllowance !== null && plan.dailyDataAllowance !== null && " + "}
        {plan.dailyDataAllowance !== null && `${number(plan.dailyDataAllowance)} GB${p.perDay}`}
      </strong></div>
      <dl className="plan-benefits">
        <div><dt>{p.afterAllowance}</dt><dd>{p.unlimitedUpTo.replace("{speed}", number(plan.throttledSpeed))}</dd></div>
        <div><dt>{p.calls}</dt><dd>{plan.calls === "unlimited" ? p.unlimited : `${number(plan.calls)} ${p.minutes}`}</dd></div>
        <div><dt>{p.sms}</dt><dd>{plan.sms === "unlimited" ? p.unlimited : `${number(plan.sms)} ${p.messages}`}</dd></div>
      </dl>
    </>}
    <a href="#consultation" className="button plan-button" aria-label={`${m.planAction} - ${title}`}>{m.planAction}<Arrow /></a>
  </article>;
}
