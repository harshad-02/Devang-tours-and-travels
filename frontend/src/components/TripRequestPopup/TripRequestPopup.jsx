import { useEffect } from "react";
import { useNotification } from "../../context/NotificationContext.jsx";
import "./TripRequestPopup.css";

export default function TripRequestPopup() {
  const { message, hideNotification } = useNotification();

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      hideNotification();
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message, hideNotification]);

  if (!message) {
    return null;
  }

  return (
    <div className="trip-popup" role="status" aria-live="polite">
      <div className="trip-popup-card">
        <button
          type="button"
          className="trip-popup-close"
          onClick={hideNotification}
          aria-label="Close notification"
        >
          x
        </button>
        <p className="trip-popup-title">Trip request received</p>
        <p className="trip-popup-text">{message}</p>
      </div>
    </div>
  );
}
