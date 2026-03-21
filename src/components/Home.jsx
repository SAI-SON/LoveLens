import { useState, useEffect, useRef } from 'react';

export default function Home({ onStart, userName, onLogout, onViewHistory }) {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Discover your relationship destiny...';
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (indexRef.current <= fullText.length) {
        setTypedText(fullText.slice(0, indexRef.current));
        indexRef.current++;
      } else {
        indexRef.current = 0;
        setTypedText('');
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '100vh' }}>
      {/* Top right actions on home */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 20,
          display: 'flex',
          gap: 8,
          zIndex: 50,
        }}
      >
        <button className="btn-icon" onClick={onViewHistory} title="History">
          📜
        </button>
        <button className="btn-icon" onClick={onLogout} title="Logout">
          🚪
        </button>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 700 }}>
        {/* Welcome */}
        {userName && (
          <p
            className="fade-in"
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              marginBottom: 12,
            }}
          >
            Hey, <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>{userName}</span> 👋
          </p>
        )}

        {/* Main Title */}
        <div className="fade-in" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '3.5rem' }}>🔥</span>
        </div>

        <h1 className="title-xl fade-in fade-in-delay-1">
          FLAMES
        </h1>

        <p className="title-accent fade-in fade-in-delay-2" style={{ marginTop: 4, marginBottom: 20 }}>
          AI Love Analyzer
        </p>

        {/* Typing subtitle */}
        <p className="subtitle fade-in fade-in-delay-2" style={{ marginBottom: 48, minHeight: '1.8em' }}>
          <span className="typing-text">{typedText}</span>
        </p>

        {/* Feature badges */}
        <div
          className="fade-in fade-in-delay-3"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 48,
          }}
        >
          {[
            { icon: '🎯', text: 'FLAMES Algorithm' },
            { icon: '🎡', text: 'Spin Wheel' },
            { icon: '🤖', text: 'AI Predictions' },
            { icon: '🔥', text: 'Roast Mode' },
          ].map((badge) => (
            <span
              key={badge.text}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
            >
              {badge.icon} {badge.text}
            </span>
          ))}
        </div>

        {/* Start Button */}
        <div className="fade-in fade-in-delay-4">
          <button
            id="start-test-btn"
            className="btn-primary pulse"
            onClick={onStart}
            style={{ fontSize: '1.2rem', padding: '18px 56px' }}
          >
            Start Test ❤️
          </button>
        </div>

        {/* Bottom text */}
        <p
          className="fade-in fade-in-delay-4"
          style={{
            marginTop: 40,
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          ✨ Over 10,000+ love analyses performed
        </p>
      </div>
    </div>
  );
}
