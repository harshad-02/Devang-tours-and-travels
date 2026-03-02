import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Reviews.css";

const reviewsData = [
  {
    id: "rahul-sharma-2024-03-12",
    name: "Rahul Sharma",
    tripInfo: "Mumbai to Kokan Trip",
    date: "12 March 2024",
    review: "Very safe and comfortable journey. Highly recommended.",
    ratings: {
      safety: 5,
      comfort: 4,
      time: 5,
      overall: 5,
    },
  },
  {
    id: "ananya-verma-2024-04-28",
    name: "Ananya Verma",
    tripInfo: "Pune to Mahabaleshwar Trip",
    date: "28 April 2024",
    review:
      "Excellent trip planning and punctual schedules. The entire experience felt premium.",
    ratings: {
      safety: 4,
      comfort: 5,
      time: 4,
      overall: 5,
    },
  },
  {
    id: "vikram-mehta-2024-06-09",
    name: "Vikram Mehta",
    tripInfo: "Nashik to Goa Trip",
    date: "09 June 2024",
    review:
      "Smooth journey from start to finish. Great comfort and very professional staff.",
    ratings: {
      safety: 5,
      comfort: 5,
      time: 4,
      overall: 5,
    },
  },
  {
    id: "sneha-kulkarni-2024-08-21",
    name: "Sneha Kulkarni",
    tripInfo: "Mumbai to Lonavala Trip",
    date: "21 August 2024",
    review:
      "Clean vehicles, courteous driver, and excellent comfort throughout the trip.",
    ratings: {
      safety: 5,
      comfort: 5,
      time: 4,
      overall: 5,
    },
  },
  {
    id: "arjun-patil-2024-09-03",
    name: "Arjun Patil",
    tripInfo: "Thane to Alibaug Trip",
    date: "03 September 2024",
    review:
      "Timely pickup, smooth drive, and the entire ride felt secure and professionally managed.",
    ratings: {
      safety: 5,
      comfort: 4,
      time: 5,
      overall: 5,
    },
  },
  {
    id: "meera-naik-2024-10-14",
    name: "Meera Naik",
    tripInfo: "Pune to Lavasa Trip",
    date: "14 October 2024",
    review:
      "Driver was polite, car was spotless, and everything from booking to drop-off was seamless.",
    ratings: {
      safety: 4,
      comfort: 5,
      time: 4,
      overall: 5,
    },
  },
  {
    id: "rohan-deshmukh-2024-11-05",
    name: "Rohan Deshmukh",
    tripInfo: "Mumbai to Goa Trip",
    date: "05 November 2024",
    review:
      "Long-distance journey felt effortless. Great comfort, great driving, and perfect timing.",
    ratings: {
      safety: 5,
      comfort: 5,
      time: 4,
      overall: 5,
    },
  },
  {
    id: "kavya-joshi-2024-12-19",
    name: "Kavya Joshi",
    tripInfo: "Navi Mumbai to Pune Trip",
    date: "19 December 2024",
    review:
      "Excellent coordination and premium travel experience. Would confidently book again.",
    ratings: {
      safety: 5,
      comfort: 4,
      time: 5,
      overall: 5,
    },
  },
];

const ratingLabels = {
  safety: "Safety",
  comfort: "Comfort",
  time: "Time Management",
  overall: "Overall Experience",
};

const ReviewCard = ({ name, tripInfo, date, review, ratings }) => {
  return (
    <article className="review-card">
      <h3 className="review-card-name">{name}</h3>
      <p className="review-card-trip">{tripInfo}</p>
      <p className="review-card-date">{date}</p>
      <p className="review-card-text">{review}</p>

      <div className="review-ratings">
        {Object.entries(ratings).map(([key, value]) => {
          const width = `${(value / 5) * 100}%`;

          return (
            <div className="rating-row" key={key}>
              <div className="rating-row-header">
                <span className="rating-label">{ratingLabels[key]}</span>
                <span className="rating-value">{value}/5</span>
              </div>

              <div
                className="rating-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={value}
                aria-label={ratingLabels[key]}
              >
                <span className="rating-fill" style={{ "--target-width": width }} />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

const Reviews = () => {
  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-container">
        <header className="reviews-header">
          <p className="reviews-kicker">Traveler Stories</p>
          <h2 className="reviews-title">What Our Guests Say</h2>
        </header>

        <div className="reviews-swiper-wrapper">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            loopedSlides={reviewsData.length}
            initialSlide={0}
            centeredSlides={true}
            watchSlidesProgress={true}
            grabCursor={true}
            speed={850}
            spaceBetween={20}
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
              prevEl: ".reviews-nav-prev",
              nextEl: ".reviews-nav-next",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 12,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 16,
                centeredSlides: true,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 20,
                centeredSlides: true,
              },
            }}
            className="reviews-swiper"
          >
            {reviewsData.map((review) => (
              <SwiperSlide key={review.id} className="reviews-slide">
                <ReviewCard {...review} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="reviews-nav reviews-nav-prev" aria-label="Previous review">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="reviews-nav reviews-nav-next" aria-label="Next review">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;

