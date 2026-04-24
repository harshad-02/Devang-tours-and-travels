import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { usePlannedTripPopup } from "../../context/PlannedTripPopupContext.jsx";
import { plannedTrips } from "../../data/plannedTrips.js";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./PlannedTrips.css";

const plannedTripsLoop = [...plannedTrips, ...plannedTrips, ...plannedTrips];
const plannedTripsLoopStartIndex = plannedTrips.length;

function PlannedTripCard({
  index,
  slug,
  title,
  duration,
  summary,
  highlights,
  route,
  coverage,
  notes,
}) {
  const { showTripPopup } = usePlannedTripPopup();

  return (
    <article className="planned-trip-card">
      <div className="planned-trip-top">
        <span className="planned-trip-index">0{index + 1}</span>
        <span className="planned-trip-duration">{duration}</span>
      </div>

      <h3 className="planned-trip-title">{title}</h3>
      <p className="planned-trip-summary">{summary}</p>

      <div className="planned-trip-highlights">
        {highlights.map((highlight) => (
          <span key={highlight} className="planned-trip-highlight">
            {highlight}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="planned-trip-button"
        onClick={() =>
          showTripPopup({
            index,
            slug,
            title,
            duration,
            summary,
            highlights,
            route,
            coverage,
            notes,
          })
        }
      >
        More Details
      </button>
    </article>
  );
}

export default function PlannedTrips() {
  const normalizeLoopPosition = (swiper) => {
    const totalTrips = plannedTrips.length;

    if (swiper.activeIndex < totalTrips) {
      swiper.slideTo(swiper.activeIndex + totalTrips, 0, false);
    } else if (swiper.activeIndex >= totalTrips * 2) {
      swiper.slideTo(swiper.activeIndex - totalTrips, 0, false);
    }
  };

  return (
    <section className="planned-trips-section" id="planned-trips">
      <div className="planned-trips-shell">
        <div className="planned-trips-header">
          <p className="planned-trips-kicker">Planned Trips</p>
          <h2 className="planned-trips-title">Ready-made darshan plans for popular routes</h2>
          <p className="planned-trips-description">
            Choose from our most requested city and coastal ride plans, then raise your
            booking request with the destination that fits your travel day best.
          </p>
        </div>

        <div className="planned-trips-swiper-wrapper">
          <Swiper
            modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
            initialSlide={plannedTripsLoopStartIndex}
            centeredSlides={true}
            watchSlidesProgress={true}
            grabCursor={true}
            speed={850}
            spaceBetween={56}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 110,
              modifier: 0.7,
              scale: 0.96,
              slideShadows: true,
            }}
            autoplay={{
              delay: 2800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            observer={true}
            observeParents={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            onInit={(swiper) => {
              swiper.slideTo(plannedTripsLoopStartIndex, 0, false);
            }}
            onSlideChangeTransitionEnd={(swiper) => {
              normalizeLoopPosition(swiper);
            }}
            navigation={{
              prevEl: ".planned-trips-nav-prev",
              nextEl: ".planned-trips-nav-next",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 12,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 2.75,
                spaceBetween: 44,
                centeredSlides: true,
              },
              1200: {
                slidesPerView: 2.75,
                spaceBetween: 60,
                centeredSlides: true,
              },
            }}
            className="planned-trips-swiper"
          >
            {plannedTripsLoop.map((trip, index) => (
              <SwiperSlide key={`${trip.title}-${index}`} className="planned-trips-slide">
                <PlannedTripCard index={index % plannedTrips.length} {...trip} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="planned-trips-nav planned-trips-nav-prev"
            aria-label="Previous planned trip"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="planned-trips-nav planned-trips-nav-next"
            aria-label="Next planned trip"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
