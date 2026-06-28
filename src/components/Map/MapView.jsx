import React, { useEffect, useRef, useState } from 'react';
import { initGoogleMaps } from '../../config/maps';

const MapView = ({ center = { lat: 0, lng: 0 }, zoom = 14, markers = [], onMarkerClick, onMapClick, isInteractive = true }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef([]);

  useEffect(() => {
    let isMounted = true;
    const initMap = async () => {
      try {
        await initGoogleMaps();
        if (isMounted) setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
      }
    };
    initMap();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && !map && center.lat !== 0) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        disableDefaultUI: true, // cleaner interface
        gestureHandling: isInteractive ? 'auto' : 'none',
        styles: [
          // Simplified style for modern look
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
      });

      if (onMapClick && isInteractive) {
        newMap.addListener('click', (e) => {
          onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
      }

      setMap(newMap);
    }
  }, [isLoaded, mapRef, map, center, zoom, isInteractive]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach(item => {
      if (!item.location || typeof item.location.lat !== 'number') return;
      
      // Determine color based on status/urgency (mock implementation)
      const color = item.is_overdue ? '#EF4444' : '#3B82F6';
      
      const marker = new window.google.maps.Marker({
        position: item.location,
        map,
        title: item.category || 'Issue',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
          scale: 8
        }
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(item));
      }

      markersRef.current.push(marker);
    });

  }, [map, markers]);

  // Update center if it changes significantly (e.g. tracking user location)
  useEffect(() => {
    if (map && center && center.lat !== 0) {
      map.panTo(center);
    }
  }, [map, center]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'var(--surface-secondary)', 
        borderRadius: 'inherit' 
      }} 
    />
  );
};

export default MapView;
