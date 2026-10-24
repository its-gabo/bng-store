import { Hr } from "@react-email/components"

type EmailSeparatorProps = {
  color?: string
  marginTop?: number
  marginBottom?: number
}

export function EmailSeparator({
  color = "#e5e5e5",
  marginTop = 0,
  marginBottom = 0,
}: EmailSeparatorProps) {
  return (
    <Hr
      style={{
        border: "none",
        borderTop: `1px solid ${color}`,
        margin: `${marginTop}px 0 ${marginBottom}px`,
      }}
    />
  )
}
