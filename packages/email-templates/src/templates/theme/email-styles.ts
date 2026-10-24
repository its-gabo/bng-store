export const EMAIL_STYLES = {
  card: "#ffffff",
  foreground: "#0a0a0a",
  mutedForeground: "#737373",
  border: "#e5e5e5",
  primary: "#171717",
  primaryForeground: "#fafafa",
  muted: "#f5f5f5",
  primarySoft: "#f5f5f5",
  radius: "10px",
} as const

export type EmailStyles = typeof EMAIL_STYLES
