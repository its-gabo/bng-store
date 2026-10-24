/** Same-origin path only: rejects protocol-relative `//host` and `/\host`. */
export const isSafeRedirectPath = (value: string): boolean =>
  value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\');
