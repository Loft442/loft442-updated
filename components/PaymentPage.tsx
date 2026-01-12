"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import Reveal from "@/components/Reveal";

type FieldName =
  | "cardholderName"
  | "cardNumber"
  | "expirationDate"
  | "cvv"
  | "billingName"
  | "billingEmail"
  | "billingPhone"
  | "billingAddress";

const bookingSummary = {
  date: "Saturday, March 16, 2026",
  startTime: "5:00 PM",
  endTime: "11:00 PM",
  type: "Weddings",
  specialRequests: "",
};

const pricing = {
  base: "$2,800",
  service: "$150",
  taxes: "$220",
  total: "$3,170",
};

const requiredFields: FieldName[] = [
  "cardholderName",
  "cardNumber",
  "expirationDate",
  "cvv",
  "billingName",
  "billingEmail",
];

export default function PaymentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    billingAddress: "",
    agree: false,
  });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    cardholderName: false,
    cardNumber: false,
    expirationDate: false,
    cvv: false,
    billingName: false,
    billingEmail: false,
    billingPhone: false,
    billingAddress: false,
  });

  const errors = useMemo(() => {
    const cardDigits = form.cardNumber.replace(/\D/g, "");
    const cvvDigits = form.cvv.replace(/\D/g, "");
    const expValue = form.expirationDate.trim();
    const emailValue = form.billingEmail.trim();

    const cardNumberError = !cardDigits
      ? "Required"
      : cardDigits.length < 12 || cardDigits.length > 19
      ? "Enter a valid card number"
      : "";

    const expirationError = !expValue
      ? "Required"
      : /^(0[1-9]|1[0-2])\/\d{2}$/.test(expValue)
      ? ""
      : "Use MM/YY";

    const cvvError = !cvvDigits
      ? "Required"
      : cvvDigits.length < 3 || cvvDigits.length > 4
      ? "Enter a valid CVV"
      : "";

    const emailError = !emailValue
      ? "Required"
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
      ? ""
      : "Enter a valid email";

    return {
      cardholderName: form.cardholderName.trim() ? "" : "Required",
      cardNumber: cardNumberError,
      expirationDate: expirationError,
      cvv: cvvError,
      billingName: form.billingName.trim() ? "" : "Required",
      billingEmail: emailError,
      billingPhone: "",
      billingAddress: "",
    };
  }, [form]);

  const isFormValid =
    requiredFields.every((field) => !errors[field]) && form.agree;

  const updateField = (field: FieldName, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched((prev) => ({
      ...prev,
      cardholderName: true,
      cardNumber: true,
      expirationDate: true,
      cvv: true,
      billingName: true,
      billingEmail: true,
    }));

    if (!isFormValid) {
      return;
    }

    router.push("/confirmation");
  };

  const baseInputClass =
    "w-full rounded-sm border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/60";
  const errorInputClass = "border-rose-200/60 focus:border-rose-200/80";
  const errorTextClass =
    "min-h-[0.75rem] text-[0.6rem] uppercase tracking-[0.2em] text-rose-200/70 transition";

  const specialRequests = bookingSummary.specialRequests.trim()
    ? bookingSummary.specialRequests
    : "None";

  const fieldError = (field: FieldName) =>
    touched[field] && errors[field] ? errors[field] : "";

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.05),_transparent_45%)]" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Loft 442
          </p>
          <h1 className="text-3xl font-semibold tracking-[0.3em] text-white sm:text-4xl md:text-5xl">
            PAYMENT
          </h1>
          <p className="max-w-xl text-sm text-white/70">
            Securely confirm your booking.
          </p>
        </div>
      </section>

      <section className="bg-black">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-4 sm:px-6">
          <div className="flex flex-col gap-3">
            <span className="text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
              Step 2 of 2
            </span>
            <div className="relative h-[10px] w-full">
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/15" />
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.18)]" />
              <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/50 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/70 bg-white/60 shadow-[0_0_12px_rgba(255,255,255,0.28)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="text-spotlight rounded-sm border border-white/10 bg-white/5 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                BOOKING SUMMARY
              </p>
              <div className="mt-6 divide-y divide-white/10">
                <div className="flex items-center justify-between py-3 text-sm text-white/70">
                  <span className="uppercase tracking-[0.3em] text-[0.6rem] text-white/50">
                    Date
                  </span>
                  <span className="text-white/80">{bookingSummary.date}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-sm text-white/70">
                  <span className="uppercase tracking-[0.3em] text-[0.6rem] text-white/50">
                    Start Time
                  </span>
                  <span className="text-white/80">{bookingSummary.startTime}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-sm text-white/70">
                  <span className="uppercase tracking-[0.3em] text-[0.6rem] text-white/50">
                    End Time
                  </span>
                  <span className="text-white/80">{bookingSummary.endTime}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-sm text-white/70">
                  <span className="uppercase tracking-[0.3em] text-[0.6rem] text-white/50">
                    Type of Booking
                  </span>
                  <span className="text-white/80">{bookingSummary.type}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-sm text-white/70">
                  <span className="uppercase tracking-[0.3em] text-[0.6rem] text-white/50">
                    Special Requests
                  </span>
                  <span className="text-white/80">{specialRequests}</span>
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={80}>
              <form
              onSubmit={handleSubmit}
              className="text-spotlight rounded-sm border border-white/10 bg-white/5 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  PAYMENT DETAILS
                </p>
                <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-white/50">
                  <span className="rounded-sm border border-white/20 bg-black/60 px-2 py-1 text-white/70">
                    Card
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5" />
                    Secure payment
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Cardholder Name
                  <input
                    type="text"
                    value={form.cardholderName}
                    onChange={(event) =>
                      updateField("cardholderName", event.target.value)
                    }
                    onBlur={() => markTouched("cardholderName")}
                    aria-invalid={Boolean(fieldError("cardholderName"))}
                    aria-describedby="cardholderName-error"
                    className={`${baseInputClass} ${
                      fieldError("cardholderName") ? errorInputClass : ""
                    }`}
                  />
                  <span
                    id="cardholderName-error"
                    aria-live="polite"
                    className={`${errorTextClass} ${
                      fieldError("cardholderName") ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {fieldError("cardholderName")}
                  </span>
                </label>

                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Card Number
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={(event) =>
                      updateField("cardNumber", event.target.value)
                    }
                    onBlur={() => markTouched("cardNumber")}
                    aria-invalid={Boolean(fieldError("cardNumber"))}
                    aria-describedby="cardNumber-error"
                    className={`${baseInputClass} ${
                      fieldError("cardNumber") ? errorInputClass : ""
                    }`}
                  />
                  <span
                    id="cardNumber-error"
                    aria-live="polite"
                    className={`${errorTextClass} ${
                      fieldError("cardNumber") ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {fieldError("cardNumber")}
                  </span>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                    Expiration Date
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={form.expirationDate}
                      onChange={(event) =>
                        updateField("expirationDate", event.target.value)
                      }
                      onBlur={() => markTouched("expirationDate")}
                      aria-invalid={Boolean(fieldError("expirationDate"))}
                      aria-describedby="expirationDate-error"
                      className={`${baseInputClass} ${
                        fieldError("expirationDate") ? errorInputClass : ""
                      }`}
                    />
                    <span
                      id="expirationDate-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${
                        fieldError("expirationDate")
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      {fieldError("expirationDate")}
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                    CVV
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      value={form.cvv}
                      onChange={(event) => updateField("cvv", event.target.value)}
                      onBlur={() => markTouched("cvv")}
                      aria-invalid={Boolean(fieldError("cvv"))}
                      aria-describedby="cvv-error"
                      className={`${baseInputClass} ${
                        fieldError("cvv") ? errorInputClass : ""
                      }`}
                    />
                    <span
                      id="cvv-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${
                        fieldError("cvv") ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {fieldError("cvv")}
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  PRICE BREAKDOWN
                </p>
                <div className="mt-4 grid gap-3 text-sm text-white/70">
                  <div className="flex items-center justify-between">
                    <span>Base Price</span>
                    <span>{pricing.base}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Service Fee</span>
                    <span>{pricing.service}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Taxes</span>
                    <span>{pricing.taxes}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                    <span>Total</span>
                    <span>{pricing.total}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  BILLING INFORMATION
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                    Billing Name
                    <input
                      type="text"
                      value={form.billingName}
                      onChange={(event) =>
                        updateField("billingName", event.target.value)
                      }
                      onBlur={() => markTouched("billingName")}
                      aria-invalid={Boolean(fieldError("billingName"))}
                      aria-describedby="billingName-error"
                      className={`${baseInputClass} ${
                        fieldError("billingName") ? errorInputClass : ""
                      }`}
                    />
                    <span
                      id="billingName-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${
                        fieldError("billingName") ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {fieldError("billingName")}
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                    Billing Email
                    <input
                      type="email"
                      value={form.billingEmail}
                      onChange={(event) =>
                        updateField("billingEmail", event.target.value)
                      }
                      onBlur={() => markTouched("billingEmail")}
                      aria-invalid={Boolean(fieldError("billingEmail"))}
                      aria-describedby="billingEmail-error"
                      className={`${baseInputClass} ${
                        fieldError("billingEmail") ? errorInputClass : ""
                      }`}
                    />
                    <span
                      id="billingEmail-error"
                      aria-live="polite"
                      className={`${errorTextClass} ${
                        fieldError("billingEmail") ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {fieldError("billingEmail")}
                    </span>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                    Billing Phone (optional)
                    <input
                      type="tel"
                      value={form.billingPhone}
                      onChange={(event) =>
                        updateField("billingPhone", event.target.value)
                      }
                      onBlur={() => markTouched("billingPhone")}
                      className={baseInputClass}
                    />
                    <span className={`${errorTextClass} opacity-0`} />
                  </label>
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                    Billing Address (optional)
                    <input
                      type="text"
                      value={form.billingAddress}
                      onChange={(event) =>
                        updateField("billingAddress", event.target.value)
                      }
                      onBlur={() => markTouched("billingAddress")}
                      className={baseInputClass}
                    />
                    <span className={`${errorTextClass} opacity-0`} />
                  </label>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <label className="flex items-start gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, agree: event.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 rounded-sm border border-white/30 bg-black/60 text-white accent-white"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-white/80 underline underline-offset-4 transition hover:text-white"
                    >
                      terms and cancellation policy
                    </Link>
                  </span>
                </label>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className="cta-button inline-flex h-11 items-center justify-center bg-white px-6 text-[0.65rem] uppercase tracking-[0.35em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    CONFIRM & PAY
                  </button>
                </div>
              </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
