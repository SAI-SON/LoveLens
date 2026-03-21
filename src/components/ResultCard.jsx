import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getResultEmoji,
  getResultTheme,
  generateLoveMessage,
  generateLoveScore,
  getLevelInfo,
  getTotalCount,
  getDailyProgress,
} from '../utils/flames';

function Confetti() {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const colors = ['#ff2d75', '#a855f7', '#3b82f6', '#f97316', '#22d3ee', '#34d399', '#eab308', '#fb7185'];
    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 1.5,
      size: Math.random() * 8 + 5,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
    setPieces(newPieces);
  }, []);

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.size * 2,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function CelebrationParticles({ theme }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const emojis = theme.particles;
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      top: 50 + Math.random() * 40,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="celebration-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </>
  );
}

export default function ResultCard({
  name1,
  name2,
  result,
  mode,
  onTryAgain,
  onViewHistory,
  onDownload,
}) {
  const [showResult, setShowResult] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [loveScore] = useState(() => generateLoveScore(result));
  const [message] = useState(() => generateLoveMessage(result, mode));
  const [totalCount] = useState(() => getTotalCount());
  const [dailyProgress] = useState(() => getDailyProgress());
  const levelInfo = getLevelInfo(totalCount);
  const theme = getResultTheme(result);
  const emoji = getResultEmoji(result);
  const resultCardRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setShowResult(true), 300);
    
    // Animate score
    const targetScore = loveScore;
    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current >= targetScore) {
        current = targetScore;
        clearInterval(timer);
      }
      setAnimatedScore(current);
    }, 30);

    return () => clearInterval(timer);
  }, [loveScore]);

  const circumference = 2 * Math.PI * 68;
  const offset = circumference - (animatedScore / 100) * circumference;

  const handleDownload = () => {
    if (resultCardRef.current && onDownload) {
      onDownload(resultCardRef.current);
    }
  };

  const handleShare = (platform) => {
    const text = `🔥 FLAMES Result: ${name1} ❤️ ${name2} = ${emoji} ${result}! Love Score: ${loveScore}%\n\nTry it yourself!`;
    const encodedText = encodeURIComponent(text);
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(text).catch(() => {});
      alert('Result copied to clipboard! 📋');
    }
  };

  return (
    <div className="app-container page-enter" style={{ minHeight: '100vh', paddingTop: 80 }}>
      {showResult && <Confetti />}
      {showResult && <CelebrationParticles theme={theme} />}

      <div style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
        {/* Result Header */}
        {showResult && (
          <>
            <div className="scale-in" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: '4rem' }}>{emoji}</span>
            </div>

            <h2
              className="fade-in"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 900,
                background: theme.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 4,
              }}
            >
              {result}!
            </h2>

            <p
              className="fade-in fade-in-delay-1"
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                marginBottom: 32,
              }}
            >
              {name1} ❤️ {name2}
            </p>
          </>
        )}

        {/* Main Card - this is the downloadable card */}
        {showResult && (
          <div
            ref={resultCardRef}
            className="glass-card fade-in fade-in-delay-2"
            style={{ marginBottom: 24, position: 'relative', overflow: 'hidden' }}
          >
            {/* Background accent */}
            <div
              style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: theme.gradient,
                opacity: 0.1,
                filter: 'blur(40px)',
              }}
            />

            {/* Love Score Circle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div className="score-circle">
                <svg viewBox="0 0 160 160">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff2d75" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <circle className="score-track" cx="80" cy="80" r="68" />
                  <circle
                    className="score-progress"
                    cx="80"
                    cy="80"
                    r="68"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>
                <div>
                  <span className="score-value">{animatedScore}%</span>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: -4 }}>
                    Love Score
                  </p>
                </div>
              </div>
            </div>

            {/* AI Message */}
            <div
              style={{
                padding: '16px 20px',
                background: theme.bg,
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${theme.color}22`,
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: theme.color,
                  fontWeight: 600,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                🤖 AI Analysis {mode === 'roast' ? '🔥' : ''}
              </p>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                {message}
              </p>
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              {/* Level */}
              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Your Level
                </p>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {levelInfo.emoji} {levelInfo.level}
                </p>
              </div>

              {/* Daily Challenge */}
              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Daily Challenge
                </p>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  🎯 {Math.min(dailyProgress.count, dailyProgress.goal)}/{dailyProgress.goal}
                </p>
                <div className="progress-bar-container" style={{ marginTop: 6, height: 4 }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min((dailyProgress.count / dailyProgress.goal) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showResult && (
          <div className="fade-in fade-in-delay-3">
            {/* Share Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 20,
                flexWrap: 'wrap',
              }}
            >
              <button
                className="btn-secondary"
                onClick={handleDownload}
                title="Download as Image"
              >
                📥 Download
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleShare('whatsapp')}
                title="Share on WhatsApp"
              >
                📱 WhatsApp
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleShare('twitter')}
                title="Share on Twitter"
              >
                🐦 Tweet
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleShare('copy')}
                title="Copy to clipboard"
              >
                📋 Copy
              </button>
            </div>

            {/* Primary actions */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button className="btn-primary" onClick={onTryAgain}>
                Try Again 🔥
              </button>
              <button className="btn-secondary" onClick={onViewHistory}>
                📜 History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
