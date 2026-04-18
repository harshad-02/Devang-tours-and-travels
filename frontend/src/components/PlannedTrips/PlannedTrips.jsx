import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./PlannedTrips.css";

const plannedTrips = [
  {
    title: "Ratnagiri Darshan",
    duration: "Full day coastal route",
    summary:
      "A scenic Konkan circuit covering beaches, temples, city viewpoints, and local food stops.",
    highlights: ["Ganpatipule", "Ratnadurg Fort", "Thiba Palace"],
  },
  {
    title: "Malvan Darshan",
    duration: "Leisure + sightseeing day",
    summary:
      "Ideal for sea-facing travel with heritage stops, local markets, and relaxed beach-side time.",
    highlights: ["Sindhudurg Fort", "Tarkarli", "Rock Garden"],
  },
  {
    title: "Pune Darshan",
    duration: "City exploration plan",
    summary:
      "A balanced Pune city ride with cultural landmarks, shopping zones, and family-friendly stops.",
    highlights: ["Shaniwar Wada", "Dagdusheth", "Saras Baug"],
  },
  {
    title: "Mumbai Darshan",
    duration: "Popular city highlights",
    summary:
      "A full Mumbai city experience designed for major landmarks, marine views, and iconic routes.",
    highlights: ["Gateway of India", "Marine Drive", "Juhu Beach"],
  },
  {
    title: "Goa Trip",
    duration: "Weekend escape route",
    summary:
      "A relaxed long-distance plan for beaches, nightlife spots, churches, and scenic coastal roads.",
    highlights: ["Calangute", "Baga", "Old Goa"],
  },
  {
    title: "Pink City Trip",
    duration: "Heritage city journey",
    summary:
      "A Jaipur-focused travel plan with royal architecture, colorful bazaars, and signature city viewpoints.",
    highlights: ["Hawa Mahal", "Amber Fort", "City Palace"],
  },
  {
    title: "Mahabaleshwar Trip",
    duration: "Hill station getaway",
    summary:
      "A refreshing hill route with valley points, strawberry stops, lake views, and cool-weather breaks.",
    highlights: ["Mapro Garden", "Venna Lake", "Arthur Seat"],
  },
];

function PlannedTripCard({ index, title, duration, summary, highlights }) {
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

      <button type="button" className="planned-trip-button">
        More Details
      </button>
    </article>
  );
}

export default function PlannedTrips() {
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
            loop={true}
            loopedSlides={plannedTrips.length}
            loopAdditionalSlides={plannedTrips.length}
            initialSlide={1}
            centeredSlides={true}
            centeredSlidesBounds={true}
            watchSlidesProgress={true}
            watchOverflow={true}
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
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            observer={true}
            observeParents={true}
            pagination={{ clickable: true }}
            onInit={(swiper) => {
              swiper.slideToLoop(0, 0, false);
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
            {plannedTrips.map((trip, index) => (
              <SwiperSlide key={trip.title} className="planned-trips-slide">
                <PlannedTripCard index={index} {...trip} />
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
