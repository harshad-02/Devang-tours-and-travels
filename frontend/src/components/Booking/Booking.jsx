import { useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "../../context/NotificationContext.jsx";
import "./Booking.css";

const LEAFLET_SCRIPT_ID = "leaflet-script";
const LEAFLET_STYLE_ID = "leaflet-style";
const DEFAULT_CENTER = [20.5937, 78.9629];

function loadLeaflet() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet can only load in the browser."));
  }

  if (window.L) {
    return Promise.resolve(window.L);
  }

  if (!document.getElementById(LEAFLET_STYLE_ID)) {
    const link = document.createElement("link");
    link.id = LEAFLET_STYLE_ID;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }

  const existingScript = document.getElementById(LEAFLET_SCRIPT_ID);

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(window.L), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Leaflet.")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = LEAFLET_SCRIPT_ID;
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Failed to load Leaflet."));
    document.body.appendChild(script);
  });
}

async function searchLocations(query) {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmedQuery,
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "in",
    limit: "5",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Location search failed.");
  }

  const results = await response.json();

  return results.map((item) => ({
    id: item.place_id,
    label: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon),
  }));
}

function LocationSearchField({
  label,
  name,
  value,
  suggestions,
  loading,
  onChange,
  onSelect,
  onBlur,
}) {
  return (
    <label className="booking-field booking-search-field">
      <span>{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={`Search ${label.toLowerCase()} in India`}
        autoComplete="off"
        required
      />
      {loading && <span className="booking-search-note">Searching locations...</span>}
      {!loading && suggestions.length > 0 && (
        <div className="booking-suggestions" role="listbox">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="booking-suggestion-item"
              onMouseDown={() => onSelect(suggestion)}
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}
    </label>
  );
}

export default function Booking() {
  const { showNotification } = useNotification();
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({ boarding: null, drop: null });
  const [mapStatus, setMapStatus] = useState("loading");
  const [activeField, setActiveField] = useState("");
  const [boardingSuggestions, setBoardingSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [boardingLoading, setBoardingLoading] = useState(false);
  const [dropLoading, setDropLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState({
    boardingPoint: null,
    dropPoint: null,
  });
  const [formData, setFormData] = useState({
    boardingPoint: "",
    dropPoint: "",
    tripDate: minDate,
  });

  useEffect(() => {
    let isMounted = true;

    loadLeaflet()
      .then((L) => {
        if (!isMounted || mapRef.current || !mapElementRef.current) {
          return;
        }

        mapRef.current = L.map(mapElementRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
        }).setView(DEFAULT_CENTER, 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        setMapStatus("ready");
      })
      .catch(() => {
        if (isMounted) {
          setMapStatus("error");
        }
      });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapStatus !== "ready") {
      return;
    }

    const L = window.L;

    if (selectedLocations.boardingPoint) {
      if (!markersRef.current.boarding) {
        markersRef.current.boarding = L.marker([
          selectedLocations.boardingPoint.lat,
          selectedLocations.boardingPoint.lon,
        ]).addTo(mapRef.current);
      } else {
        markersRef.current.boarding.setLatLng([
          selectedLocations.boardingPoint.lat,
          selectedLocations.boardingPoint.lon,
        ]);
      }
      markersRef.current.boarding.bindPopup("Boarding point");
    } else if (markersRef.current.boarding) {
      mapRef.current.removeLayer(markersRef.current.boarding);
      markersRef.current.boarding = null;
    }

    if (selectedLocations.dropPoint) {
      if (!markersRef.current.drop) {
        markersRef.current.drop = L.marker([
          selectedLocations.dropPoint.lat,
          selectedLocations.dropPoint.lon,
        ]).addTo(mapRef.current);
      } else {
        markersRef.current.drop.setLatLng([
          selectedLocations.dropPoint.lat,
          selectedLocations.dropPoint.lon,
        ]);
      }
      markersRef.current.drop.bindPopup("Drop point");
    } else if (markersRef.current.drop) {
      mapRef.current.removeLayer(markersRef.current.drop);
      markersRef.current.drop = null;
    }

    const points = [selectedLocations.boardingPoint, selectedLocations.dropPoint].filter(Boolean);

    if (points.length === 2) {
      const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lon]));
      mapRef.current.fitBounds(bounds.pad(0.3));
    } else if (points.length === 1) {
      mapRef.current.setView([points[0].lat, points[0].lon], 11);
    } else {
      mapRef.current.setView(DEFAULT_CENTER, 5);
    }
  }, [selectedLocations, mapStatus]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (activeField !== "boardingPoint") {
        return;
      }

      const query = formData.boardingPoint.trim();

      if (query.length < 3) {
        setBoardingSuggestions([]);
        return;
      }

      try {
        setBoardingLoading(true);
        const results = await searchLocations(query);
        setBoardingSuggestions(results);
      } catch {
        setBoardingSuggestions([]);
      } finally {
        setBoardingLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [formData.boardingPoint, activeField]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (activeField !== "dropPoint") {
        return;
      }

      const query = formData.dropPoint.trim();

      if (query.length < 3) {
        setDropSuggestions([]);
        return;
      }

      try {
        setDropLoading(true);
        const results = await searchLocations(query);
        setDropSuggestions(results);
      } catch {
        setDropSuggestions([]);
      } finally {
        setDropLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [formData.dropPoint, activeField]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setActiveField(name);
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "boardingPoint") {
      setSelectedLocations((current) => ({ ...current, boardingPoint: null }));
    }

    if (name === "dropPoint") {
      setSelectedLocations((current) => ({ ...current, dropPoint: null }));
    }
  };

  const handleSelectLocation = (fieldName, suggestion) => {
    setFormData((current) => ({
      ...current,
      [fieldName]: suggestion.label,
    }));
    setSelectedLocations((current) => ({
      ...current,
      [fieldName]: suggestion,
    }));

    if (fieldName === "boardingPoint") {
      setBoardingSuggestions([]);
    }

    if (fieldName === "dropPoint") {
      setDropSuggestions([]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedLocations.boardingPoint || !selectedLocations.dropPoint) {
      return;
    }

    showNotification(
      "Your trip request was submitted successfully. We will contact you soon for confirmation.",
    );
  };

  return (
    <section className="booking-section" id="booking">
      <div className="booking-container">
        <div className="booking-copy">
          <p className="booking-kicker">Plan Your Ride</p>
          <h2 className="booking-title">Raise a trip request in a few quick steps</h2>
          <p className="booking-description">
            Search your boarding point and destination across India, preview both
            locations on the map, then send your trip request.
          </p>
          <p className="booking-maps-status">
            {mapStatus === "loading" && "Loading the free map view..."}
            {mapStatus === "ready" &&
              "Free map search is ready. Select a location from the suggestions for better accuracy."}
            {mapStatus === "error" &&
              "The map could not load right now, but location search and booking still work."}
          </p>

          <div className="booking-map-panel">
            <div className="booking-map" ref={mapElementRef} aria-label="Selected trip locations map" />
            <div className="booking-distance-card">
              <p className="booking-distance-label">Selected Stops</p>
              <p className="booking-distance-value booking-distance-text">
                {selectedLocations.boardingPoint && selectedLocations.dropPoint
                  ? "Boarding and drop points selected"
                  : "Choose both locations"}
              </p>
              <p className="booking-route-status">
                Powered by OpenStreetMap search for India-wide locations.
              </p>
            </div>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <LocationSearchField
            label="Boarding point"
            name="boardingPoint"
            value={formData.boardingPoint}
            suggestions={boardingSuggestions}
            loading={boardingLoading}
            onChange={handleChange}
            onSelect={(suggestion) => handleSelectLocation("boardingPoint", suggestion)}
            onBlur={() => window.setTimeout(() => setBoardingSuggestions([]), 120)}
          />

          <LocationSearchField
            label="Drop point"
            name="dropPoint"
            value={formData.dropPoint}
            suggestions={dropSuggestions}
            loading={dropLoading}
            onChange={handleChange}
            onSelect={(suggestion) => handleSelectLocation("dropPoint", suggestion)}
            onBlur={() => window.setTimeout(() => setDropSuggestions([]), 120)}
          />

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

          <button type="submit" className="booking-submit">
            Raise Trip Request
          </button>
        </form>
      </div>
    </section>
  );
}
