import type { ReactNode } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PrintButton from "@/components/PrintButton";
import {
  CAPABILITY_IMAGES,
  COMPANY_ADDRESS,
  COMPANY_DATA,
  COMPANY_WEBSITE,
  CORE_COMPETENCIES,
  DIFFERENTIATORS,
  OVERVIEW,
  PAST_PERFORMANCE,
  PRIMARY_CONTACT,
  VENUE_SPECS,
} from "@/lib/capabilityStatement";

const labelClass = "eyebrow";
const rowClass =
  "flex flex-col gap-1 border-b border-[var(--line)] py-3 sm:flex-row sm:gap-6 print:gap-3 print:py-1";

function Bullet() {
  return <span className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-gold" aria-hidden="true" />;
}

function DataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={rowClass}>
      <dt className="w-40 shrink-0 text-[0.7rem] uppercase tracking-[0.2em] text-white/50 print:w-24 print:text-[0.55rem] print:tracking-[0.12em]">
        {label}
      </dt>
      <dd className="text-[0.95rem] text-white/85 print:text-[0.7rem]">{children}</dd>
    </div>
  );
}

function companyDataRows() {
  const rows: { label: string; value: ReactNode }[] = [];
  const add = (label: string, value: ReactNode, show: boolean) => {
    if (show) rows.push({ label, value });
  };

  add("Legal name", COMPANY_DATA.legalName, Boolean(COMPANY_DATA.legalName));
  add("Doing business as", COMPANY_DATA.dba, Boolean(COMPANY_DATA.dba));
  add("UEI", COMPANY_DATA.uei, Boolean(COMPANY_DATA.uei));
  add("CAGE code", COMPANY_DATA.cageCode, Boolean(COMPANY_DATA.cageCode));
  add(
    "NAICS codes",
    <ul className="flex flex-col gap-1">
      {COMPANY_DATA.naicsCodes.map((naics) => (
        <li key={naics.code}>
          <span className="tabular-nums text-[var(--ivory)]">{naics.code}</span>
          <span className="text-white/60"> · {naics.title}</span>
        </li>
      ))}
    </ul>,
    COMPANY_DATA.naicsCodes.length > 0
  );
  add("PSC codes", COMPANY_DATA.pscCodes.join(", "), COMPANY_DATA.pscCodes.length > 0);
  add("Certifications", COMPANY_DATA.certifications.join(" · "), COMPANY_DATA.certifications.length > 0);
  add("Ownership", COMPANY_DATA.socioeconomic.join(" · "), COMPANY_DATA.socioeconomic.length > 0);
  add("Established", COMPANY_DATA.yearEstablished, Boolean(COMPANY_DATA.yearEstablished));
  add("Payment accepted", COMPANY_DATA.paymentMethods.join(" · "), COMPANY_DATA.paymentMethods.length > 0);
  add("Address", COMPANY_ADDRESS, true);
  add("Website", COMPANY_WEBSITE, true);

  return rows;
}

function missingRegistrationFields() {
  const missing: string[] = [];
  if (!COMPANY_DATA.legalName) missing.push("legal name");
  if (!COMPANY_DATA.uei) missing.push("UEI");
  if (!COMPANY_DATA.cageCode) missing.push("CAGE code");
  if (COMPANY_DATA.naicsCodes.length === 0) missing.push("NAICS codes");
  if (PAST_PERFORMANCE.length === 0) missing.push("past performance");
  return missing;
}

