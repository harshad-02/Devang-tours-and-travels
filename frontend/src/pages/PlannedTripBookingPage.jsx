import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useNotification } from "../context/NotificationContext.jsx";
import { getPlannedTripBySlug } from "../data/plannedTrips.js";
import { getApiUrl } from "../lib/api.js";
import { fetchJson } from "../lib/request.js";
import "../components/Booking/Booking.css";
import "./PlannedTripBookingPage.css";

export default function PlannedTripBookingPage() {
  const { slug } = useParams();
  const plannedTrip = getPlannedTripBySlug(slug);
  const { showNotification } = useNotification();
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    email: "",
    pickupLocation: "",
    dropLocation: "",
    tripDate: minDate,
    boardingTime: "",
    addressMapLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!plannedTrip) {
    return <Navigate to="/" replace />;
  }

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
    const pickupLocation = formData.pickupLocation.trim();
    const dropLocation = formData.dropLocation.trim();
    const addressMapLink = formData.addressMapLink.trim();

    if (
      !customerName ||
      !mobileNumber ||
      !email ||
      !pickupLocation ||
      !dropLocation ||
      !formData.tripDate ||
      !formData.boardingTime
    ) {
      showNotification("Please fill in all required planned trip details.");
      return;
    }

    try {
      setIsSubmitting(true);

      await fetchJson(getApiUrl("/api/planned-trip-requests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          mobileNumber,
          email,
          pickupLocation,
          dropLocation,
          tripDate: formData.tripDate,
          boardingTime: formData.boardingTime,
          addressMapLink,
          plannedTrip,
        }),
      });

      showNotification("Your planned trip request was submitted successfully.");
      setFormData({
        customerName: "",
        mobileNumber: "",
        email: "",
        pickupLocation: "",
        dropLocation: "",
        tripDate: minDate,
        boardingTime: "",
        addressMapLink: "",
      });
    } catch (error) {
      showNotification(error.message || "Planned trip request could not be submitted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="planned-trip-booking-page">
      <section className="planned-trip-booking-hero">
        <div className="planned-trip-booking-copy">
          <p className="planned-trip-booking-kicker">Planned Trip Request</p>
          <h1 className="planned-trip-booking-title">{plannedTrip.title}</h1>
          <p className="planned-trip-booking-summary">{plannedTrip.summary}</p>
          <p className="planned-trip-booking-route">
            <strong>Route:</strong> {plannedTrip.route}
          </p>

          <div className="planned-trip-booking-tags">
            {plannedTrip.coverage.map((item) => (
              <span key={item} className="planned-trip-booking-tag">
                {item}
              </span>
            ))}
          </div>

          <p className="planned-trip-booking-notes">
            <strong>Travel Notes:</strong> {plannedTrip.notes}
          </p>

          <Link to="/" className="planned-trip-booking-back">
            Back to home
          </Link>
        </div>
      </section>

      <section className="booking-section planned-trip-booking-form-section">
        <div className="booking-container">
          <div className="booking-copy">
            <p className="booking-kicker">Reserve This Route</p>
            <h2 className="booking-title">Share your travel details for this planned trip</h2>
            <p className="booking-description">
              We have preloaded the selected plan. Add your pickup details and preferred
              schedule so the team can confirm the trip quickly.
            </p>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <label className="booking-field">
              <span>Selected planned trip</span>
              <input type="text" value={plannedTrip.title} readOnly />
            </label>

            <label className="booking-field">
              <span>Covered route</span>
              <input type="text" value={plannedTrip.route} readOnly />
            </label>

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
              <span>Pickup location</span>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Enter pickup location"
                required
              />
            </label>

            <label className="booking-field">
              <span>Preferred drop location</span>
              <input
                type="text"
                name="dropLocation"
                value={formData.dropLocation}
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
              {isSubmitting ? "Submitting..." : "Request Planned Trip"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
