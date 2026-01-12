import Image from "next/image";
import Reveal from "@/components/Reveal";
import styles from "./Features.module.css";

export default function Features() {
  return (
    <>
      <section id="gallery" className="section-glow section-divider border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr] md:items-stretch">
            <div className={`relative h-full ${styles.aboutColumn}`}>
              <span className={styles.aboutLine} aria-hidden="true" />
              <div className="inline-block rounded-sm px-4 py-3">
                <div className="flex flex-col gap-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    ABOUT LOFT 442
                  </p>
                  <div className="body-spotlight flex flex-col gap-6">
                    <p className="text-base leading-relaxed text-white/80">
                      LOFT 442 is a venue specializing in private event rentals,
                      offering a unique, inclusive space for dinners, birthdays, and
                      work conferences.
                    </p>
                    <p className="text-base leading-relaxed text-white/80">
                      As a tribute to service, LOFT 442 extends exclusive discounts to
                      all active, retired veterans and first responders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[240px] overflow-hidden rounded-sm border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.4)] sm:h-[320px] lg:h-[360px]">
              <Image
                src="/images/1.png"
                alt="Loft 442 event venue interior"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="reveal reveal-image object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section-glow section-divider border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="grid items-center gap-10 md:grid-cols-[1fr_1.05fr] md:items-stretch">
            <div className="relative h-[240px] overflow-hidden rounded-sm border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.4)] sm:h-[320px] lg:h-[360px]">
              <Image
                src="/images/2.png"
                alt="Loft 442 venue detail"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className={`relative h-full ${styles.qualityColumn}`}>
              <span className={styles.qualityLine} aria-hidden="true" />
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
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
