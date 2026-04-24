import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlannedTripPopup } from "../../context/PlannedTripPopupContext.jsx";
import "./PlannedTripPopup.css";

export default function PlannedTripPopup() {
  const { activeTrip, hideTripPopup } = usePlannedTripPopup();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeTrip) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        hideTripPopup();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeTrip, hideTripPopup]);

  if (!activeTrip) {
    return null;
  }

  return (
    <div
      className="planned-trip-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="planned-trip-popup-title"
    >
      <div className="planned-trip-popup-card">
        <button
          type="button"
          className="planned-trip-popup-close"
          onClick={hideTripPopup}
          aria-label="Close planned trip details"
        >
          x
        </button>

        <p className="planned-trip-popup-kicker">{activeTrip.duration}</p>
        <h3 className="planned-trip-popup-title" id="planned-trip-popup-title">
          {activeTrip.title}
        </h3>
        <p className="planned-trip-popup-summary">{activeTrip.summary}</p>

        <div className="planned-trip-popup-section">
          <h4 className="planned-trip-popup-heading">Route</h4>
          <p className="planned-trip-popup-copy">{activeTrip.route}</p>
        </div>

        <div className="planned-trip-popup-section">
          <h4 className="planned-trip-popup-heading">What We Cover</h4>
          <div className="planned-trip-popup-tags">
            {activeTrip.coverage.map((item) => (
              <span key={item} className="planned-trip-popup-tag">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="planned-trip-popup-section">
          <h4 className="planned-trip-popup-heading">Trip Highlights</h4>
          <div className="planned-trip-popup-tags">
            {activeTrip.highlights.map((highlight) => (
              <span key={highlight} className="planned-trip-popup-tag">
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="planned-trip-popup-section">
          <h4 className="planned-trip-popup-heading">Travel Notes</h4>
          <p className="planned-trip-popup-copy">{activeTrip.notes}</p>
        </div>

        <div className="planned-trip-popup-actions">
          <button
            type="button"
            className="planned-trip-popup-request"
            onClick={() => {
              hideTripPopup();
              navigate(`/planned-trip-booking/${activeTrip.slug}`);
            }}
          >
            Request This Trip
          </button>
        </div>
      </div>
    </div>
  );
}
