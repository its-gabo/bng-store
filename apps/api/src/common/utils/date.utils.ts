import { MINUTE_MS } from '../time/time.constants';

export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * MINUTE_MS);
