import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let watchId;

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
      setLoading(false);
    };

    const handleError = (error) => {
      setError(error.message);
      setLoading(false);
    };

    // Get initial position quickly
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });

    // Watch for updates
    watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000
    });

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Method to force getting current location immediately (e.g. at moment of capture)
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  return { location, error, loading, getCurrentLocation };
};
