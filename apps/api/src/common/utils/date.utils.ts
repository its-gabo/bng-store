import { MINUTE_MS, SECOND_MS } from '../time/time.constants';

export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * MINUTE_MS);

export const millisecondsToSeconds = (milliseconds: number): number =>
  Math.ceil(milliseconds / SECOND_MS);
