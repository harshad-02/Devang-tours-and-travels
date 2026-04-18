import { useMemo, useState } from "react";
import { useNotification } from "../../context/NotificationContext.jsx";
import { getApiUrl } from "../../lib/api.js";
import { fetchJson } from "../../lib/request.js";
import "./Booking.css";

export default function Booking() {
  const { showNotification } = useNotification();
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    email: "",
    source: "",
    destination: "",
    tripDate: minDate,
    boardingTime: "",
    addressMapLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const customerName = formData.customerName.trim();
    const mobileNumber = formData.mobileNumber.trim();
    const email = formData.email.trim();
    const source = formData.source.trim();
    const destination = formData.destination.trim();
    const addressMapLink = formData.addressMapLink.trim();

    if (
      !customerName ||
      !mobileNumber ||
      !email ||
      !source ||
      !destination ||
      !formData.tripDate ||
      !formData.boardingTime
    ) {
      showNotification("Please fill in all required trip details.");
      return;
    }

    try {
      setIsSubmitting(true);

      await fetchJson(getApiUrl("/api/requests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          mobileNumber,
          email,
          source,
          destination,
          tripDate: formData.tripDate,
          boardingTime: formData.boardingTime,
          addressMapLink,
        }),
      });

      showNotification("Your trip request was submitted successfully.");
      setFormData({
        customerName: "",
        mobileNumber: "",
        email: "",
        source: "",
        destination: "",
        tripDate: minDate,
        boardingTime: "",
        addressMapLink: "",
      });
    } catch (error) {
      showNotification(error.message || "Trip request could not be submitted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="booking-section" id="booking">
      <div className="booking-container">
        <div className="booking-copy">
          <p className="booking-kicker">Plan Your Ride</p>
          <h2 className="booking-title">Raise a trip request in a few quick steps</h2>
          <p className="booking-description">
            Share your contact details, trip route, and preferred boarding time so the
            team can review the request quickly and follow up with the right travel plan.
          </p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <label className="booking-field">
            <span>Full name</span>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label className="booking-field">
            <span>Mobile number</span>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
            />
          </label>

          <label className="booking-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </label>

          <label className="booking-field">
            <span>Source</span>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Enter pickup location"
              required
            />
          </label>

          <label className="booking-field">
            <span>Destination</span>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter drop location"
              required
            />
          </label>

          <label className="booking-field">
            <span>Date of trip</span>
            <input
              type="date"
              name="tripDate"
              min={minDate}
              value={formData.tripDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-field">
            <span>Boarding time</span>
            <small className="booking-field-hint">Use 24-hour format, for example 18:30</small>
            <input
              type="time"
              name="boardingTime"
              value={formData.boardingTime}
              onChange={handleChange}
              aria-label="Boarding time in 24-hour format"
              required
            />
          </label>

          <label className="booking-field">
            <span>Google Maps address link (optional)</span>
            <input
              type="url"
              name="addressMapLink"
              value={formData.addressMapLink}
              onChange={handleChange}
              placeholder="Paste Google Maps link"
            />
          </label>

          <button type="submit" className="booking-submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Raise Trip Request"}
          </button>
        </form>
      </div>
    </section>
  );
}
