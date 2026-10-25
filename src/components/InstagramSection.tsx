import { Clapperboard, Instagram, Layers } from "lucide-react";
import Reveal from "@/components/Reveal";
import {
  getInstagramFeed,
  INSTAGRAM_PROFILE_URL,
  type InstagramPost,
} from "@/lib/instagram";

const GOLD_RING =
  "linear-gradient(135deg, rgba(245,230,168,0.9), rgba(212,175,55,0.8), rgba(184,150,46,0.9))";

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start">
      <span className="text-lg font-semibold tracking-[0.08em] text-[#f5e6a8] sm:text-xl">
        {compactNumber.format(value)}
      </span>
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
        {label}
      </span>
    </div>
  );
}

function FollowButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-button cta-book inline-flex h-11 items-center justify-center gap-2 rounded-sm px-6 text-[0.65rem] uppercase tracking-[0.35em] text-black transition hover:opacity-90"
    >
      <Instagram className="h-4 w-4" aria-hidden="true" />
      Follow on Instagram
    </a>
  );
}

function PostTile({ post }: { post: InstagramPost }) {
  const caption = post.caption.trim();
  const label = post.isReel ? "Reel" : post.mediaType === "CAROUSEL_ALBUM" ? "Album" : "Post";
  const alt = caption ? caption.slice(0, 120) : `Loft 442 Instagram ${label.toLowerCase()}`;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${label.toLowerCase()} on Instagram`}
      className="group relative block aspect-square overflow-hidden rounded-sm border border-white/10 bg-white/5 transition-colors hover:border-[#d4af37]/50 focus-visible:border-[#d4af37] focus-visible:outline-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
      />

      {post.isReel ? (
        <Clapperboard
          className="absolute right-2 top-2 h-4 w-4 text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.8))]"
          aria-hidden="true"
        />
      ) : post.mediaType === "CAROUSEL_ALBUM" ? (
        <Layers
          className="absolute right-2 top-2 h-4 w-4 text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.8))]"
          aria-hidden="true"
        />
      ) : null}

      {caption && (
        <div className="pointer-events-none absolute inset-0 hidden items-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex">
          <p className="line-clamp-3 text-xs leading-relaxed text-white/90">{caption}</p>
        </div>
      )}
    </a>
  );
}

export default async function InstagramSection() {
  const feed = await getInstagramFeed();
  if (!feed) return null;

  const { profile, posts } = feed;
  const profileUrl = profile.profileUrl || INSTAGRAM_PROFILE_URL;

  return (
    <section
      id="instagram"
      className="section-glow section-divider border-t border-white/10 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal mode="text" className="spotlight mb-10">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-white/60 sm:text-left">
            Follow Along
          </p>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`@${profile.username} on Instagram`}
              className="shrink-0 rounded-full p-[2px] transition hover:opacity-90"
              style={{ background: GOLD_RING }}
            >
              <span className="block rounded-full bg-black p-[3px]">
                {profile.profilePictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profilePictureUrl}
                    alt={`${profile.name || profile.username} profile picture`}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d4af37]/10 sm:h-24 sm:w-24">
                    <Instagram className="h-8 w-8 text-[#f5e6a8]" aria-hidden="true" />
                  </span>
                )}
              </span>
            </a>

            <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <h2 className="text-2xl font-semibold tracking-[0.12em] text-white sm:text-3xl">
                @{profile.username}
              </h2>
              {(profile.mediaCount !== null || profile.followersCount !== null) && (
                <div className="flex gap-8">
                  {profile.mediaCount !== null && (
                    <Stat value={profile.mediaCount} label="Posts" />
                  )}
                  {profile.followersCount !== null && (
                    <Stat value={profile.followersCount} label="Followers" />
                  )}
                </div>
              )}
              {profile.biography && (
                <p className="max-w-xl whitespace-pre-line text-sm leading-relaxed text-white/70">
                  {profile.biography}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <FollowButton href={profileUrl} />
            </div>
          </div>
        </Reveal>

        {posts.length > 0 && (
          <Reveal mode="media">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {posts.map((post) => (
                <PostTile key={post.id} post={post} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function InstagramSectionSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="section-divider border-t border-white/10 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl animate-pulse px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-[86px] w-[86px] rounded-full bg-white/5 sm:h-[102px] sm:w-[102px]" />
          <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
            <div className="h-6 w-40 rounded-sm bg-white/5" />
            <div className="h-4 w-56 rounded-sm bg-white/5" />
            <div className="h-4 w-72 max-w-full rounded-sm bg-white/5" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-sm bg-white/5" />
          ))}
        </div>
      </div>
    </section>
  );
}
