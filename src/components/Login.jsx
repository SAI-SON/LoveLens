import { useState } from 'react';

export default function Login({ onSwitchToSignup, onSwitchToReset, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getErrorMessage = (code) => {
    const messages = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/too-many-requests': 'Too many attempts. Try again later',
    };
    return messages[code] || 'Login failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: 36 }}>
          <span style={{ fontSize: '3rem' }}>🔥</span>
          <h1 className="title-lg" style={{ marginTop: 8 }}>
            Welcome Back
          </h1>
          <p className="subtitle" style={{ marginTop: 8 }}>
            Sign in to continue your love journey
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card fade-in fade-in-delay-1">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                id="login-email"
                className="input-field"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="input-group" style={{ position: 'relative' }}>
              <span className="input-icon">🔒</span>
              <input
                id="login-password"
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                disabled={loading}
                style={{ paddingRight: 52 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  zIndex: 2,
                  opacity: 0.6,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginTop: -12, marginBottom: 20 }}>
              <button
                type="button"
                onClick={onSwitchToReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-purple)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 500,
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <p style={{
                color: 'var(--accent-red)',
                fontSize: '0.85rem',
                marginBottom: 16,
                fontWeight: 500,
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}>
                ⚠️ {error}
              </p>
            )}

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Signing in...' : 'Sign In ❤️'}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '28px 0',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.8rem' }}>New here?</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {/* Sign up link */}
          <button
            type="button"
            className="btn-secondary"
            onClick={onSwitchToSignup}
            style={{ width: '100%' }}
          >
            Create Account 🚀
          </button>
        </div>

        {/* Footer */}
        <p
          className="fade-in fade-in-delay-2"
          style={{
            marginTop: 32,
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          🔒 Your data is securely stored with Firebase
        </p>
      </div>
    </div>
  );
}
