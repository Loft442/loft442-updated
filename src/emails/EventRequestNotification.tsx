import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Row,
  Column,
} from "@react-email/components";

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partyType: string;
  dateLabel: string;
  messageText: string;
};

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#0b0b0f", // deep charcoal
    margin: 0,
    padding: "24px 12px",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  outer: {
    maxWidth: 640,
    margin: "0 auto",
  },
  header: {
    padding: "10px 4px 16px",
    textAlign: "center",
  },
  brand: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#c6a75e",
    margin: 0,
    fontWeight: 700,
  },
  title: {
    fontSize: 22,
    color: "#ffffff",
    margin: "10px 0 0",
    fontWeight: 800,
    lineHeight: "28px",
  },
  subtitle: {
    fontSize: 13,
    color: "#b7b7c2",
    margin: "10px 0 0",
    lineHeight: "18px",
  },
  card: {
    backgroundColor: "#11111a",
    borderRadius: 14,
    border: "1px solid rgba(198, 167, 94, 0.22)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
    overflow: "hidden",
  },
  cardTopBar: {
    background:
      "linear-gradient(90deg, rgba(198,167,94,0.35), rgba(198,167,94,0.05))",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  cardTopBarText: {
    color: "#f2e7cf",
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  section: {
    padding: "16px",
  },
  sectionHeading: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    margin: "0 0 10px",
    letterSpacing: 0.2,
  },
  gridRow: {
    margin: "0 0 10px",
  },
  fieldCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "12px 12px",
  },
  label: {
    color: "#cfcfda",
    fontSize: 12,
    fontWeight: 800, // stronger title contrast
    margin: 0,
    letterSpacing: 0.2,
  },
  value: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 500,
    margin: "6px 0 0",
    lineHeight: "18px",
  },
  valueMuted: {
    color: "#d9d9e3",
    fontSize: 14,
    fontWeight: 500,
    margin: "6px 0 0",
    lineHeight: "18px",
  },
  messageBox: {
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "12px",
  },
  messageText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 500,
    margin: 0,
    lineHeight: "20px",
    whiteSpace: "pre-wrap",
  },
  divider: {
    borderColor: "rgba(255,255,255,0.08)",
    margin: "14px 0",
  },
  footer: {
    textAlign: "center",
    padding: "14px 8px 0",
    color: "#8f8fa1",
    fontSize: 12,
    lineHeight: "18px",
  },
  footerLine: {
    color: "#8f8fa1",
    margin: 0,
  },
};

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span style={{ marginRight: 8 }}>{children}</span>
);

export default function EventRequestNotification({
  firstName,
  lastName,
  email,
  phone,
  partyType,
  dateLabel,
  messageText,
}: Props) {
  const safeMessage = messageText?.trim() ? messageText.trim() : "None";

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.outer}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.brand}>LOFT 442</Text>
            <Heading style={styles.title}>New Event Request</Heading>
            <Text style={styles.subtitle}>
              A new inquiry was submitted through the website. Details are below.
            </Text>
          </Section>

          {/* Card */}
          <Section style={styles.card}>
            <Section style={styles.cardTopBar}>
              <Text style={styles.cardTopBarText}>
                ✨ Lead Notification • Website Form
              </Text>
            </Section>

            <Section style={styles.section}>
              <Text style={styles.sectionHeading}>Event Details</Text>

              {/* Row 1 */}
              <Row style={styles.gridRow}>
                <Column style={{ width: "50%", paddingRight: 6 }}>
                  <Section style={styles.fieldCard}>
                    <Text style={styles.label}>
                      <Icon>👤</Icon>NAME
                    </Text>
                    <Text style={styles.value}>
                      {firstName} {lastName}
                    </Text>
                  </Section>
                </Column>
                <Column style={{ width: "50%", paddingLeft: 6 }}>
                  <Section style={styles.fieldCard}>
                    <Text style={styles.label}>
                      <Icon>🎉</Icon>EVENT TYPE
                    </Text>
                    <Text style={styles.value}>{partyType}</Text>
                  </Section>
                </Column>
              </Row>

              {/* Row 2 */}
              <Row style={styles.gridRow}>
                <Column style={{ width: "50%", paddingRight: 6 }}>
                  <Section style={styles.fieldCard}>
                    <Text style={styles.label}>
                      <Icon>📅</Icon>DATE
                    </Text>
                    <Text style={styles.value}>{dateLabel}</Text>
                  </Section>
                </Column>
                <Column style={{ width: "50%", paddingLeft: 6 }}>
                  <Section style={styles.fieldCard}>
                    <Text style={styles.label}>
                      <Icon>📞</Icon>PHONE
                    </Text>
                    <Text style={styles.valueMuted}>{phone || "—"}</Text>
                  </Section>
                </Column>
              </Row>

              {/* Row 3 (full width) */}
              <Row style={styles.gridRow}>
                <Column style={{ width: "100%" }}>
                  <Section style={styles.fieldCard}>
                    <Text style={styles.label}>
                      <Icon>✉️</Icon>EMAIL
                    </Text>
                    <Text style={styles.valueMuted}>{email}</Text>
                  </Section>
                </Column>
              </Row>

              <Hr style={styles.divider} />

              <Text style={styles.sectionHeading}>Message</Text>
              <Section style={styles.messageBox}>
                <Text style={styles.messageText}>{safeMessage}</Text>
              </Section>

              <Hr style={styles.divider} />

              <Text style={{ ...styles.subtitle, margin: 0 }}>
                Tip: Reply directly to this email to respond to the client (Reply-To is set).
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerLine}>Loft 442 • Lead Notification</Text>
            <Text style={styles.footerLine}>This message was generated automatically.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
