"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";

const CONTACT_SECTION_ID = "pricing";

type ContactUsLinkProps = {
  className?: string;
};

export default function ContactUsLink({ className }: ContactUsLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") {
      event.preventDefault();
      router.push(`/#${CONTACT_SECTION_ID}`);
      return;
    }

    const target = document.getElementById(CONTACT_SECTION_ID);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Link
      href={`/#${CONTACT_SECTION_ID}`}
      onClick={handleClick}
      className={className}
    >
      Contact us
    </Link>
  );
}
