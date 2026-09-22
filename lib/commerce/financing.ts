export type FinancingEstimate = {
  principalKrw: number;
  annualRateBasisPoints: number;
  months: number;
  interestKrw: number;
  totalPaymentKrw: number;
  monthlyPaymentKrw: number;
};

/**
 * Flat/simple interest against the original principal.
 * All results are integer KRW. Interest and monthly payment round to the nearest
 * won (half up); total payment is principal plus the rounded interest.
 */
export function calculateFinancing(
  principalKrw: number,
  annualRateBasisPoints: number,
  months: number,
): FinancingEstimate {
  if (!Number.isSafeInteger(principalKrw) || principalKrw < 0) throw new RangeError("principalKrw must be a non-negative safe integer");
  if (!Number.isSafeInteger(annualRateBasisPoints) || annualRateBasisPoints < 0) throw new RangeError("annualRateBasisPoints must be a non-negative safe integer");
  if (!Number.isSafeInteger(months) || months <= 0) throw new RangeError("months must be a positive safe integer");
  const interestKrw = Math.round((principalKrw * annualRateBasisPoints * months) / 120_000);
  const totalPaymentKrw = principalKrw + interestKrw;
  const monthlyPaymentKrw = Math.round(totalPaymentKrw / months);
  return { principalKrw, annualRateBasisPoints, months, interestKrw, totalPaymentKrw, monthlyPaymentKrw };
}
