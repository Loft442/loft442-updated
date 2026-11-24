"use client";

import dynamic from "next/dynamic";

const BackToTop = dynamic(() => import("@/components/BackToTop"), {
  ssr: false,
});

export default function DeferredBackToTop() {
  return <BackToTop />;
}
