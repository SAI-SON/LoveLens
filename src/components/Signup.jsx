import { useState } from 'react';

export default function Signup({ onSwitchToLogin, onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getErrorMessage = (code) => {
    const messages = {
      'auth/email-already-in-use': 'An account already exists with this email',
      'auth/invalid-email': 'Invalid email address',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/operation-not-allowed': 'Email/Password sign up is not enabled',
      'auth/too-many-requests': 'Too many attempts. Try again later',
    };
    return messages[code] || 'Sign up failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await onSignup(email.trim(), password, name.trim());
      onSwitchToLogin();
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    if (password.length < 6) return { level: 1, text: 'Weak', color: 'var(--accent-red)' };
    if (password.length < 10) return { level: 2, text: 'Medium', color: 'var(--accent-orange)' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: 4, text: 'Strong', color: 'var(--accent-green)' };
    }
    return { level: 3, text: 'Good', color: 'var(--accent-cyan)' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="app-container" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: 36 }}>
          <span style={{ fontSize: '3rem' }}>💫</span>
          <h1 className="title-lg" style={{ marginTop: 8 }}>
            Create Account
          </h1>
          <p className="subtitle" style={{ marginTop: 8 }}>
            Join FLAMES and discover your destiny
          </p>
        </div>

        {/* Signup Card */}
        <div className="glass-card fade-in fade-in-delay-1">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                id="signup-name"
                className="input-field"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                autoComplete="name"
                disabled={loading}
                maxLength={30}
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                id="signup-email"
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
                id="signup-password"
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="new-password"
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

            {/* Password strength */}
            {password && (
              <div style={{ marginTop: -16, marginBottom: 20, padding: '0 4px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        background: i <= strength.level ? strength.color : 'var(--border-subtle)',
                        transition: 'background 0.3s ease',
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: '0.7rem', color: strength.color, textAlign: 'right', fontWeight: 600 }}>
                  {strength.text}
                </p>
              </div>
            )}

            {/* Confirm Password */}
            <div className="input-group">
              <span className="input-icon">🔐</span>
              <input
                id="signup-confirm"
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            {/* Password match indicator */}
            {confirmPassword && (
              <p style={{
                fontSize: '0.75rem',
                marginTop: -16,
                marginBottom: 16,
                fontWeight: 500,
                color: password === confirmPassword ? 'var(--accent-green)' : 'var(--accent-red)',
              }}>
                {password === confirmPassword ? '✅ Passwords match' : '❌ Passwords don\'t match'}
              </p>
            )}

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
              id="signup-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Creating Account...' : 'Sign Up 🚀'}
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
            <span style={{ fontSize: '0.8rem' }}>Already have an account?</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {/* Login link */}
          <button
            type="button"
            className="btn-secondary"
            onClick={onSwitchToLogin}
            style={{ width: '100%' }}
          >
            Sign In ❤️
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
