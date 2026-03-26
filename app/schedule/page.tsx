"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import PartyTypeSelect from "@/components/ui/PartyTypeSelect";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const partyTypes = [
  "Wedding/Anniversary",
  "Corporate Event",
  "Birthday/Celebration",
  "Kids Events",
  "Private Event",
  "Baby Shower",
];

type FieldName =
  | "firstName"
  | "lastName"
  | "partyType"
  | "phone"
  | "email"
  | "message";

const requiredFields: FieldName[] = [
  "firstName",
  "lastName",
  "partyType",
  "phone",
  "email",
];

const FIELD_MAX_LENGTH: Record<FieldName, number> = {
  firstName: 50,
  lastName: 50,
  partyType: 60,
  phone: 20,
  email: 254,
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
    message: "",
  });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    firstName: false,
    lastName: false,
    partyType: false,
    phone: false,
    email: false,
    message: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [honeypot, setHoneypot] = useState("");

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
      message: "",
    };
  }, [form]);

  const isFormValid =
    Boolean(selectedDate) && requiredFields.every((field) => !errors[field]);

  const baseInputClass =
    "w-full rounded-sm border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-white focus:border-[#d9be62]/70 focus:bg-black";
  const sectionAccentLabelClass =
    "text-xs font-medium uppercase tracking-[0.35em] text-[#d9be62] sm:text-sm";
  const errorInputClass = "border-rose-200/60 focus:border-rose-200/80";
  const errorTextClass =
    "min-h-[0.75rem] text-[0.6rem] uppercase tracking-[0.2em] text-rose-200/70 transition";

  const updateField = (field: FieldName, value: string) => {
    const nextValue =
      field === "phone"
        ? value.replace(/[^0-9()-]/g, "")
        : value;
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
          message: form.message.trim(),
          website: honeypot,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error("Request failed");
      }

      setForm({
        firstName: "",
        lastName: "",
        partyType: "",
        phone: "",
        email: "",
        message: "",
      });
      setTouched({
        firstName: false,
        lastName: false,
        partyType: false,
        phone: false,
        email: false,
        message: false,
      });
      setSubmitAttempted(false);
      setSuccessMessage("Request sent successfully.");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="ambient-surface scheduling-page bg-black pt-19 text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <div className="divider-glow h-0.5 w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <section className="section-glow section-divider relative border-t border-white/10 py-16 sm:py-20">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-xl"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal mode="text" className="spotlight rounded-sm px-4 py-3 flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white">Loft 442</p>
            <h1 className="text-spotlight relative inline-block text-3xl font-semibold tracking-[0.32em] text-white sm:text-4xl md:text-5xl">
              <span
                className="pointer-events-none absolute -inset-x-12 -inset-y-8 z-0 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(200,200,210,0.85) 0%, transparent 65%)",
                }}
                aria-hidden="true"
              />
              <span className="relative z-10">PLAN YOUR EVENT</span>
            </h1>
            <p className="max-w-2xl text-sm text-white/70">
              Select your preferred date and tell us about your event. Our team will follow up to confirm availability.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal
              mode="text"
              className="rounded-sm border border-white/10 bg-white/8 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8"
            >
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <p className={sectionAccentLabelClass}>
                    Select Preferred Date
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white">
                    Pick a date and we will confirm availability
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
                    className="rounded-sm border border-white/10 bg-black/40 p-2 text-white/70 transition duration-300 hover:border-[#d9be62]/60 hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9be62]/50"
                  >
                    <ChevronLeft className="h-4 w-4" />
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
                    className="rounded-sm border border-white/10 bg-black/40 p-2 text-white/70 transition duration-300 hover:border-[#d9be62]/60 hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9be62]/50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-sm border border-white/10 bg-black/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-base uppercase tracking-[0.35em] text-white sm:text-lg">
                    {monthLabel}
                  </p>
                  {selectedDate ? (
                    <span className="text-[0.62rem] uppercase tracking-[0.32em] text-[#d9be62]">
                      {formatSelectedDate(selectedDate)}
                    </span>
                  ) : null}
                </div>
                <div className="grid w-full grid-cols-7 gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/40 sm:gap-3 sm:text-[0.65rem]">
                  {weekdays.map((day) => (
                    <div key={day} className="text-center">
                      {day}
                    </div>
                  ))}
                </div>
                <div
                  role="grid"
                  aria-label="Choose a date to plan your event"
                  className="mt-4 grid w-full grid-cols-7 gap-2 sm:gap-3"
                >
                  {days.map((date, index) => {
                    if (!date) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square w-full sm:h-14 sm:w-14"
                        />
                      );
                    }

                    const dateKey = toYMD(date);
                    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const disabled = isPast;
                    const isSelected =
                      !disabled && !!selectedDate && isSameDay(selectedDate, date);
                    const isToday = isSameDay(today, date);
                    const stateClass = disabled
                      ? "border-white/10 bg-black/70 text-white/25 opacity-70 cursor-not-allowed"
                      : isSelected
                        ? "border-[#d9be62]/70 bg-[#d9be62]/12 text-white shadow-[0_0_18px_rgba(217,190,98,0.18)]"
                        : "border-white/10 bg-black/30 text-white/70 md:hover:border-[#d9be62]/50 md:hover:bg-white/6 md:hover:text-white";

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        role="gridcell"
                        aria-disabled={disabled}
                        aria-selected={isSelected}
                        disabled={disabled}
                        onClick={disabled ? undefined : () => setSelectedDate(date)}
                        className={`flex w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-sm border text-[0.7rem] uppercase tracking-[0.3em] leading-none transition duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9be62]/50 aspect-square sm:aspect-auto sm:h-14 sm:w-14 sm:text-sm ${stateClass} ${!disabled && isToday ? "border-white/20 text-white" : ""
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
              className="rounded-sm border border-white/10 bg-white/8 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8"
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
                <div className="flex flex-col gap-3 border-b border-white/10 pb-5">
                  <p className={sectionAccentLabelClass}>
                    Selected Date
                  </p>
                  <p className="text-sm uppercase tracking-[0.3em] text-white">
                    {selectedDate ? formatSelectedDate(selectedDate) : "None"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white">
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
                      className={`${baseInputClass} ${fieldError("firstName") ? errorInputClass : ""
                        }`}
                    />
                    <span
                      id="firstName-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${fieldError("firstName") ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      {fieldError("firstName")}
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white">
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
                      className={`${baseInputClass} ${fieldError("lastName") ? errorInputClass : ""
                        }`}
                    />
                    <span
                      id="lastName-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${fieldError("lastName") ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      {fieldError("lastName")}
                    </span>
                  </label>
                </div>

                <PartyTypeSelect
                  label="Type of Party"
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

                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white">
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
                      className={`${baseInputClass} ${fieldError("phone") ? errorInputClass : ""
                        }`}
                    />
                    <span
                      id="phone-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${fieldError("phone") ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      {fieldError("phone")}
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white">
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
                      className={`${baseInputClass} ${fieldError("email") ? errorInputClass : ""
                        }`}
                    />
                    <span
                      id="email-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${fieldError("email") ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      {fieldError("email")}
                    </span>
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white">
                  Message (optional)
                  <textarea
                    rows={4}
                    maxLength={FIELD_MAX_LENGTH.message}
                    placeholder="Tell us about your event, guest count, preferred time, special requests, or anything you'd like us to know."
                    value={form.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    onBlur={() => markTouched("message")}
                    className={`${baseInputClass} min-h-45 sm:min-h-30`}
                  />
                  <span className={`${errorTextClass} opacity-0`} />
                </label>

                <div className="mt-2 flex justify-center lg:justify-end">
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="inline-flex h-11 items-center justify-center rounded-sm border border-[#d4af37] px-5 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-[#f5e6a8] hover:bg-[#d4af37]/15 hover:text-white hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Send Request"}
                  </button>
                </div>

                {successMessage ? (
                  <div
                    className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-[0.6rem] uppercase tracking-[0.3em] text-emerald-100/80"
                    aria-live="polite"
                  >
                    {successMessage}
                  </div>
                ) : null}

                {submitError ? (
                  <div className="rounded-2xl border border-rose-200/40 bg-rose-500/10 px-4 py-3 text-[0.6rem] uppercase tracking-[0.3em] text-rose-100/80">
                    {submitError}
                  </div>
                ) : null}               
                </form>
            </Reveal>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

