import { createContext, useCallback, useContext, useMemo, useState } from "react";

const PlannedTripPopupContext = createContext(null);

export function PlannedTripPopupProvider({ children }) {
  const [activeTrip, setActiveTrip] = useState(null);

  const showTripPopup = useCallback((trip) => {
    setActiveTrip(trip);
  }, []);

  const hideTripPopup = useCallback(() => {
    setActiveTrip(null);
  }, []);

  const value = useMemo(
    () => ({ activeTrip, showTripPopup, hideTripPopup }),
    [activeTrip, showTripPopup, hideTripPopup],
  );

  return (
    <PlannedTripPopupContext.Provider value={value}>
      {children}
    </PlannedTripPopupContext.Provider>
  );
}

export function usePlannedTripPopup() {
  const context = useContext(PlannedTripPopupContext);

  if (!context) {
    throw new Error("usePlannedTripPopup must be used within a PlannedTripPopupProvider");
  }

  return context;
}
