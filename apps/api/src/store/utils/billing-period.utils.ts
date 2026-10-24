import { match } from 'ts-pattern';

import { BILLING_PERIODS } from '../constants/store.constants';

import type { BillingPeriod } from '../types/store.types';

const addCalendarMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  const dayOfMonth = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);

  const lastDayOfTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();

  result.setUTCDate(Math.min(dayOfMonth, lastDayOfTargetMonth));

  return result;
};

/**
 * Returns the end of a billing period that starts at `periodStart`, keeping
 * the day of month and clamping it to the last day of shorter months.
 */
export const calculateBillingPeriodEnd = (
  periodStart: Date,
  billingPeriod: BillingPeriod,
): Date =>
  match(billingPeriod)
    .with(BILLING_PERIODS.MONTHLY, () => addCalendarMonths(periodStart, 1))
    .with(BILLING_PERIODS.YEARLY, () => addCalendarMonths(periodStart, 12))
    .exhaustive();
