import React, { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import ChatInterface from '../Chat/ChatInterface';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AppLayout = ({ children, currentPath, onNavigate }) => {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Layout wrapper that handles padding for fixed elements
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
      <Header />
      
      <main style={{ flex: 1, paddingBottom: user ? '80px' : '0' }}>
        {children}
      </main>

      {user && <BottomNav currentPath={currentPath} onNavigate={onNavigate} userRole={user.role} />}

      {/* Floating Chat Button */}
      {user && !isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '100px', // above bottom nav
            right: 'var(--space-4)',
            zIndex: 'var(--z-fixed)',
            width: '56px', height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Assistant Overlay */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: 'var(--space-4)',
          width: 'calc(100vw - 32px)',
          maxWidth: '380px',
          height: '500px',
          maxHeight: 'calc(100vh - 120px)',
          zIndex: 'var(--z-modal)',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <ChatInterface onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default AppLayout;
