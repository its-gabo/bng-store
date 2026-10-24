import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { EmailSeparator } from "./components/EmailSeparator"
import { EMAIL_STYLES } from "./theme/email-styles"
import { IconMailCheck } from "@tabler/icons-react"

export type WelcomeVerifyEmailProps = {
  email: string
  name: string
  verificationUrl: string
}

export default function WelcomeVerifyEmail({
  email,
  name: _name,
  verificationUrl,
}: WelcomeVerifyEmailProps) {
  return (
    <Html>
      <Head>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&display=swap');`}
        </style>
      </Head>
      <Preview>Verify your BNG Store email address.</Preview>
      <Tailwind>
        <Body
          className="m-0 px-6 py-6"
          style={{
            backgroundColor: EMAIL_STYLES.muted,
            color: EMAIL_STYLES.foreground,
            fontFamily: "Outfit, 'Segoe UI', Arial, sans-serif",
          }}
        >
          <Container
            className="mx-auto w-full max-w-150"
            style={{
              backgroundColor: EMAIL_STYLES.card,
              border: `1px solid ${EMAIL_STYLES.border}`,
              borderRadius: EMAIL_STYLES.radius,
            }}
          >
            <Section className="p-12">
              <Section className="mb-12">
                <Heading
                  className="m-0 tracking-tight"
                  style={{
                    fontFamily: "Montserrat, 'Segoe UI', Arial, sans-serif",
                    color: EMAIL_STYLES.foreground,
                    fontSize: "28px",
                    fontWeight: 700,
                    lineHeight: "1.2",
                  }}
                >
                  BNG Store
                </Heading>
              </Section>

              <Section>
                <Section
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ marginBottom: "18px" }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "9999px",
                      backgroundColor: EMAIL_STYLES.primarySoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconMailCheck stroke={2} />
                  </div>
                </Section>

                <Heading
                  as="h2"
                  className="m-0"
                  style={{
                    color: EMAIL_STYLES.foreground,
                    fontFamily: "Outfit, 'Segoe UI', Arial, sans-serif",
                    fontSize: "24px",
                    fontWeight: 600,
                    lineHeight: "1.3",
                    marginBottom: "12px",
                  }}
                >
                  Verify Your Email Address
                </Heading>

                <Text
                  className="m-0"
                  style={{
                    color: EMAIL_STYLES.foreground,
                    fontSize: "15px",
                    lineHeight: "1.6",
                    fontWeight: 300,
                    marginBottom: "20px",
                  }}
                >
                  Thank you for signing up for BNG Store. To complete your
                  registration and start using your account, please verify your
                  email address.
                </Text>

                <Section style={{ marginBottom: "20px" }}>
                  <Button
                    href={verificationUrl}
                    style={{
                      backgroundColor: EMAIL_STYLES.primary,
                      color: EMAIL_STYLES.primaryForeground,
                      borderRadius: EMAIL_STYLES.radius,
                      fontSize: "14px",
                      fontWeight: 500,
                      textDecoration: "none",
                      padding: "12px 16px",
                    }}
                  >
                    Verify Email Address
                  </Button>
                </Section>

                <EmailSeparator
                  color={EMAIL_STYLES.border}
                  marginBottom={24}
                  marginTop={24}
                />

                <Section style={{ marginBottom: "18px" }}>
                  <Text
                    className="m-0"
                    style={{
                      color: EMAIL_STYLES.mutedForeground,
                      fontSize: "13px",
                      lineHeight: "1.6",
                      fontWeight: 400,
                    }}
                  >
                    This verification link will expire in 24 hours. If you
                    didn&apos;t create an account with BNG Store, you can safely
                    ignore this email.
                  </Text>
                </Section>

                <Section
                  className="p-5"
                  style={{
                    backgroundColor: EMAIL_STYLES.muted,
                    borderRadius: EMAIL_STYLES.radius,
                  }}
                >
                  <Text
                    className="m-0"
                    style={{
                      color: EMAIL_STYLES.mutedForeground,
                      fontSize: "13px",
                      lineHeight: "1.6",
                      fontWeight: 300,
                    }}
                  >
                    If the button above doesn&apos;t work, copy and paste this
                    link into your browser:
                  </Text>
                  <Link
                    href={verificationUrl}
                    className="mt-2 block break-all"
                    style={{
                      color: EMAIL_STYLES.primary,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                      fontSize: "12px",
                      fontWeight: 400,
                      textDecoration: "none",
                    }}
                  >
                    {verificationUrl}
                  </Link>
                </Section>
              </Section>

              <EmailSeparator
                color={EMAIL_STYLES.border}
                marginTop={24}
                marginBottom={20}
              />

              <Section>
                <Text
                  className="m-0"
                  style={{
                    color: EMAIL_STYLES.mutedForeground,
                    fontSize: "13px",
                    fontWeight: 300,
                  }}
                >
                  © {new Date().getFullYear()} BNG Store. All rights reserved.
                </Text>
                <Text
                  className="mb-0"
                  style={{
                    color: EMAIL_STYLES.mutedForeground,
                    fontSize: "13px",
                    fontWeight: 300,
                    marginTop: "10px",
                  }}
                >
                  This email was sent to {email} because you have an account
                  with BNG Store.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
