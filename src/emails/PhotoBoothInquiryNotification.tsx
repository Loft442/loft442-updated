import * as React from "react";
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Row, Column } from "@react-email/components";
import { Icon, styles } from "@/emails/EventRequestNotification";

type Props = {
  name: string;
  email: string;
  phone: string;
  packageName: string;
  eventType: string;
  dateLabel: string;
  venue: string;
  messageText: string;
};

function Field({ icon, label, value, half }: { icon: string; label: string; value: string; half?: "left" | "right" }) {
  const padding = half === "left" ? { paddingRight: 6 } : half === "right" ? { paddingLeft: 6 } : {};
  return (
    <Column style={{ width: half ? "50%" : "100%", ...padding }}>
      <Section style={styles.fieldCard}>
        <Text style={styles.label}>
          <Icon>{icon}</Icon>
          {label}
        </Text>
        <Text style={styles.value}>{value}</Text>
      </Section>
    </Column>
  );
}

export default function PhotoBoothInquiryNotification({
  name,
  email,
  phone,
  packageName,
  eventType,
  dateLabel,
  venue,
  messageText,
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.outer}>
          <Section style={styles.header}>
            <Text style={styles.brand}>LOFT 442 · PHOTO BOOTH</Text>
            <Heading style={styles.title}>New Photo Booth Inquiry</Heading>
            <Text style={styles.subtitle}>
              Someone asked about renting the Salsa 2 photo booth through the website. Details are below.
            </Text>
          </Section>

          <Section style={styles.card}>
            <Section style={styles.cardTopBar}>
              <Text style={styles.cardTopBarText}>📸 Photo Booth Lead • Website Form</Text>
            </Section>

            <Section style={styles.section}>
              <Text style={styles.sectionHeading}>Inquiry Details</Text>

              <Row style={styles.gridRow}>
                <Field icon="👤" label="NAME" value={name} half="left" />
                <Field icon="📸" label="PACKAGE" value={packageName} half="right" />
              </Row>
              <Row style={styles.gridRow}>
                <Field icon="🎉" label="EVENT TYPE" value={eventType} half="left" />
                <Field icon="📅" label="DATE" value={dateLabel} half="right" />
              </Row>
              <Row style={styles.gridRow}>
                <Field icon="📍" label="VENUE OR CITY" value={venue} />
              </Row>
              <Row style={styles.gridRow}>
                <Field icon="✉️" label="EMAIL" value={email} half="left" />
                <Field icon="📞" label="PHONE" value={phone} half="right" />
              </Row>

              <Hr style={styles.divider} />

              <Text style={styles.sectionHeading}>About the Event</Text>
              <Section style={styles.messageBox}>
                <Text style={styles.messageText}>{messageText}</Text>
              </Section>

              <Hr style={styles.divider} />

              <Text style={{ ...styles.subtitle, margin: 0 }}>
                Tip: Reply directly to this email to respond to the client (Reply-To is set).
              </Text>
            </Section>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerLine}>Loft 442 • Photo Booth Lead Notification</Text>
            <Text style={styles.footerLine}>This message was generated automatically.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
