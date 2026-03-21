import { useState } from 'react';

export default function InputForm({ onAnalyze, onBack }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [mode, setMode] = useState('normal');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName1 = name1.trim();
    const cleanName2 = name2.trim();

    if (!cleanName1 || !cleanName2) {
      setError('Please enter both names!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (cleanName1.toLowerCase() === cleanName2.toLowerCase()) {
      setError("Names can't be the same! 😅");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(cleanName1) || !/^[a-zA-Z\s]+$/.test(cleanName2)) {
      setError('Please enter valid names (letters only)');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setError('');
    onAnalyze(cleanName1, cleanName2, mode);
  };

  return (
    <div className="app-container page-enter" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <span style={{ fontSize: '2.5rem' }}>💌</span>
          <h2 className="title-lg" style={{ marginTop: 8 }}>
            Enter Your Names
          </h2>
          <p className="subtitle" style={{ marginTop: 8 }}>
            Let the magic of FLAMES reveal your destiny
          </p>
        </div>

        {/* Form Card */}
        <div
          className="glass-card"
          style={{
            animation: shake ? 'shake 0.5s ease' : undefined,
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Name 1 */}
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                id="name1-input"
                className="input-field"
                type="text"
                placeholder="First person's name"
                value={name1}
                onChange={(e) => {
                  setName1(e.target.value);
                  setError('');
                }}
                autoComplete="off"
                maxLength={30}
              />
            </div>

            {/* Heart divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                margin: '8px 0 24px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '1.5rem' }}>❤️</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            {/* Name 2 */}
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                id="name2-input"
                className="input-field"
                type="text"
                placeholder="Second person's name"
                value={name2}
                onChange={(e) => {
                  setName2(e.target.value);
                  setError('');
                }}
                autoComplete="off"
                maxLength={30}
              />
            </div>

            {/* Error message */}
            {error && (
              <p
                style={{
                  color: 'var(--accent-red)',
                  fontSize: '0.85rem',
                  marginTop: -8,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                ⚠️ {error}
              </p>
            )}

            {/* Mode Toggle */}
            <div style={{ marginBottom: 28 }}>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                }}
              >
                Choose Your Vibe
              </p>
              <div className="mode-toggle" style={{ justifyContent: 'center' }}>
                <button
                  type="button"
                  className={`mode-btn ${mode === 'normal' ? 'active' : ''}`}
                  onClick={() => setMode('normal')}
                >
                  😇 Normal
                </button>
                <button
                  type="button"
                  className={`mode-btn ${mode === 'roast' ? 'active' : ''}`}
                  onClick={() => setMode('roast')}
                >
                  🔥 Roast
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="analyze-btn"
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Analyze ❤️
            </button>
          </form>
        </div>

        {/* Back button */}
        <button
          className="btn-secondary"
          onClick={onBack}
          style={{ marginTop: 20 }}
        >
          ← Back
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
