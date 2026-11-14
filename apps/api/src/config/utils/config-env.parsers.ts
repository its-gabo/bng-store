export const parseIntegerEnv = (
  value: string | undefined,
  fallback: number,
): number => (value ? Number.parseInt(value, 10) : fallback);

export const parseBooleanEnv = (
  value: string | undefined,
  fallback: boolean,
): boolean => (value ? value === 'true' : fallback);
