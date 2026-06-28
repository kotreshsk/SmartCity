import React, { useState } from 'react';
import { useIssues } from '../hooks/useIssues';
import { issueService } from '../services/issueService';
import IssueCard from '../components/Issues/IssueCard';
import CameraView from '../components/Camera/CameraView';
import PhotoPreview from '../components/Camera/PhotoPreview';
import Button from '../components/Common/Button';
import { storageService } from '../services/storageService';

const Contractor = () => {
  const { issues, loading } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filter issues assigned/relevant to contractors
  const contractorIssues = issues.filter(issue => 
    ['received', 'reviewed', 'under_progress'].includes(issue.status)
  );

  const handleCapture = (blob) => {
    setPhotoBlob(blob);
    setCameraOpen(false);
  };

  const handleSubmitProof = async () => {
    if (!photoBlob || !selectedIssue) return;
    setSubmitting(true);
    try {
      const imagePath = `proofs/\${selectedIssue.id}_\${Date.now()}.jpg`;
      const proofUrl = await storageService.uploadImage(photoBlob, imagePath);
      
      await issueService.resolveIssue(selectedIssue.id, proofUrl);
      
      // Cleanup
      setSelectedIssue(null);
      setPhotoBlob(null);
    } catch (error) {
      console.error(error);
      alert("Failed to submit proof.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-4)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Contractor Portal</h1>
      
      {!selectedIssue ? (
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Assigned Tasks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {contractorIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} onClick={setSelectedIssue} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)' }}>Resolve Issue</h2>
            <button onClick={() => setSelectedIssue(null)} style={{ color: 'var(--neutral-500)' }}>Cancel</button>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: '4px' }}>Original Issue</h3>
              <img src={selectedIssue.image_url} alt="Original" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginBottom: '4px' }}>Resolution Proof</h3>
              {photoBlob ? (
                <div style={{ position: 'relative' }}>
                  <img src={URL.createObjectURL(photoBlob)} alt="Proof" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
                  <button onClick={() => setPhotoBlob(null)} style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 'var(--radius-sm)' }}>Retake</button>
                </div>
              ) : (
                <div 
                  onClick={() => setCameraOpen(true)}
                  style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed var(--neutral-300)' }}
                >
                  <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>+ Take Photo</span>
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={handleSubmitProof} 
            disabled={!photoBlob || submitting} 
            isLoading={submitting}
            style={{ width: '100%' }}
          >
            Submit Resolution
          </Button>
        </div>
      )}

      {cameraOpen && (
        <CameraView onCapture={handleCapture} onClose={() => setCameraOpen(false)} />
      )}
    </div>
  );
};

export default Contractor;
