"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import posthog from "posthog-js";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { TEAM_CONTACTS, TEAM_EMAIL } from "@/lib/contacts";
import Footer from "@/components/Footer";
import PartyTypeSelect from "@/components/ui/PartyTypeSelect";
import { trackSendRequestConversion } from "@/lib/googleAds";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Baby Shower stays its own option here even though the home page groups it under
// Milestone Celebrations: it is a common inquiry and helps the team prepare.
const partyTypes = [
  "Wedding & Anniversary",
  "Corporate & Private Event",
  "Milestone Celebration",
  "Baby Shower",
  "Repass & Celebration of Life",
];

type FieldName =
  | "firstName"
  | "lastName"
  | "partyType"
  | "phone"
  | "email"
  | "hearAboutUs"
  | "message";

const requiredFields: FieldName[] = [
  "firstName",
  "lastName",
  "partyType",
  "phone",
  "email",
  "hearAboutUs",
];

const FIELD_MAX_LENGTH: Record<FieldName, number> = {
  firstName: 50,
  lastName: 50,
  partyType: 60,
  phone: 20,
  email: 254,
  hearAboutUs: 60,
  message: 1000,
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const formatSelectedDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function SchedulePage() {
  const today = useMemo(() => new Date(), []);
  const [monthAnchor, setMonthAnchor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthLabel = useMemo(() => {
    return monthAnchor.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [monthAnchor]);

  const days = useMemo(() => {
    const start = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), 1);
    const end = new Date(
      monthAnchor.getFullYear(),
      monthAnchor.getMonth() + 1,
      0
    );
    const startDay = start.getDay();
    const totalDays = end.getDate();
    const slots = Array.from({ length: startDay + totalDays }, (_, index) => {
      if (index < startDay) {
        return null;
      }
      const day = index - startDay + 1;
      return new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), day);
    });

    return slots;
  }, [monthAnchor]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    partyType: "",
    phone: "",
    email: "",
    hearAboutUs: "",
    message: "",
  });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    firstName: false,
    lastName: false,
    partyType: false,
    phone: false,
    email: false,
    hearAboutUs: false,
    message: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [reviewedPricing, setReviewedPricing] = useState(false);

  const errors = useMemo(() => {
    const emailValue = form.email.trim();
    const phoneDigits = form.phone.replace(/\D/g, "");

    const emailError = !emailValue
      ? "Required"
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
        ? ""
        : "Enter a valid email";

    const phoneError = !form.phone.trim()
      ? "Required"
      : phoneDigits.length >= 10
        ? ""
        : "Enter a valid phone";

    return {
      firstName: form.firstName.trim() ? "" : "Required",
      lastName: form.lastName.trim() ? "" : "Required",
      partyType: form.partyType ? "" : "Required",
      phone: phoneError,
      email: emailError,
      hearAboutUs: form.hearAboutUs.trim() ? "" : "Required",
      message: "",
    };
  }, [form]);

  const isFormValid =
    Boolean(selectedDate) &&
    reviewedPricing &&
    requiredFields.every((field) => !errors[field]);
  const pricingError = submitAttempted && !reviewedPricing ? "Required" : "";

  const baseInputClass =
    "w-full border-0 border-b border-[var(--line-strong)] bg-transparent px-0 py-3 text-[0.95rem] normal-case tracking-normal text-[var(--ivory)] outline-none transition duration-300 placeholder:text-white/35 focus:border-gold";
  const sectionAccentLabelClass = "eyebrow";
  const formLabelClass =
    "flex flex-col gap-1 text-[0.7rem] uppercase tracking-[0.3em] text-white/60";
  const errorInputClass = "border-rose-200/60 focus:border-rose-200/80";
  const errorTextClass =
    "min-h-[0.75rem] text-[0.7rem] uppercase tracking-[0.2em] text-rose-200/70 transition";

  const updateField = (field: FieldName, value: string) => {
    const nextValue =
      field === "phone" ? value.replace(/[^0-9()-]/g, "") : value;
    setForm((prev) => ({
      ...prev,
      [field]: nextValue.slice(0, FIELD_MAX_LENGTH[field]),
    }));
  };

  const markTouched = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const fieldError = (field: FieldName) =>
    (touched[field] || submitAttempted) && errors[field] ? errors[field] : "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setSubmitError("");
    setSuccessMessage("");

    if (!isFormValid || !selectedDate) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: toYMD(selectedDate),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          partyType: form.partyType,
          phone: form.phone.trim(),
          email: form.email.trim(),
          hearAboutUs: form.hearAboutUs.trim(),
          message: form.message.trim(),
          reviewedPricing,
          website: honeypot,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error("Request failed");
      }

      trackSendRequestConversion();
      posthog.capture("event_request_submitted", {
        party_type: form.partyType,
      });

      setForm({
        firstName: "",
        lastName: "",
        partyType: "",
        phone: "",
        email: "",
        hearAboutUs: "",
        message: "",
      });
      setTouched({
        firstName: false,
        lastName: false,
        partyType: false,
        phone: false,
        email: false,
        hearAboutUs: false,
        message: false,
      });
      setReviewedPricing(false);
      setSubmitAttempted(false);
      setSuccessMessage("Thank you. Your inquiry has been received and our team will be in touch.");
    } catch {
      setSubmitError("We could not send your inquiry. Please try again, or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="scheduling-page bg-[var(--background)] pt-nav text-white">
      <section className="relative border-t border-[var(--line)] pb-24 pt-16 sm:pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal mode="text" className="flex max-w-3xl flex-col gap-6">
            <p className="eyebrow">Loft 442</p>
            <h1 className="display-xl">Request a Tour</h1>
            <span className="hairline" aria-hidden="true" />
            <p className="lede">
              Share a few details and a member of our team will personally follow up to confirm
              availability.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-px bg-[var(--line)] lg:grid-cols-[1.35fr_1fr]">
            <Reveal
              mode="text"
              className="bg-[var(--background)] px-2 py-6 sm:p-10"
            >
              <div className="flex flex-wrap items-end justify-between gap-3 border-b px-2 sm:px-0 border-[var(--line)] pb-6">
                <div>
                  <p className={sectionAccentLabelClass}>Preferred Date</p>
                  <p className="mt-3 font-serif text-xl text-[var(--ivory)]">
                    Choose a date; we will confirm availability
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                      setMonthAnchor(
                        new Date(
                          monthAnchor.getFullYear(),
                          monthAnchor.getMonth() - 1,
                          1
                        )
                      )
                    }
                    className="flex h-12 w-12 items-center justify-center border border-[var(--line)] text-white/70 transition duration-300 hover:border-gold/60 hover:text-gold-light"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                      setMonthAnchor(
                        new Date(
                          monthAnchor.getFullYear(),
                          monthAnchor.getMonth() + 1,
                          1
                        )
                      )
                    }
                    className="flex h-12 w-12 items-center justify-center border border-[var(--line)] text-white/70 transition duration-300 hover:border-gold/60 hover:text-gold-light"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="mt-6 p-0 sm:p-2">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-serif text-lg text-[var(--ivory)]">
                    {monthLabel}
                  </p>
                  {selectedDate ? (
                    <span className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
                      {formatSelectedDate(selectedDate)}
                    </span>
                  ) : null}
                </div>
                <div className="grid w-full grid-cols-7 gap-0.5 text-[0.7rem] uppercase tracking-[0.15em] text-white/55 sm:gap-3 sm:text-[0.7rem]">
                  {weekdays.map((day) => (
                    <div key={day} className="text-center">
                      {day}
                    </div>
                  ))}
                </div>
                <div
                  role="grid"
                  aria-label="Choose a date to plan your event"
                  className="mt-4 grid w-full grid-cols-7 gap-0.5 sm:gap-3"
                >
                  {days.map((date, index) => {
                    if (!date) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square w-full"
                        />
                      );
                    }

                    const dateKey = toYMD(date);
                    const isPast =
                      date <
                      new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                      );
                    const disabled = isPast;
                    const isSelected =
                      !disabled &&
                      !!selectedDate &&
                      isSameDay(selectedDate, date);
                    const isToday = isSameDay(today, date);
                    const stateClass = disabled
                      ? "border-transparent text-white/25 cursor-not-allowed"
                      : isSelected
                        ? "border-gold bg-gold text-[var(--ink)]"
                        : "border-[var(--line)] text-white/75 md:hover:border-gold/60 md:hover:text-gold-light";

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        role="gridcell"
                        aria-disabled={disabled}
                        aria-selected={isSelected}
                        disabled={disabled}
                        onClick={
                          disabled ? undefined : () => setSelectedDate(date)
                        }
                        className={`flex aspect-square w-full min-w-0 flex-col items-center justify-center gap-0.5 border text-[0.7rem] leading-none transition duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 sm:text-base ${stateClass} ${
                          !disabled && isToday
                            ? "border-white/20 text-white"
                            : ""
                        }`}
                      >
                        <span className="leading-none">{date.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal
              mode="text"
              className="bg-[var(--background)] p-6 sm:p-10"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <label className="sr-only" aria-hidden="true">
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </label>
                <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-6">
                  <p className={sectionAccentLabelClass}>Your Date</p>
                  <p className="font-serif text-xl text-[var(--ivory)]">
                    {selectedDate ? formatSelectedDate(selectedDate) : "No date selected"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className={formLabelClass}>
                    First Name
                    <input
                      type="text"
                      maxLength={FIELD_MAX_LENGTH.firstName}
                      value={form.firstName}
                      onChange={(event) =>
                        updateField("firstName", event.target.value)
                      }
                      onBlur={() => markTouched("firstName")}
                      aria-invalid={Boolean(fieldError("firstName"))}
                      aria-describedby="firstName-error"
                      className={`${baseInputClass} ${
                        fieldError("firstName") ? errorInputClass : ""
                      }`}
                    />
                    <span
                      id="firstName-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${
                        fieldError("firstName") ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {fieldError("firstName")}
                    </span>
                  </label>

                  <label className={formLabelClass}>
                    Last Name
                    <input
                      type="text"
                      maxLength={FIELD_MAX_LENGTH.lastName}
                      value={form.lastName}
                      onChange={(event) =>
                        updateField("lastName", event.target.value)
                      }
                      onBlur={() => markTouched("lastName")}
                      aria-invalid={Boolean(fieldError("lastName"))}
                      aria-describedby="lastName-error"
                      className={`${baseInputClass} ${
                        fieldError("lastName") ? errorInputClass : ""
                      }`}
                    />
                    <span
                      id="lastName-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${
                        fieldError("lastName") ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {fieldError("lastName")}
                    </span>
                  </label>
                </div>

                <PartyTypeSelect
                  label="Type of Event"
                  name="partyType"
                  value={form.partyType}
                  onChange={(nextValue) => updateField("partyType", nextValue)}
                  onBlur={() => markTouched("partyType")}
                  options={partyTypes}
                  placeholder="Select type"
                  error={fieldError("partyType")}
                  errorId="partyType-error"
                  reserveErrorSpace
                />

                <label className={formLabelClass}>
                  How Did You Hear About Us
                  <input
                    type="text"
                    maxLength={FIELD_MAX_LENGTH.hearAboutUs}
                    placeholder="Instagram, Google, friend, etc."
                    value={form.hearAboutUs}
                    onChange={(event) =>
                      updateField("hearAboutUs", event.target.value)
                    }
                    onBlur={() => markTouched("hearAboutUs")}
                    aria-invalid={Boolean(fieldError("hearAboutUs"))}
                    aria-describedby="hearAboutUs-error"
                    className={`${baseInputClass} ${
                      fieldError("hearAboutUs") ? errorInputClass : ""
                    }`}
                  />
                  <span
                    id="hearAboutUs-error"
                    aria-live="polite"
                    className={`${errorTextClass} ${
                      fieldError("hearAboutUs") ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {fieldError("hearAboutUs")}
                  </span>
                </label>

                <div className="flex flex-col gap-4">
                  <label className={formLabelClass}>
                    Phone
                    <input
                      type="tel"
                      maxLength={FIELD_MAX_LENGTH.phone}
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      onBlur={() => markTouched("phone")}
                      aria-invalid={Boolean(fieldError("phone"))}
                      aria-describedby="phone-error"
                      className={`${baseInputClass} ${
                        fieldError("phone") ? errorInputClass : ""
                      }`}
                    />
                    <span
                      id="phone-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${
                        fieldError("phone") ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {fieldError("phone")}
                    </span>
                  </label>

                  <label className={formLabelClass}>
                    Email
                    <input
                      type="email"
                      maxLength={FIELD_MAX_LENGTH.email}
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      onBlur={() => markTouched("email")}
                      aria-invalid={Boolean(fieldError("email"))}
                      aria-describedby="email-error"
                      className={`${baseInputClass} ${
                        fieldError("email") ? errorInputClass : ""
                      }`}
                    />
                    <span
                      id="email-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${
                        fieldError("email") ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {fieldError("email")}
                    </span>
                  </label>
                </div>

                <label className={formLabelClass}>
                  Message (optional)
                  <textarea
                    rows={4}
                    maxLength={FIELD_MAX_LENGTH.message}
                    placeholder="Your guest count, preferred time, and anything you would like us to know."
                    value={form.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    onBlur={() => markTouched("message")}
                    className={`${baseInputClass} min-h-45 placeholder:text-xs sm:min-h-30`}
                  />
                  <span className={`${errorTextClass} opacity-0`} />
                </label>

                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-start gap-3 text-[0.9rem] leading-relaxed text-white/80">
                    <input
                      type="checkbox"
                      required
                      checked={reviewedPricing}
                      onChange={(event) => setReviewedPricing(event.target.checked)}
                      aria-invalid={Boolean(pricingError)}
                      aria-describedby="reviewedPricing-error"
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--gold)]"
                    />
                    <span>
                      I&rsquo;ve reviewed the{" "}
                      <Link
                        href="/pricing"
                        target="_blank"
                        className="text-gold-light underline underline-offset-4 hover:text-gold"
                      >
                        package pricing
                      </Link>
                      .
                    </span>
                  </label>
                  <span
                    id="reviewedPricing-error"
                    aria-live="polite"
                    className={`${errorTextClass} ${pricingError ? "opacity-100" : "opacity-0"}`}
                  >
                    {pricingError}
                  </span>
                </div>

                <div className="mt-2 flex justify-center lg:justify-end">
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={buttonClasses("primary")}
                  >
                    {isSubmitting ? "Sending…" : "Submit Inquiry"}
                  </button>
                </div>

                {successMessage ? (
                  <div
                    className="border border-gold/40 px-5 py-4 text-sm leading-relaxed text-gold-light"
                    aria-live="polite"
                  >
                    {successMessage}
                  </div>
                ) : null}

                {submitError ? (
                  <div className="border border-rose-200/40 px-5 py-4 text-sm leading-relaxed text-rose-100/80">
                    {submitError}
                  </div>
                ) : null}
              </form>
            </Reveal>
          </div>

          {/* One combined, centred contact block under the form. */}
          <Reveal mode="text" className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="eyebrow">Prefer to Talk?</p>
            <p className="font-serif text-2xl text-[var(--ivory)] sm:text-3xl">Speak with our team directly</p>
            <span className="hairline" aria-hidden="true" />
            <ul className="mt-2 flex flex-col gap-1">
              {TEAM_CONTACTS.map((contact) => (
                <li key={contact.tel} className="flex items-baseline justify-center gap-x-5">
                  <span className="w-20 text-right font-serif text-xl text-[var(--ivory)]">{contact.name}</span>
                  <a
                    href={`tel:${contact.tel}`}
                    className="tap w-32 whitespace-nowrap text-left text-sm text-white/65 transition-colors hover:text-gold-light"
                  >
                    {contact.display}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${TEAM_EMAIL}`}
              className="tap text-sm text-gold-light transition-colors hover:text-gold"
            >
              {TEAM_EMAIL}
            </a>
          </Reveal>
        </div>
      </section>
      <Footer />
    </main>
  );
}
