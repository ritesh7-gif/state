import React, { useEffect, useRef } from 'react';
import { ArrowUp, BookOpen, Search, Users, LayoutDashboard, ThumbsUp, ThumbsDown, RotateCcw, Copy, Mic, Plus } from 'lucide-react';
import MessageBubble from './MessageBubble';

const SUGGESTIONS = [
  { id: 'book',     label: 'Book a property',   icon: BookOpen,        action: 'book'     },
  { id: 'search',   label: 'Search inventory',  icon: Search,          action: 'search'   },
  { id: 'customer', label: 'Find customer',      icon: Users,           action: 'customer' },
  { id: 'history',  label: 'Booking history',   icon: LayoutDashboard, action: 'history'  },
];

const EmptyState = ({ onChip }) => (
  <div className="ew-empty-state">
    <div className="ew-empty-chips">
      {SUGGESTIONS.map(({ id, label, icon: Icon, action }) => (
        <button
          key={id}
          id={`chip-${id}`}
          className="ew-chip"
          onClick={() => onChip(action)}
        >
          <Icon size={14} strokeWidth={2} />
          {label}
        </button>
      ))}
    </div>
  </div>
);

const ConversationPane = ({
  messages,
  input,
  setInput,
  handleSend,
  onQuickAction,
  onEditMessage,
  onSelectProperty,
  onConfirmBooking,
  onCancelBooking,
  onViewDetails,
  backendStatus,
}) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const baseTextRef = useRef('');
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = useRef(null);
  const isExplicitStopRef = useRef(false);
  const latestInputRef = useRef('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    latestInputRef.current = input;
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) return;

    setIsListening(true);
    isExplicitStopRef.current = false;

    const baseText = input.trim();
    baseTextRef.current = baseText ? baseText + ' ' : '';
    latestInputRef.current = input;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      // Loop from 0 to capture full history of this recognition session
      for (let i = 0; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      const combined = baseTextRef.current + finalTranscript + interimTranscript;
      setInput(combined);
      latestInputRef.current = combined;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (!isExplicitStopRef.current) {
        // Paused speaking, browser auto-stopped. Save current text and restart.
        baseTextRef.current = latestInputRef.current ? latestInputRef.current.trim() + ' ' : '';
        setTimeout(() => {
          if (!isExplicitStopRef.current) {
            try {
              recognition.start();
            } catch (e) {
              console.error("Speech recognition auto-restart failed:", e);
              setIsListening(false);
            }
          }
        }, 300);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("Speech recognition start failed:", e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    isExplicitStopRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <main className={`ew-conversation${isEmpty ? ' is-empty' : ''}`}>
      {/* Minimal top bar */}
      <div className="ew-conv-topbar">
        <div className="ew-conv-topbar-spacer" />
        <div className={`ew-status-pill ${backendStatus}`}>
          <div className="ew-status-dot" />
          {backendStatus === 'connected'    ? 'Connected' :
           backendStatus === 'disconnected' ? 'Offline'   : 'Connecting'}
        </div>
      </div>

      {/* Spacer 1 (Top) */}
      <div className="ew-conv-flex-spacer" style={{ flexGrow: isEmpty ? 1 : 0 }} />

      {/* Welcome Greeting Header */}
      {isEmpty && (
        <div className="ew-welcome-header-wrapper">
          <h1 className="ew-welcome-title">How can I help you today?</h1>
        </div>
      )}

      {/* Messages List (only rendered when conversation has started) */}
      {!isEmpty && (
        <div className="ew-conv-messages" id="conv-messages">
          <div className="ew-messages-inner">
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onSelectProperty={onSelectProperty}
                onConfirmBooking={onConfirmBooking}
                onCancelBooking={onCancelBooking}
                onQuickAction={onQuickAction}
                onEditMessage={onEditMessage}
                onViewDetails={onViewDetails}
                onAnimationComplete={scrollToBottom}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Centered Input (Middle in welcome state, Bottom in chat view) */}
      <div className="ew-conv-input-area">
        <form className="ew-conv-input-form" onSubmit={handleSend}>
          <div className="ew-conv-input-wrapper">
            <button
              type="button"
              className="ew-conv-plus-btn"
              title="Add attachment"
            >
              <Plus size={20} strokeWidth={2} />
            </button>
            <textarea
              ref={inputRef}
              id="conv-input"
              className="ew-conv-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask RealState..."
              rows={1}
              style={{ maxHeight: '200px', overflowY: 'auto', resize: 'none' }}
            />
            {SpeechRecognition && (
              isListening ? (
                <button
                  type="button"
                  className="ew-conv-mic-btn listening"
                  onClick={stopListening}
                  title="Done speaking"
                >
                  <Mic size={15} className="ew-mic-pulse-icon" strokeWidth={2.5} />
                  <span className="ew-mic-done-label">Done</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="ew-conv-mic-btn"
                  onClick={startListening}
                  title="Use voice input"
                  style={{ marginRight: 4 }}
                >
                  <Mic size={18} strokeWidth={2} />
                </button>
              )
            )}
            <button
              id="conv-send-btn"
              type="submit"
              className="ew-conv-send-btn"
              disabled={!input.trim() || isListening}
            >
              <ArrowUp size={18} strokeWidth={2} />
            </button>
          </div>
        </form>
        {isEmpty ? (
          <div className="ew-empty-chips-wrapper">
            <EmptyState onChip={onQuickAction} />
          </div>
        ) : (
          <div className="ew-conv-input-hint">
            RealState AI can make mistakes. Verify critical information.
          </div>
        )}
      </div>

      {/* Spacer 2 (Bottom) */}
      <div className="ew-conv-flex-spacer" style={{ flexGrow: isEmpty ? 1 : 0 }} />
    </main>
  );
};

export default ConversationPane;
