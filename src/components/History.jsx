import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHistoryFromFirestore, deleteHistoryItem, clearHistoryFromFirestore } from '../services/firestoreService';
import { getHistory as getLocalHistory, clearHistory as clearLocalHistory, getResultEmoji, getResultTheme } from '../utils/flames';

export default function History({ onBack, onTryAgain }) {
  const { userId, authError } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const useFirestore = userId && !authError;

  useEffect(() => {
    setLoading(true);
    if (useFirestore) {
      // Load from Firestore
      getHistoryFromFirestore(userId)
        .then((data) => setHistory(data))
        .finally(() => setLoading(false));
    } else {
      // Fallback to localStorage
      setHistory(getLocalHistory());
      setLoading(false);
    }
  }, [userId, useFirestore]);

  const handleDelete = async (docId) => {
    if (useFirestore) {
      setDeletingId(docId);
      const success = await deleteHistoryItem(userId, docId);
      if (success) {
        setHistory((prev) => prev.filter((item) => item.id !== docId));
      }
      setDeletingId(null);
    } else {
      // localStorage doesn't support individual delete, remove from state
      setHistory((prev) => prev.filter((item) => item.id !== docId));
    }
  };

  const handleClear = async () => {
    if (useFirestore) {
      const success = await clearHistoryFromFirestore(userId);
      if (success) setHistory([]);
    } else {
      clearLocalHistory();
      setHistory([]);
    }
    setShowConfirm(false);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="app-container page-enter" style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: '2.5rem' }}>📜</span>
          <h2 className="title-lg" style={{ marginTop: 8 }}>
            Analysis History
          </h2>
          <p className="subtitle" style={{ marginTop: 8 }}>
            Your past relationship analyses
          </p>
          {!useFirestore && (
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', marginTop: 8 }}>
              ⚠️ Using local storage (enable Firebase Auth for cloud sync)
            </p>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="loader-ring" style={{ margin: '0 auto', marginBottom: 20 }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          /* Empty state */
          <div
            className="glass-card"
            style={{
              textAlign: 'center',
              padding: '60px 40px',
            }}
          >
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>
              🫙
            </span>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              No analyses yet. Start your first one!
            </p>
            <button className="btn-primary" onClick={onTryAgain}>
              Start Analyzing ❤️
            </button>
          </div>
        ) : (
          /* History List */
          <div className="glass-card" style={{ padding: '20px' }}>
            {/* Top bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                padding: '0 4px',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {history.length} result{history.length > 1 ? 's' : ''}
              </span>
              {!showConfirm ? (
                <button
                  className="btn-icon"
                  onClick={() => setShowConfirm(true)}
                  title="Clear history"
                  style={{ fontSize: '0.9rem', width: 'auto', padding: '6px 14px', gap: 6, display: 'flex', alignItems: 'center' }}
                >
                  🗑️ Clear All
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-red)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      fontFamily: 'var(--font-primary)',
                    }}
                    onClick={handleClear}
                  >
                    Confirm 🗑️
                  </button>
                  <button
                    style={{
                      padding: '6px 14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-primary)',
                    }}
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((item) => {
                const theme = getResultTheme(item.result);
                return (
                  <div key={item.id} className="history-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {getResultEmoji(item.result)}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: '0.92rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.name1} ❤️ {item.name2}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            background: theme.bg,
                            color: theme.color,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: `1px solid ${theme.color}33`,
                          }}
                        >
                          {item.result}
                        </span>
                        {item.score && (
                          <p
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              marginTop: 4,
                            }}
                          >
                            {item.score}%
                          </p>
                        )}
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        title="Delete"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: deletingId === item.id ? 'wait' : 'pointer',
                          fontSize: '1rem',
                          opacity: deletingId === item.id ? 0.4 : 0.6,
                          transition: 'opacity 0.2s',
                          padding: '4px',
                          color: 'var(--text-secondary)',
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => e.target.style.opacity = 0.6}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button className="btn-secondary" onClick={onBack}>
            ← Back
          </button>
          <button className="btn-primary" onClick={onTryAgain}>
            New Analysis 🔥
          </button>
        </div>
      </div>
    </div>
  );
}
