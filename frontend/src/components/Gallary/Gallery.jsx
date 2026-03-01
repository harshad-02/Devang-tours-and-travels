import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./Gallery.css";

const galleryImages = [
  { src: "/gallery/car1.jpg", alt: "Gallery image 1" },
  { src: "/gallery/car2.jpg", alt: "Gallery image 2" },
  { src: "/gallery/car3.jpg", alt: "Gallery image 3" },
  { src: "/gallery/car4.jpg", alt: "Gallery image 4" },
  { src: "/gallery/car5.jpg", alt: "Gallery image 5" },
  { src: "/gallery/car6.jpg", alt: "Gallery image 6" },
];

export default function Gallery() {
  const swiperRef = useRef(null);

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-ambient-glow" aria-hidden="true" />

      <div className="gallery-header">
        <p className="gallery-eyebrow">Our Fleet & Journeys</p>
        <h2 className="gallery-title">
          Gallery <span className="gallery-title-accent">Images</span>
        </h2>
        <p className="gallery-subtitle">
          Every journey, beautifully captured - premium comfort, every mile.
        </p>
      </div>

      <div className="gallery-swiper-wrapper">
        <Swiper
          ref={swiperRef}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={2.65}
          spaceBetween={20}
          watchSlidesProgress={true}
          loop={true}
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={700}
          coverflowEffect={{
            rotate: 24,
            stretch: 4,
            depth: 300,
            modifier: 1.2,
            slideShadows: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.16,
              spaceBetween: 8,
              coverflowEffect: {
                rotate: 16,
                stretch: 0,
                depth: 110,
                modifier: 0.95,
                slideShadows: false,
              },
            },
            768: {
              slidesPerView: 2.15,
              spaceBetween: 16,
              coverflowEffect: {
                rotate: 20,
                stretch: 0,
                depth: 190,
                modifier: 1.05,
                slideShadows: false,
              },
            },
            1025: {
              slidesPerView: 2.65,
              spaceBetween: 20,
              coverflowEffect: {
                rotate: 24,
                stretch: 4,
                depth: 300,
                modifier: 1.2,
                slideShadows: false,
              },
            },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{
            prevEl: ".gallery-nav-prev",
            nextEl: ".gallery-nav-next",
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="gallery-swiper"
        >
          {galleryImages.map((image, index) => (
            <SwiperSlide key={index} className="gallery-slide">
              <div className="slide-inner">
                <div className="slide-glow-halo" aria-hidden="true" />

                <div className="slide-glass-frame">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="gallery-nav gallery-nav-prev" aria-label="Previous slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="gallery-nav gallery-nav-next" aria-label="Next slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
