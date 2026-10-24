export function getSafeRedirectTo(value: unknown) {
  if (typeof value !== "string") return undefined
  if (!value.startsWith("/") || value.startsWith("//")) return undefined

  return value
}

export function getSearchToken(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined
}
