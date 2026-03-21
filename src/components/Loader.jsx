import { useState, useEffect } from 'react';

const STEPS = [
  { icon: '🔤', text: 'Analyzing letters...' },
  { icon: '✂️', text: 'Cancelling common letters...' },
  { icon: '🔢', text: 'Counting remaining letters...' },
  { icon: '🎯', text: 'Running FLAMES algorithm...' },
  { icon: '🎡', text: 'Spinning the wheel of destiny...' },
  { icon: '✨', text: 'Generating your result...' },
];

export default function Loader({ name1Letters, name2Letters, remainingCount, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showLetters, setShowLetters] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    // Step 0: show right away
    const timers = [];

    timers.push(setTimeout(() => {
      setShowLetters(true);
      setCurrentStep(1);
    }, 800));

    timers.push(setTimeout(() => {
      setCurrentStep(2);
      setShowCount(true);
    }, 2500));

    // Animate count
    timers.push(setTimeout(() => {
      let c = 0;
      const interval = setInterval(() => {
        c++;
        setAnimatedCount(c);
        if (c >= remainingCount) {
          clearInterval(interval);
        }
      }, 80);
      timers.push(interval);
    }, 2600));

    timers.push(setTimeout(() => setCurrentStep(3), 3500));
    timers.push(setTimeout(() => setCurrentStep(4), 4200));
    timers.push(setTimeout(() => setCurrentStep(5), 4800));
    timers.push(setTimeout(() => onComplete(), 5500));

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className="app-container page-enter" style={{ minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', maxWidth: 540 }}>
        {/* Step Indicator */}
        <div className="step-indicator" style={{ marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`step-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Current step text */}
        <div
          style={{
            marginBottom: 40,
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>
            {STEPS[currentStep]?.icon}
          </span>
          <p className="subtitle" style={{ fontWeight: 500, fontSize: '1.1rem' }}>
            {STEPS[currentStep]?.text}
          </p>
        </div>

        {/* Letter boxes */}
        {showLetters && (
          <div className="glass-card fade-in" style={{ marginBottom: 24 }}>
            {/* Name 1 Letters */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Name 1
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {name1Letters.map((item, i) => (
                  <span
                    key={i}
                    className={`letter-box ${item.cancelled ? 'cancelled' : 'active'}`}
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      transition: `all 0.4s ease ${i * 0.05}s`,
                    }}
                  >
                    {item.letter.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Name 2 Letters */}
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Name 2
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {name2Letters.map((item, i) => (
                  <span
                    key={i}
                    className={`letter-box ${item.cancelled ? 'cancelled' : 'active'}`}
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      transition: `all 0.4s ease ${(name1Letters.length + i) * 0.05}s`,
                    }}
                  >
                    {item.letter.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Remaining count */}
        {showCount && (
          <div className="fade-in" style={{ marginBottom: 32 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
              Remaining Letters Count
            </p>
            <span
              style={{
                fontSize: '3rem',
                fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {animatedCount}
            </span>
          </div>
        )}

        {/* Spinner */}
        <div className="loader-ring" style={{ margin: '0 auto' }} />
      </div>
    </div>
  );
}
