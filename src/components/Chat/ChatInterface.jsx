import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import QuickReplies from './QuickReplies';
import { processChatMessage } from '../../services/chatAssistantAI';
import { Send, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ChatInterface = ({ context = null, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: "Hi! I'm your SmartCity assistant. How can I help you today?",
      isUser: false,
      timestamp: Date.now(),
      quickReplies: ["How do I report an issue?", "Check my report status", "What issues are common?"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now()
    };
    
    // Clear quick replies from previous message if any
    setMessages(prev => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && !lastMsg.isUser) {
        return [...prev.slice(0, -1), { ...lastMsg, quickReplies: [] }, userMsg];
      }
      return [...prev, userMsg];
    });
    
    setInputValue('');
    setIsTyping(true);

    try {
      // Build history for context
      const history = messages.map(m => ({
        role: m.isUser ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // In real implementation, we'd pass location/issues if relevant
      const response = await processChatMessage(text, history, { role: user?.role });
      
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        isUser: false,
        timestamp: Date.now(),
        quickReplies: response.suggested_actions
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: '600px',
    backgroundColor: 'var(--surface-primary)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)'
  };

  return (
    <div style={containerStyle}>
      <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>Civic Assistant</h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>● Online</span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: 'var(--neutral-500)' }}>Close</button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            <MessageBubble message={msg} isUser={msg.isUser} />
            {msg.quickReplies && !msg.isUser && msg === messages[messages.length - 1] && (
              <QuickReplies replies={msg.quickReplies} onSelect={handleSend} />
            )}
          </React.Fragment>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', padding: 'var(--space-3)', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-xl)', borderBottomLeftRadius: '4px', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader size={16} className="animate-spin" />
            <span style={{ fontSize: 'var(--text-sm)' }}>Typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--neutral-200)', backgroundColor: 'var(--surface-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-lg)', padding: '4px' }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            style={{ 
              flex: 1, 
              border: 'none', 
              backgroundColor: 'transparent', 
              padding: '12px 16px', 
              resize: 'none', 
              outline: 'none',
              minHeight: '48px',
              maxHeight: '120px'
            }}
            rows={1}
          />
          <button 
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            style={{ 
              padding: '12px', 
              backgroundColor: inputValue.trim() ? 'var(--color-primary)' : 'var(--neutral-300)', 
              color: 'white', 
              borderRadius: 'var(--radius-md)',
              margin: '4px',
              transition: 'background-color var(--transition-fast)'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
