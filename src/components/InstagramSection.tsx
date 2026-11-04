import Image from "next/image";
import { ArrowUpRight, Instagram } from "lucide-react";
import InstagramGrid from "@/components/InstagramGrid";
import Reveal from "@/components/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { getInstagramFeed, INSTAGRAM_PROFILE_URL, MEDIA_LIMIT } from "@/lib/instagram";

const FALLBACK_USERNAME = "loft.442";

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 sm:items-start">
      <span className="text-gold-accent font-serif text-3xl font-light leading-none">
        {compactNumber.format(value)}
      </span>
      <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/55">{label}</span>
    </div>
  );
}

function FollowButton({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "sm")}>
      <Instagram className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      Follow on Instagram
    </a>
  );
}

function Avatar({ src, alt, href, label }: { src: string | null; alt: string; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="shrink-0 rounded-full p-[1.5px] transition hover:opacity-90"
      style={{ background: "var(--gold)" }}
    >
      <span className="block rounded-full bg-[var(--background)] p-[3px]">
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={96}
            height={96}
            className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
          />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.03] sm:h-24 sm:w-24">
            <Instagram className="h-8 w-8 text-gold-light" strokeWidth={1.25} aria-hidden="true" />
          </span>
        )}
      </span>
    </a>
  );
}

// Live feed from the Instagram Graph API (cached for an hour, see src/lib/instagram.ts).
// The token is INSTAGRAM_ACCESS_TOKEN. If it is missing or the API fails, the section
// still shows the handle and a follow link rather than disappearing.
export default async function InstagramSection() {
  const feed = await getInstagramFeed();
  const profile = feed?.profile;
  const posts = feed?.posts ?? [];
  const username = profile?.username ?? FALLBACK_USERNAME;
  const profileUrl = profile?.profileUrl || INSTAGRAM_PROFILE_URL;

  return (
    <section id="instagram" className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal mode="text" className="mb-14 flex flex-col items-center gap-5 text-center">
          <p className="eyebrow">Follow Along</p>
        </Reveal>

        <Reveal
          mode="text"
          className="mb-12 flex flex-col items-center gap-8 border-y border-[var(--line)] py-10 sm:flex-row sm:items-center sm:gap-10"
        >
          <Avatar
            src={profile?.profilePictureUrl ?? null}
            alt={`${profile?.name || username} profile picture`}
            href={profileUrl}
            label={`@${username} on Instagram`}
          />

          <div className="flex min-w-0 flex-1 flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap font-serif text-3xl text-[var(--ivory)] transition-colors hover:text-gold-light"
            >
              @{username}
            </a>
            {profile && (profile.mediaCount !== null || profile.followersCount !== null) && (
              <div className="flex gap-10">
                {profile.mediaCount !== null && <Stat value={profile.mediaCount} label="Posts" />}
                {profile.followersCount !== null && <Stat value={profile.followersCount} label="Followers" />}
              </div>
            )}
            {profile?.biography && (
              <p className="max-w-xl whitespace-pre-line text-[0.95rem] leading-relaxed text-white/65">
                {profile.biography}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <FollowButton href={profileUrl} />
          </div>
        </Reveal>

        {posts.length > 0 && (
          <>
            <Reveal mode="media">
              <InstagramGrid posts={posts} />
            </Reveal>
            <div className="mt-12 flex justify-center">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost")}>
                View more on Instagram
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export function InstagramSectionSkeleton() {
  return (
    <section aria-hidden="true" className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl animate-pulse px-6">
        <div className="mb-12 flex flex-col items-center gap-6 border-y border-[var(--line)] py-10 sm:flex-row">
          <div className="h-[86px] w-[86px] rounded-full bg-white/5 sm:h-[102px] sm:w-[102px]" />
          <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
            <div className="h-6 w-40 bg-white/5" />
            <div className="h-4 w-56 bg-white/5" />
            <div className="h-4 w-72 max-w-full bg-white/5" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {Array.from({ length: MEDIA_LIMIT }).map((_, index) => (
            <div key={index} className="aspect-square bg-white/5" />
          ))}
        </div>
      </div>
    </section>
  );
}
