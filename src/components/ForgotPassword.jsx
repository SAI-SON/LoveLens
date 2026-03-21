import { useState } from 'react';

export default function ForgotPassword({ onSwitchToLogin, onResetPassword }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (code) => {
    const messages = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-not-found': 'No account found with this email',
      'auth/too-many-requests': 'Too many attempts. Try again later',
    };
    return messages[code] || 'Failed to send reset email. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onResetPassword(email.trim());
      setSuccess(true);
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
          <span style={{ fontSize: '3rem' }}>🔑</span>
          <h1 className="title-lg" style={{ marginTop: 8 }}>
            Reset Password
          </h1>
          <p className="subtitle" style={{ marginTop: 8 }}>
            We'll send you a link to reset your password
          </p>
        </div>

        {/* Card */}
        <div className="glass-card fade-in fade-in-delay-1">
          {success ? (
            /* Success State */
            <div style={{ padding: '20px 0' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: 16 }}>📬</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12 }}>
                Check Your Email!
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                We've sent a password reset link to
              </p>
              <p style={{
                fontWeight: 600,
                color: 'var(--accent-purple)',
                fontSize: '1rem',
                marginBottom: 24,
                wordBreak: 'break-all',
              }}>
                {email}
              </p>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                marginBottom: 28,
              }}>
                Check your inbox and spam folder. The link will expire in 1 hour.
              </p>
              <button
                className="btn-primary"
                onClick={onSwitchToLogin}
                style={{ width: '100%' }}
              >
                Back to Sign In ❤️
              </button>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  id="reset-email"
                  className="input-field"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  disabled={loading}
                />
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
                id="reset-btn"
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '⏳ Sending...' : 'Send Reset Link 📧'}
              </button>

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
                <span style={{ fontSize: '0.8rem' }}>Remember your password?</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              </div>

              {/* Back to login */}
              <button
                type="button"
                className="btn-secondary"
                onClick={onSwitchToLogin}
                style={{ width: '100%' }}
              >
                Back to Sign In ❤️
              </button>
            </form>
          )}
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
          🔒 Secure password reset powered by Firebase
        </p>
      </div>
    </div>
  );
}
