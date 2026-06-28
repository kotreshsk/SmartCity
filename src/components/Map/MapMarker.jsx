import React from 'react';

// Placeholder for custom map marker if we were using a react wrapper 
// but we're using vanilla Maps API in MapView, so this is mostly for UI overlays
const MapMarker = ({ type, count }) => {
  return (
    <div style={{
      width: '32px', height: '32px',
      borderRadius: '50%',
      backgroundColor: type === 'urgent' ? 'var(--color-error)' : 'var(--color-primary)',
      border: '2px solid white',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: 'var(--text-xs)'
    }}>
      {count || 1}
    </div>
  );
};

export default MapMarker;
