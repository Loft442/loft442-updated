"use client";

import { buttonClasses } from "@/components/ui/Button";

export default function PrintButton({ label = "Download PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClasses("primary")}>
      {label}
    </button>
  );
}
