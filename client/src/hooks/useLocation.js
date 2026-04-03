import { useState, useEffect } from "react";

// Hook to request and expose current location. Returns {coords, error, permissionGranted}
export default function useLocation(opts = { enableHighAccuracy: false }) {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      // schedule to avoid sync setState in effect body
      setTimeout(() => setError(new Error("Geolocation not supported")), 0);
      return;
    }

    const onSuccess = (pos) => {
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      setPermissionGranted(true);
    };

    const onErr = (e) => {
      setError(e);
      setPermissionGranted(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onErr, opts);
  }, [opts]);

  return { coords, error, permissionGranted };
}
