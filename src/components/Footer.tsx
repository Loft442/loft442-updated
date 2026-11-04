import Link from "next/link";
import { Instagram } from "lucide-react";
import { TEAM_CONTACTS } from "@/lib/contacts";

const exploreLinks = [
  { label: "Experiences & Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Catering", href: "/catering" },
  { label: "Repass", href: "/repass" },
  { label: "Request a Tour", href: "/schedule" },
];

const contacts = TEAM_CONTACTS;

const labelClass = "text-gold-accent text-[0.7rem] uppercase tracking-[0.35em]";
const linkClass = "tap transition-colors duration-300 hover:text-gold-light";

export default function Footer() {
  return (
    <footer className="section-divider border-t border-[var(--line)] pb-10 pt-16 sm:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="font-serif text-3xl text-[var(--ivory)]">Loft 442</p>
            <p className="max-w-xs text-sm leading-relaxed text-white/55">
              A private event venue in Elmont, New York. 784 Elmont Road, Elmont, NY 11003.
            </p>
            <a
              href="https://www.instagram.com/LOFT.442"
              aria-label="Loft 442 on Instagram"
              className={`mt-2 flex items-center gap-2 self-start text-[0.7rem] uppercase tracking-[0.3em] text-white/70 ${linkClass}`}
            >
              <Instagram className="h-4 w-4" strokeWidth={1.25} />
              Instagram
            </a>
          </div>

          <div className="flex flex-col gap-4 text-sm text-white/75 md:gap-6">
            <div className="flex flex-col md:gap-2">
              <p className={labelClass}>Inquiries</p>
              <a href="mailto:events@loft442.com" className={linkClass}>
                events@loft442.com
              </a>
            </div>
            <div className="flex flex-col md:gap-2">
              <p className={labelClass}>Our Team</p>
              {contacts.map((contact) => (
                <a key={contact.tel} href={`tel:${contact.tel}`} className={linkClass}>
                  <span className="text-white/45">{contact.name}</span>&nbsp;&nbsp;{contact.display}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:gap-4">
            <p className={labelClass}>Explore</p>
            {exploreLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm text-white/75 ${linkClass}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="border-t border-[var(--line)] pt-8 text-[0.7rem] uppercase tracking-[0.3em] text-white/40">
          © {new Date().getFullYear()} Loft 442. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
