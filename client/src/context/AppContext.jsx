import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);

  // keep last known coordinates in context and persist to localStorage
  const [coords, setCoords] = useState(() => {
    try {
      const raw = localStorage.getItem("coords");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (coords) localStorage.setItem("coords", JSON.stringify(coords));
      else localStorage.removeItem("coords");
    } catch {
      // ignore localStorage failures
    }
  }, [coords]);

  return (
    <AppContext.Provider value={{ phone, setPhone, user, setUser, coords, setCoords }}>
      {children}
    </AppContext.Provider>
  );
};