/** Exponential backoff: the delay doubles with every failed attempt. */
export const calculateRetryAvailableAt = (params: {
  attempts: number;
  retryDelayMs: number;
  now: Date;
}): Date => {
  const { attempts, retryDelayMs, now } = params;

  return new Date(
    now.getTime() + retryDelayMs * 2 ** Math.max(0, attempts - 1),
  );
};
