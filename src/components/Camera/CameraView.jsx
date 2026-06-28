import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';

const CameraView = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const { stream, error, isInitializing, startCamera, stopCamera } = useCamera();
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    startCamera(facingMode);
    return () => stopCamera();
  }, [facingMode]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw current frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob
    canvas.toBlob((blob) => {
      onCapture(blob);
    }, 'image/jpeg', 0.8); // 80% quality for size optimization
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const containerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#000',
    zIndex: 'var(--z-modal)',
    display: 'flex',
    flexDirection: 'column'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    padding: 'var(--space-4)',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 10
  };

  const controlsStyle = {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 'var(--space-8)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    zIndex: 10
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}>
        <button onClick={onClose} style={{ color: 'white', padding: '8px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '50%' }}>
          <X size={24} />
        </button>
      </div>

      {isInitializing && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
          Initializing camera...
        </div>
      )}

      {error && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--color-error)', backgroundColor: 'rgba(255,255,255,0.9)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      <div style={controlsStyle}>
        <div style={{ width: '48px' }} /> {/* Spacer */}
        
        <button 
          onClick={handleCapture}
          disabled={!stream}
          style={{ 
            width: '72px', height: '72px', 
            borderRadius: '50%', 
            border: '4px solid white',
            backgroundColor: 'rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: stream ? 1 : 0.5
          }}
        >
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'white' }} />
        </button>

        <button onClick={toggleCamera} style={{ color: 'white', padding: '12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
          <RefreshCw size={24} />
        </button>
      </div>
    </div>
  );
};

export default CameraView;
