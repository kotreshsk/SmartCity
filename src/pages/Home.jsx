import React, { useState } from 'react';
import IssueList from '../components/Issues/IssueList';
import FilterBar from '../components/Issues/FilterBar';
import MapView from '../components/Map/MapView';
import { useIssues } from '../hooks/useIssues';
import { useGeolocation } from '../hooks/useGeolocation';
import { Layers, Map as MapIcon } from 'lucide-react';

const Home = ({ onNavigate }) => {
  const { location } = useGeolocation();
  const { issues, loading, error } = useIssues();
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.category === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search & Filter Header */}
      <div style={{ padding: 'var(--space-4)', position: 'sticky', top: '64px', backgroundColor: 'var(--background)', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>Nearby Issues</h2>
          
          <div style={{ display: 'flex', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-lg)', padding: '4px' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', backgroundColor: viewMode === 'list' ? 'var(--surface-primary)' : 'transparent', color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--neutral-500)', boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none' }}
            >
              <Layers size={18} />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', backgroundColor: viewMode === 'map' ? 'var(--surface-primary)' : 'transparent', color: viewMode === 'map' ? 'var(--color-primary)' : 'var(--neutral-500)', boxShadow: viewMode === 'map' ? 'var(--shadow-sm)' : 'none' }}
            >
              <MapIcon size={18} />
            </button>
          </div>
        </div>

        <FilterBar currentFilter={filter} onFilterChange={setFilter} />
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {viewMode === 'list' ? (
          <div style={{ padding: 'var(--space-4)' }}>
            <IssueList 
              issues={filteredIssues} 
              loading={loading} 
              error={error} 
              onIssueClick={(issue) => onNavigate(`/issue/\${issue.id}`)} 
            />
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 200px)' }}>
            <MapView 
              center={location || { lat: 0, lng: 0 }} 
              markers={filteredIssues} 
              onMarkerClick={(issue) => onNavigate(`/issue/\${issue.id}`)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
