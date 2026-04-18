import { useEffect, useRef, useState } from "react";
import "./Driver.css";
import driverImg from "../../assets/driver.jpg";

export default function Driver() {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }, 
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <section className="driver-section">
      <div ref={cardRef} className={`driver-card ${isVisible ? "show" : ""}`}>
        <div className="driver-image">
          <img src={driverImg} alt="Driver" />
        </div>

        <div className="driver-info">
          <h2>Meet Your Driver</h2>

          <p>
            <strong>Name:</strong> Sumit Deshpandey
          </p>
          <p>
            <strong>Experience:</strong> 7 Years of Professional Driving
            Experience
          </p>
          <p>
            <strong>Contact:</strong> +91 8655890247
          </p>
          <p>
            <strong>Location:</strong> Hadapsar, Pune
          </p>

          <p className="driver-intro">
            My name is Sumit Deshpandey, and I am a professional driver with 7
            years of safe driving experience. I am completely non-addicted,
            punctual, and committed to ensuring passenger safety and comfort. I
            have experience in both day and night driving, and I always strive
            to provide smooth, reliable, and stress-free journeys for every
            trip.
          </p>
        </div>
      </div>
    </section>
  );
}