export default function CapabilityStatementPage() {
  const missing = process.env.NODE_ENV === "development" ? missingRegistrationFields() : [];

  return (
    <section className="capability-statement border-t border-[var(--line)] pb-24 pt-16 sm:pt-24 print:p-0">
      <div className="mx-auto max-w-6xl px-6 print:max-w-none print:px-0">
        {missing.length > 0 ? (
          <p className="mb-10 border border-rose-200/40 px-5 py-4 text-sm text-rose-100/80 print:hidden">
            Not shown until filled in <code>src/lib/capabilityStatement.ts</code>: {missing.join(", ")}.
            This notice only appears in development.
          </p>
        ) : null}

        <header className="flex flex-col gap-8 border-b border-[var(--line)] pb-10 md:flex-row md:items-end md:justify-between print:pb-4">
          <div className="flex max-w-3xl flex-col gap-5 print:gap-2">
            <p className="eyebrow">Government &amp; Public Sector</p>
            <h1 className="display-xl print:text-4xl">Capability Statement</h1>
            <p className="font-serif text-2xl text-[var(--ivory)] print:text-xl">
              {COMPANY_DATA.legalName || COMPANY_DATA.dba}
              <span className="text-white/50"> · Veteran-Owned Event Venue</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row print:hidden">
            <PrintButton />
            <Button href={`mailto:${PRIMARY_CONTACT.email}?subject=Government%20event%20inquiry`} variant="ghost">
              Contact Us
            </Button>
          </div>
        </header>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3 print:mt-4 print:grid-cols-3 print:gap-3" aria-label="Loft 442 photos">
          {CAPABILITY_IMAGES.map((image, index) => (
            <li key={image.src} className="flex flex-col gap-3 print:gap-1">
              <div className="relative aspect-[4/3] overflow-hidden border border-[var(--line)] print:aspect-auto print:h-[0.9in]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1152px) 368px, (min-width: 640px) 31vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: image.objectPosition }}
                />
              </div>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/55 print:hidden">
                {image.caption}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-14 md:grid-cols-[1.35fr_1fr] md:gap-16 print:mt-4 print:grid-cols-[1.25fr_1fr] print:gap-6">
          <div className="flex flex-col gap-12 print:gap-4">
            <section aria-labelledby="cs-overview" className="flex flex-col gap-4">
              <h2 id="cs-overview" className={labelClass}>Company Overview</h2>
              <p className="lede print:!text-[0.75rem] print:!leading-snug">{OVERVIEW}</p>
            </section>

            <section aria-labelledby="cs-competencies" className="flex flex-col gap-5">
              <h2 id="cs-competencies" className={labelClass}>Core Competencies</h2>
              <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2 print:grid-cols-2">
                {CORE_COMPETENCIES.map((item) => (
                  <div key={item.title} className="flex flex-col gap-2 bg-[var(--background)] p-6 print:gap-1 print:p-2.5">
                    <h3 className="font-serif text-xl text-[var(--ivory)] print:text-base">{item.title}</h3>
                    <p className="text-[0.9rem] leading-relaxed text-white/65 print:text-[0.68rem] print:leading-snug">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="cs-differentiators" className="flex flex-col gap-5">
              <h2 id="cs-differentiators" className={labelClass}>Differentiators</h2>
              <ul className="flex flex-col gap-3 text-[0.95rem] text-white/80 print:gap-0.5 print:text-[0.7rem]">
                {DIFFERENTIATORS.map((item) => (
                  <li key={item} className="flex items-baseline gap-4">
                    <Bullet />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {PAST_PERFORMANCE.length > 0 ? (
              <section aria-labelledby="cs-past-performance" className="flex flex-col gap-5">
                <h2 id="cs-past-performance" className={labelClass}>Past Performance</h2>
                <ul className="flex flex-col border-t border-[var(--line)]">
                  {PAST_PERFORMANCE.map((item) => (
                    <li key={`${item.client}-${item.period ?? ""}`} className="flex flex-col gap-1 border-b border-[var(--line)] py-4 print:py-2">
                      <p className="font-serif text-lg text-[var(--ivory)] print:text-sm">
                        {item.client}
                        {item.period ? <span className="text-white/50"> · {item.period}</span> : null}
                      </p>
                      <p className="text-[0.9rem] text-white/65 print:text-xs">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="flex flex-col gap-12 print:gap-4">
            <section aria-labelledby="cs-company-data" className="flex flex-col gap-3">
              <h2 id="cs-company-data" className={labelClass}>Company Data</h2>
              <dl className="border-t border-[var(--line)] print:text-xs">
                {companyDataRows().map((row) => (
                  <DataRow key={row.label} label={row.label}>
                    {row.value}
                  </DataRow>
                ))}
              </dl>
            </section>

            <section aria-labelledby="cs-venue" className="flex flex-col gap-3">
              <h2 id="cs-venue" className={labelClass}>Facility</h2>
              <dl className="border-t border-[var(--line)] print:text-xs">
                {VENUE_SPECS.map((spec) => (
                  <DataRow key={spec.label} label={spec.label}>
                    {spec.value}
                  </DataRow>
                ))}
              </dl>
            </section>

            <section aria-labelledby="cs-contact" className="flex flex-col gap-4 border border-[var(--line)] p-6 print:p-3">
              <h2 id="cs-contact" className={labelClass}>Point of Contact</h2>
              <p className="font-serif text-2xl text-[var(--ivory)] print:text-base">
                {PRIMARY_CONTACT.name}
                {PRIMARY_CONTACT.title ? (
                  <span className="text-white/50">, {PRIMARY_CONTACT.title}</span>
                ) : null}
              </p>
              <div className="flex flex-col gap-1 text-[0.95rem] print:text-xs">
                <a href={`tel:${PRIMARY_CONTACT.tel}`} className="tap text-white/80 hover:text-gold-light">
                  {PRIMARY_CONTACT.phone}
                </a>
                <a href={`mailto:${PRIMARY_CONTACT.email}`} className="tap text-gold-light hover:text-gold">
                  {PRIMARY_CONTACT.email}
                </a>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
