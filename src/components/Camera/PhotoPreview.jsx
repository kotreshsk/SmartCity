import React from 'react';
import Button from '../Common/Button';
import { Check, X } from 'lucide-react';

const PhotoPreview = ({ photoBlob, onRetake, onConfirm, loading = false }) => {
  const photoUrl = React.useMemo(() => {
    return photoBlob ? URL.createObjectURL(photoBlob) : null;
  }, [photoBlob]);

  // Clean up object URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  if (!photoBlob) return null;

  const containerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#000',
    zIndex: 'var(--z-modal)',
    display: 'flex',
    flexDirection: 'column'
  };

  const controlsStyle = {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 'var(--space-6)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
    gap: 'var(--space-4)'
  };

  return (
    <div style={containerStyle}>
      <img 
        src={photoUrl} 
        alt="Preview" 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />

      <div style={controlsStyle}>
        <Button 
          variant="outline" 
          onClick={onRetake} 
          disabled={loading}
          style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
        >
          <X size={20} style={{ marginRight: '8px' }} />
          Retake
        </Button>
        <Button 
          onClick={() => onConfirm(photoBlob)} 
          isLoading={loading}
          style={{ flex: 1 }}
        >
          {!loading && <Check size={20} style={{ marginRight: '8px' }} />}
          Use Photo
        </Button>
      </div>
    </div>
  );
};

export default PhotoPreview;
