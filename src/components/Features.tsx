import Image from "next/image";
import Reveal from "@/components/Reveal";
import styles from "./Features.module.css";

export default function Features() {
  return (
    <>
      <section
        id="about"
        className="scroll-mt-28 md:scroll-mt-32 section-glow section-divider border-t border-white/10 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="grid items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
            <div className={`relative order-2 h-full md:order-1 ${styles.aboutColumn}`}>
              <span className={styles.aboutLine} aria-hidden="true" />
              <div className="inline-block rounded-sm px-4 py-3">
                <div className="flex flex-col gap-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    ABOUT LOFT 442
                  </p>
                  <div className="body-spotlight flex flex-col gap-6">
                    <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                      LOFT 442 is a premier, veteran-owned event venue in Long Island,
                      thoughtfully designed for weddings, celebrations, corporate
                      events, and private gatherings. Blending modern elegance with
                      urban charm, the space features stylish seating, a flexible
                      layout, and advanced sound, lighting, and video technology to
                      elevate every event. Guided by discipline, integrity, and
                      attention to detail, our dedicated team creates seamless,
                      memorable experiences where every occasion is treated with care
                      and respect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-1 h-[358px] w-full max-w-[543px] overflow-hidden rounded-sm border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.4)] md:order-2">
              <Image
                src="/images/ribbon2.png"
                alt="Loft 442 event venue interior"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="reveal reveal-image object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
      <section
        id="tribute"
        className="scroll-mt-28 md:scroll-mt-32 section-glow section-divider border-t border-white/10 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="grid items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
            <div className="relative order-1 h-[358px] w-full max-w-[543px] overflow-hidden rounded-sm border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
              <Image
                src="/images/military-ex.png"
                alt="Military tribute"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="reveal reveal-image object-cover"
              />
            </div>
            <div className={`relative order-2 h-full ${styles.qualityColumn}`}>
              <div className="inline-block rounded-sm px-4 py-3">
                <div className="flex flex-col gap-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    A Tribute to Service & Sacrifice
                  </p>
                  <div className="body-spotlight flex flex-col gap-6">
                    <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                      Loft 442 is proudly veteran-owned. We honor the men and women
                      who have served, not just in words, but through respect,
                      integrity, and community. This space was built on discipline,
                      dedication, and pride, values carried from service into every
                      event we host.
                    </p>
                    <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                      As a tribute to service, LOFT 442 extends exclusive discounts to
                      all active, retired veterans and first responders.
                    </p>
                  </div>
                </div>
              </div>
              <span className={styles.qualityLine} aria-hidden="true" />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section-glow section-divider border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="grid items-center gap-10 md:grid-cols-[1fr_1.05fr] md:items-stretch">
            <div className={`relative h-full ${styles.qualityColumnLeft}`}>
              <div className="inline-block rounded-sm px-4 py-3">
                <div className="flex flex-col gap-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    QUALITY PROMISE
                  </p>
                  <div className="body-spotlight flex flex-col gap-6">
                    <p className="text-base leading-relaxed text-white/80">
                      We ensure that every event is executed with precision and
                      excellence. We prioritize customer satisfaction by providing a
                      well-maintained space, state-of-the-art facilities, and a
                      dedicated team ready to assist with all aspects of your event. We
                      guarantee a seamless experience that meets your specific needs
                      and exceeds expectations.
                    </p>
                    <p className="text-base leading-relaxed text-white/80">
                      Choose us for a venue that reflects professionalism and
                      attention to detail.
                    </p>
                  </div>
                </div>
              </div>
              <span
                className={`${styles.qualityLine} ${styles.qualityLineLeft}`}
                aria-hidden="true"
              />
            </div>
            <div className="relative h-[240px] overflow-hidden rounded-sm border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.4)] sm:h-[320px] lg:h-[360px]">
              <Image
                src="/images/2.png"
                alt="Loft 442 venue detail"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="reveal reveal-image object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
