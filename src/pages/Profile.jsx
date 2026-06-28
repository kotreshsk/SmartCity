import React from 'react';
import ProfileSettings from '../components/Auth/ProfileSettings';
import BadgeDisplay from '../components/Gamification/BadgeDisplay';
import Certificate from '../components/Gamification/Certificate';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  // In a real app, these would come from a user stats service
  const mockStats = {
    reportsCount: 12,
    verifiedCount: 5,
    earnedBadges: ['first_blood', 'civic_hero', 'eagle_eye']
  };

  return (
    <div style={{ padding: 'var(--space-4)' }}>
      
      {/* Gamification Section */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Your Impact</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{mockStats.reportsCount}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>Issues Reported</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-success)' }}>{mockStats.verifiedCount}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>Resolutions Verified</div>
          </div>
        </div>

        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Badges Earned</h3>
        <BadgeDisplay earnedBadgeIds={mockStats.earnedBadges} />
      </div>

      {/* Certificate Section (only if they have enough impact) */}
      {mockStats.reportsCount > 10 && (
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <Certificate 
            userName={user?.displayName || user?.email} 
            reportsCount={mockStats.reportsCount} 
            verifiedCount={mockStats.verifiedCount} 
          />
        </div>
      )}

      {/* Settings Section */}
      <ProfileSettings />

    </div>
  );
};

export default Profile;
