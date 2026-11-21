"use client";

import { useEffect, useState, type FormEvent } from "react";
import posthog from "posthog-js";
import { buttonClasses } from "@/components/ui/Button";
import PartyTypeSelect from "@/components/ui/PartyTypeSelect";
import { BOOTH_EVENT_TYPES, BOOTH_FIELD_MAX_LENGTH, BOOTH_PACKAGES } from "@/lib/photoBooth";

const inputClass =
  "w-full border-0 border-b border-[var(--line-strong)] bg-transparent px-0 py-3 text-[0.95rem] normal-case tracking-normal text-[var(--ivory)] outline-none transition duration-300 placeholder:text-white/35 focus:border-gold";
const labelClass = "flex flex-col gap-1 text-[0.7rem] uppercase tracking-[0.3em] text-white/60";
const optional = <span className="normal-case tracking-normal text-white/35">(optional)</span>;
const PACKAGE_STORAGE_KEY = "loft442-photo-booth-package";

const emptyForm = { name: "", email: "", phone: "", eventType: "", date: "", venue: "", packageName: "", details: "" };

const isBoothPackage = (value: string): value is (typeof BOOTH_PACKAGES)[number] =>
  (BOOTH_PACKAGES as readonly string[]).includes(value);

const readStoredPackage = () => {
  try {
    const stored = sessionStorage.getItem(PACKAGE_STORAGE_KEY) ?? "";
    return isBoothPackage(stored) ? stored : "";
  } catch {
    return "";
  }
};

const storePackage = (packageName: string) => {
  try {
    if (isBoothPackage(packageName)) sessionStorage.setItem(PACKAGE_STORAGE_KEY, packageName);
    else sessionStorage.removeItem(PACKAGE_STORAGE_KEY);
  } catch {
    /* ignore private-mode / storage failures */
  }
};

export default function PhotoBoothInquiry() {
  const [form, setForm] = useState(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Restore a package chosen earlier on this page (Choose buttons / prior visit in-tab).
  useEffect(() => {
    const stored = readStoredPackage();
    if (stored) setForm((prev) => (prev.packageName ? prev : { ...prev, packageName: stored }));
  }, []);

  // Package buttons elsewhere on the page carry data-package; picking one pre-fills the form.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-package]");
      const packageName = trigger?.dataset.package?.trim() ?? "";
      if (!isBoothPackage(packageName)) return;
      storePackage(packageName);
      setForm((prev) => ({ ...prev, packageName }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const update = (field: keyof typeof form, value: string) => {
    if (field === "packageName") storePackage(value);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!isBoothPackage(form.packageName)) {
      setSubmitError("Please select a photo booth package before sending.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/photo-booth-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error("Request failed");

      posthog.capture("photo_booth_inquiry_submitted", {
        package: form.packageName,
        event_type: form.eventType || "unspecified",
      });
      storePackage("");
      setForm(emptyForm);
      setSuccessMessage("Thank you. Your photo booth inquiry has been received and our team will be in touch.");
    } catch {
      setSubmitError("We could not send your inquiry. Please try again, or call us at (347) 579-6578.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <label className="sr-only" aria-hidden="true">
        Website
        <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <label className={labelClass}>
          Your name
          <input required name="name" autoComplete="name" maxLength={BOOTH_FIELD_MAX_LENGTH.name} value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Email address
          <input required type="email" name="email" autoComplete="email" maxLength={BOOTH_FIELD_MAX_LENGTH.email} value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className={labelClass}>
          <span>Phone {optional}</span>
          <input type="tel" name="phone" autoComplete="tel" maxLength={BOOTH_FIELD_MAX_LENGTH.phone} value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/[^0-9()+\-\s]/g, ""))} className={inputClass} />
        </label>
        <label className={labelClass}>
          <span>Event date {optional}</span>
          <input type="date" name="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PartyTypeSelect
          label="Event type"
          name="eventType"
          value={form.eventType}
          onChange={(value) => update("eventType", value)}
          options={BOOTH_EVENT_TYPES}
          placeholder="Select event type"
        />
        <PartyTypeSelect
          label="Photo booth package"
          name="package"
          value={form.packageName}
          onChange={(value) => update("packageName", value)}
          options={BOOTH_PACKAGES}
          placeholder="Select a package"
          error={!form.packageName && submitError ? "Required" : undefined}
        />
      </div>

      <label className={labelClass}>
        <span>Venue or city {optional}</span>
        <input name="venue" maxLength={BOOTH_FIELD_MAX_LENGTH.venue} value={form.venue} onChange={(e) => update("venue", e.target.value)} className={inputClass} />
      </label>

      <label className={labelClass}>
        <span>Tell us about your event {optional}</span>
        <textarea rows={3} name="details" maxLength={BOOTH_FIELD_MAX_LENGTH.details} value={form.details} onChange={(e) => update("details", e.target.value)} className={inputClass} />
      </label>

      <div className="flex justify-center lg:justify-start">
        <button type="submit" disabled={isSubmitting} className={buttonClasses("primary")}>
          {isSubmitting ? "Sending…" : "Send Photo Booth Inquiry"}
        </button>
      </div>

      {successMessage ? (
        <div className="border border-gold/40 px-5 py-4 text-sm leading-relaxed text-gold-light" aria-live="polite">
          {successMessage}
        </div>
      ) : null}
      {submitError ? (
        <div className="border border-rose-200/40 px-5 py-4 text-sm leading-relaxed text-rose-100/80" aria-live="polite">
          {submitError}
        </div>
      ) : null}
    </form>
  );
}
