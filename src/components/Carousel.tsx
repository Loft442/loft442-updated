'use client'

import { useEffect } from "react";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./Carousel.module.css";

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [AutoScroll({ speed: 1.4, startDelay: 0, stopOnInteraction: false })]
  );

  useEffect(() => {
    const auto = emblaApi?.plugins()?.autoScroll;
    if (!auto) return;
    auto.play();
  }, [emblaApi]);

  // List of images in public/images
  const images = [
    "/images/Carousel/babyshower10.webp",
    "/images/Carousel/birthday10.webp",
    "/images/Carousel/birthday11.webp",
    "/images/Carousel/birthday12.webp",
    "/images/Carousel/birthday2.webp",
    "/images/Carousel/birthday4.webp",
    "/images/Carousel/birthday5.webp",
    "/images/Carousel/birthday7.webp",
    "/images/Carousel/birthday9.webp",
    "/images/Carousel/private-event2.webp",
    "/images/Carousel/private-event3.webp",
    "/images/Carousel/wedding4.webp",
    "/images/Carousel/wedding5.webp",
    "/images/Carousel/wedding6.webp",
    "/images/Carousel/wedding9.webp",
  ];

  return (
    <div className={`${styles.embla} mx-auto mt-12 w-full max-w-7xl`}>
      <div className={`${styles.embla__viewport} h-[320px]`} ref={emblaRef}>
        <div className={`${styles.embla__container} h-full`}>
          {images.map((src, idx) => (
            <div
              key={src}
              className={`${styles.embla__slide} flex items-center justify-center`}
            >
              <Image
                src={src}
                alt={`Slide ${idx + 1}`}
                width={224}
                height={320}
                className="h-full w-full object-cover"
                sizes="(max-width: 640px) 70vw, 224px"
                priority={idx === 0}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
