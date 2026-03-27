import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [message, setMessage] = useState("");

  const showNotification = useCallback((nextMessage) => {
    setMessage(nextMessage);
  }, []);

  const hideNotification = useCallback(() => {
    setMessage("");
  }, []);

  const value = useMemo(
    () => ({ message, showNotification, hideNotification }),
    [message, showNotification, hideNotification],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }

  return context;
}
