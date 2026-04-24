import { useState } from "react";
import { getApiUrl } from "../lib/api.js";
import { fetchJson } from "../lib/request.js";
import "./AdminPage.css";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function formatScheduleDate(tripDate, boardingTime) {
  if (!tripDate) {
    return "-";
  }

  const scheduleDate = new Date(`${tripDate}T${boardingTime || "00:00"}`);
  return Number.isNaN(scheduleDate.getTime())
    ? `${tripDate} ${boardingTime || ""}`.trim()
    : scheduleDate.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function sortBySchedule(firstRequest, secondRequest) {
  const firstDate = new Date(
    `${firstRequest.tripDate}T${firstRequest.boardingTime || "00:00"}`,
  ).getTime();
  const secondDate = new Date(
    `${secondRequest.tripDate}T${secondRequest.boardingTime || "00:00"}`,
  ).getTime();

  if (Number.isNaN(firstDate) || Number.isNaN(secondDate)) {
    return 0;
  }

  return firstDate - secondDate;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [requests, setRequests] = useState([]);
  const [plannedTripRequests, setPlannedTripRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingKey, setIsUpdatingKey] = useState("");

  const pendingRequests = requests.filter(
    (request) => (request.status || "pending") === "pending",
  );
  const confirmedRequests = [...requests]
    .filter((request) => request.status === "confirmed")
    .sort(sortBySchedule);
  const pendingPlannedTripRequests = plannedTripRequests.filter(
    (request) => (request.status || "pending") === "pending",
  );
  const confirmedPlannedTripRequests = [...plannedTripRequests]
    .filter((request) => request.status === "confirmed")
    .sort(sortBySchedule);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const [tripData, plannedTripData] = await Promise.all([
        fetchJson(getApiUrl("/api/admin/requests"), {
          headers: {
            "x-admin-password": password,
          },
        }),
        fetchJson(getApiUrl("/api/admin/planned-trip-requests"), {
          headers: {
            "x-admin-password": password,
          },
        }),
      ]);

      setRequests(tripData.requests || []);
      setPlannedTripRequests(plannedTripData.requests || []);
      setIsLoggedIn(true);
    } catch (requestError) {
      setIsLoggedIn(false);
      setRequests([]);
      setPlannedTripRequests([]);
      setError(requestError.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (requestType, requestId, status) => {
    setError("");
    setIsUpdatingKey(`${requestType}:${requestId}`);

    const basePath =
      requestType === "planned"
        ? `/api/admin/planned-trip-requests/${requestId}/status`
        : `/api/admin/requests/${requestId}/status`;

    try {
      const data = await fetchJson(getApiUrl(basePath), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ status }),
      });

      if (requestType === "planned") {
        setPlannedTripRequests((currentRequests) =>
          currentRequests.map((request) =>
            request._id === requestId ? data.request : request,
          ),
        );
      } else {
        setRequests((currentRequests) =>
          currentRequests.map((request) =>
            request._id === requestId ? data.request : request,
          ),
        );
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to update request.");
    } finally {
      setIsUpdatingKey("");
    }
  };

  const handleDoneTrip = async (requestType, requestId) => {
    setError("");
    setIsUpdatingKey(`${requestType}:${requestId}`);

    const basePath =
      requestType === "planned"
        ? `/api/admin/planned-trip-requests/${requestId}`
        : `/api/admin/requests/${requestId}`;

    try {
      await fetchJson(getApiUrl(basePath), {
        method: "DELETE",
        headers: {
          "x-admin-password": password,
        },
      });

      if (requestType === "planned") {
        setPlannedTripRequests((currentRequests) =>
          currentRequests.filter((request) => request._id !== requestId),
        );
      } else {
        setRequests((currentRequests) =>
          currentRequests.filter((request) => request._id !== requestId),
        );
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to remove completed trip.");
    } finally {
      setIsUpdatingKey("");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="admin-kicker">Admin Panel</p>
        <h1 className="admin-title">Trip Requests</h1>

        {!isLoggedIn ? (
          <form className="admin-login-form" onSubmit={handleLogin}>
            <label className="admin-field">
              <span>Admin password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                required
              />
            </label>

            {error ? <p className="admin-error">{error}</p> : null}

            <button type="submit" className="admin-submit" disabled={isLoading}>
              {isLoading ? "Checking..." : "Login"}
            </button>
          </form>
        ) : (
          <div className="admin-requests">
            <div className="admin-toolbar">
              <div>
                <p className="admin-count">{pendingRequests.length} pending standard request(s)</p>
                <p className="admin-count">{confirmedRequests.length} confirmed standard trip(s)</p>
                <p className="admin-count">
                  {pendingPlannedTripRequests.length} pending planned trip request(s)
                </p>
                <p className="admin-count">
                  {confirmedPlannedTripRequests.length} confirmed planned trip(s)
                </p>
              </div>
              <button
                type="button"
                className="admin-logout"
                onClick={() => {
                  setIsLoggedIn(false);
                  setPassword("");
                  setRequests([]);
                  setPlannedTripRequests([]);
                  setError("");
                }}
              >
                Logout
              </button>
            </div>

            {error ? <p className="admin-error">{error}</p> : null}

            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Pending Standard Requests</h2>
                <p>Review each regular booking request and confirm or reject it.</p>
              </div>

              {pendingRequests.length === 0 ? (
                <p className="admin-empty">No pending trip requests right now.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Route</th>
                        <th>Schedule</th>
                        <th>Map Link</th>
                        <th>Requested At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((request) => (
                        <tr key={request._id}>
                          <td>
                            <strong>{request.customerName}</strong>
                            <div className="admin-cell-subtext">{request.email}</div>
                          </td>
                          <td>{request.mobileNumber}</td>
                          <td>
                            <div>{request.source}</div>
                            <div className="admin-cell-subtext">to {request.destination}</div>
                          </td>
                          <td>{formatScheduleDate(request.tripDate, request.boardingTime)}</td>
                          <td>
                            {request.addressMapLink ? (
                              <a
                                className="admin-link"
                                href={request.addressMapLink}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open map
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>{formatDate(request.createdAt)}</td>
                          <td>
                            <div className="admin-actions">
                              <button
                                type="button"
                                className="admin-action admin-action-confirm"
                                disabled={isUpdatingKey === `standard:${request._id}`}
                                onClick={() =>
                                  handleStatusUpdate("standard", request._id, "confirmed")
                                }
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                className="admin-action admin-action-reject"
                                disabled={isUpdatingKey === `standard:${request._id}`}
                                onClick={() =>
                                  handleStatusUpdate("standard", request._id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Confirmed Standard Schedule</h2>
                <p>Accepted regular bookings are arranged by trip date and boarding time.</p>
              </div>

              {confirmedRequests.length === 0 ? (
                <p className="admin-empty">No confirmed trips yet.</p>
              ) : (
                <div className="admin-schedule-list">
                  {confirmedRequests.map((request) => (
                    <article key={request._id} className="admin-schedule-card">
                      <div className="admin-schedule-top">
                        <div>
                          <h3>{request.customerName}</h3>
                          <p>{request.mobileNumber}</p>
                          <p>{request.email}</p>
                        </div>
                        <div className="admin-schedule-badge">Confirmed</div>
                      </div>
                      <p className="admin-schedule-line">
                        <strong>Route:</strong> {request.source} to {request.destination}
                      </p>
                      <p className="admin-schedule-line">
                        <strong>Departure:</strong>{" "}
                        {formatScheduleDate(request.tripDate, request.boardingTime)}
                      </p>
                      {request.addressMapLink ? (
                        <p className="admin-schedule-line">
                          <strong>Map:</strong>{" "}
                          <a
                            className="admin-link"
                            href={request.addressMapLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open Google Maps link
                          </a>
                        </p>
                      ) : null}
                      <button
                        type="button"
                        className="admin-action admin-action-done"
                        disabled={isUpdatingKey === `standard:${request._id}`}
                        onClick={() => handleDoneTrip("standard", request._id)}
                      >
                        Done Trip
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Pending Planned Trip Requests</h2>
                <p>Review requests that came from the planned trip popup and booking page.</p>
              </div>

              {pendingPlannedTripRequests.length === 0 ? (
                <p className="admin-empty">No pending planned trip requests right now.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Trip</th>
                        <th>Pickup / Drop</th>
                        <th>Schedule</th>
                        <th>Map Link</th>
                        <th>Requested At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPlannedTripRequests.map((request) => (
                        <tr key={request._id}>
                          <td>
                            <strong>{request.customerName}</strong>
                            <div className="admin-cell-subtext">{request.email}</div>
                          </td>
                          <td>{request.mobileNumber}</td>
                          <td>
                            <div>{request.tripTitle}</div>
                            <div className="admin-cell-subtext">{request.tripDuration}</div>
                          </td>
                          <td>
                            <div>{request.pickupLocation}</div>
                            <div className="admin-cell-subtext">to {request.dropLocation}</div>
                          </td>
                          <td>{formatScheduleDate(request.tripDate, request.boardingTime)}</td>
                          <td>
                            {request.addressMapLink ? (
                              <a
                                className="admin-link"
                                href={request.addressMapLink}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open map
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>{formatDate(request.createdAt)}</td>
                          <td>
                            <div className="admin-actions">
                              <button
                                type="button"
                                className="admin-action admin-action-confirm"
                                disabled={isUpdatingKey === `planned:${request._id}`}
                                onClick={() =>
                                  handleStatusUpdate("planned", request._id, "confirmed")
                                }
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                className="admin-action admin-action-reject"
                                disabled={isUpdatingKey === `planned:${request._id}`}
                                onClick={() =>
                                  handleStatusUpdate("planned", request._id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Planned Trip Schedule</h2>
                <p>Accepted planned trip requests arranged by trip date and boarding time.</p>
              </div>

              {confirmedPlannedTripRequests.length === 0 ? (
                <p className="admin-empty">No confirmed planned trips yet.</p>
              ) : (
                <div className="admin-schedule-list">
                  {confirmedPlannedTripRequests.map((request) => (
                    <article key={request._id} className="admin-schedule-card">
                      <div className="admin-schedule-top">
                        <div>
                          <h3>{request.tripTitle}</h3>
                          <p>{request.customerName}</p>
                          <p>{request.mobileNumber}</p>
                        </div>
                        <div className="admin-schedule-badge">Confirmed</div>
                      </div>
                      <p className="admin-schedule-line">
                        <strong>Traveler:</strong> {request.email}
                      </p>
                      <p className="admin-schedule-line">
                        <strong>Pickup / Drop:</strong> {request.pickupLocation} to{" "}
                        {request.dropLocation}
                      </p>
                      <p className="admin-schedule-line">
                        <strong>Planned Route:</strong> {request.tripRoute}
                      </p>
                      <p className="admin-schedule-line">
                        <strong>Departure:</strong>{" "}
                        {formatScheduleDate(request.tripDate, request.boardingTime)}
                      </p>
                      {request.addressMapLink ? (
                        <p className="admin-schedule-line">
                          <strong>Map:</strong>{" "}
                          <a
                            className="admin-link"
                            href={request.addressMapLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open Google Maps link
                          </a>
                        </p>
                      ) : null}
                      <button
                        type="button"
                        className="admin-action admin-action-done"
                        disabled={isUpdatingKey === `planned:${request._id}`}
                        onClick={() => handleDoneTrip("planned", request._id)}
                      >
                        Done Trip
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
