import React, { useState } from 'react';
import CameraView from '../components/Camera/CameraView';
import PhotoPreview from '../components/Camera/PhotoPreview';
import MapView from '../components/Map/MapView';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Camera, MapPin, AlertCircle } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../hooks/useAuth';
import { issueService } from '../services/issueService';
import { storageService } from '../services/storageService';
import { processIssueImage } from '../services/sorterAI';
import { getRemainingSLAText } from '../services/slaService';

const Report = ({ onNavigate }) => {
  const { user } = useAuth();
  const { location, error: locError } = useGeolocation();
  
  const [step, setStep] = useState(1); // 1: Camera, 2: AI Processing, 3: Form
  const [photoBlob, setPhotoBlob] = useState(null);
  const [aiData, setAiData] = useState(null);
  
  // Form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (location && !selectedLocation) {
      setSelectedLocation(location);
    }
  }, [location, selectedLocation]);

  const handleCapture = (blob) => {
    setPhotoBlob(blob);
  };

  const handleConfirmPhoto = async (blob) => {
    setStep(2);
    try {
      // Analyze with AI
      const analysis = await processIssueImage(blob, location);
      setAiData(analysis);
      setCategory(analysis.category || 'pothole');
      setDescription(analysis.description || '');
      setStep(3);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please fill details manually.");
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!photoBlob || !selectedLocation) {
      setError("Photo and location are required.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // 1. Upload photo
      const imagePath = `issues/\${Date.now()}_original.jpg`;
      const imageUrl = await storageService.uploadImage(photoBlob, imagePath);

      // 2. Create issue
      const issueData = {
        user_id: user.uid,
        image_url: imageUrl,
        image_path: imagePath,
        location: selectedLocation,
        address: aiData?.address || "Selected Location", // Ideally reverse geocode here
        description: description,
        category: category,
        urgency_score: aiData?.urgency_score || 5,
        ai_tags: aiData?.tags || []
      };

      const newIssueId = await issueService.createIssue(issueData);
      
      // Navigate to success or issue detail
      onNavigate(`/issue/\${newIssueId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (step === 1) {
    if (photoBlob) {
      return <PhotoPreview photoBlob={photoBlob} onRetake={() => setPhotoBlob(null)} onConfirm={handleConfirmPhoto} />;
    }
    return <CameraView onCapture={handleCapture} onClose={() => onNavigate('/')} />;
  }

  if (step === 2) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-6)', textAlign: 'center' }}>
        <LoadingSpinner size={48} />
        <h2 style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>Analyzing Image...</h2>
        <p style={{ color: 'var(--neutral-500)' }}>Gemini is categorizing the issue and assessing urgency.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-4)', paddingBottom: '100px' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Review Report</h2>
      
      {error && (
        <div style={{ backgroundColor: 'var(--color-error)', color: 'white', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Image Preview */}
        <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
          <img src={URL.createObjectURL(photoBlob)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button onClick={() => {setPhotoBlob(null); setStep(1);}} style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px 12px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', backdropFilter: 'blur(4px)' }}>
            Retake
          </button>
        </div>

        {/* AI Suggestions (if available) */}
        {aiData && (
          <div style={{ backgroundColor: 'var(--color-primary-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-primary-light)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <AlertCircle size={16} /> AI Assessment
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{aiData.category.replace(/_/g, ' ')}</span>
              <span style={{ fontWeight: 600, color: aiData.urgency_score > 7 ? 'var(--color-error)' : 'inherit' }}>
                Urgency: {aiData.urgency_score}/10
              </span>
            </div>
            {aiData.sla_deadline && (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-700)' }}>
                Estimated SLA: <strong>{getRemainingSLAText(aiData.sla_deadline)}</strong>
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px' }}>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', backgroundColor: 'var(--surface-primary)' }}
            >
              <option value="pothole">Pothole</option>
              <option value="streetlight">Broken Streetlight</option>
              <option value="garbage">Garbage / Dumping</option>
              <option value="water_leak">Water Leak</option>
              <option value="fallen_tree">Fallen Tree</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px' }}>Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about the issue..."
              rows={4}
              style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', backgroundColor: 'var(--surface-primary)', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px', alignItems: 'center', gap: '4px' }}>
              <MapPin size={16} /> Location
            </label>
            <div style={{ height: '150px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--neutral-300)' }}>
              <MapView 
                center={selectedLocation || location || {lat:0, lng:0}} 
                zoom={16}
                isInteractive={true}
                onMapClick={(loc) => setSelectedLocation(loc)}
                markers={selectedLocation ? [{ location: selectedLocation }] : []}
              />
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginTop: '4px' }}>Tap map to adjust location.</p>
          </div>
        </div>

        <Button onClick={handleSubmit} isLoading={loading} size="lg" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
          Submit Report
        </Button>
      </div>
    </div>
  );
};

export default Report;
