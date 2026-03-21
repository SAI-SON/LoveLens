import { useState, useCallback, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import AnimatedBackground from './components/AnimatedBackground';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import InputForm from './components/InputForm';
import Loader from './components/Loader';
import FlamesWheel from './components/FlamesWheel';
import ResultCard from './components/ResultCard';
import History from './components/History';
import {
  removeCommonLetters,
  calculateFlames,
  generateLoveScore,
  saveToHistory,
  incrementDaily,
  getLevelInfo,
  getTotalCount,
} from './utils/flames';
import { saveResult } from './services/firestoreService';

export default function App() {
  const { user, userId, loading: authLoading, login, signup, resetPassword, logout } = useAuth();

  // Auth screens: login, signup, forgot
  const [authScreen, setAuthScreen] = useState('login');

  // App screens: home, input, loading, wheel, result, history
  const [screen, setScreen] = useState('home');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [mode, setMode] = useState('normal');
  const [letterData, setLetterData] = useState(null);
  const [flamesResult, setFlamesResult] = useState(null);
  const [loveScore, setLoveScore] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const screenBeforeHistory = useRef('home');

  const navigate = useCallback((to) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(to);
      setTransitioning(false);
    }, 100);
  }, []);

  const handleStart = useCallback(() => {
    navigate('input');
  }, [navigate]);

  const handleAnalyze = useCallback((n1, n2, selectedMode) => {
    setName1(n1);
    setName2(n2);
    setMode(selectedMode);

    const data = removeCommonLetters(n1, n2);
    setLetterData(data);

    const result = calculateFlames(data.remainingCount);
    setFlamesResult(result);

    const score = generateLoveScore(result.result);
    setLoveScore(score);

    navigate('loading');
  }, [navigate]);

  const handleLoadingComplete = useCallback(() => {
    navigate('wheel');
  }, [navigate]);

  const handleWheelComplete = useCallback(() => {
    if (!flamesResult?.result) {
      navigate('result');
      return;
    }

    // Save to localStorage (local backup)
    saveToHistory(name1, name2, flamesResult.result, loveScore);
    incrementDaily();

    // Save to Realtime Database
    if (userId) {
      const savePromise = saveResult(userId, {
        name1,
        name2,
        result: flamesResult.result,
      });

      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(false), 4000);
      });

      Promise.race([savePromise, timeoutPromise])
        .then((saved) => {
          if (!saved) {
            console.error('Failed or timed out while saving FLAMES result to Realtime Database');
          }
        })
        .catch((err) => {
          console.error('Unexpected save error:', err);
        });
    }

    navigate('result');
  }, [navigate, name1, name2, flamesResult, loveScore, userId]);

  const handleTryAgain = useCallback(() => {
    setLetterData(null);
    setFlamesResult(null);
    navigate('input');
  }, [navigate]);

  const handleViewHistory = useCallback(() => {
    screenBeforeHistory.current = screen;
    navigate('history');
  }, [navigate, screen]);

  const handleBackFromHistory = useCallback(() => {
    navigate(screenBeforeHistory.current === 'history' ? 'home' : screenBeforeHistory.current);
  }, [navigate]);

  const handleGoHome = useCallback(() => {
    setLetterData(null);
    setFlamesResult(null);
    navigate('home');
  }, [navigate]);

  const handleDownload = useCallback(async (element) => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0118',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `flames-${name1}-${name2}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, [name1, name2]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setScreen('home');
      setLetterData(null);
      setFlamesResult(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, [logout]);

  // ====== LOADING STATE ======
  if (authLoading) {
    return (
      <>
        <AnimatedBackground />
        <div className="app-container" style={{ minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loader-ring" style={{ margin: '0 auto', marginBottom: 20 }} />
            <p className="subtitle">Loading FLAMES...</p>
          </div>
        </div>
      </>
    );
  }

  // ====== AUTH SCREENS (Not logged in) ======
  if (!user) {
    return (
      <>
        <AnimatedBackground />
        <div
          style={{
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          {authScreen === 'login' && (
            <Login
              onLogin={login}
              onSwitchToSignup={() => setAuthScreen('signup')}
              onSwitchToReset={() => setAuthScreen('forgot')}
            />
          )}
          {authScreen === 'signup' && (
            <Signup
              onSignup={signup}
              onSwitchToLogin={() => setAuthScreen('login')}
            />
          )}
          {authScreen === 'forgot' && (
            <ForgotPassword
              onResetPassword={resetPassword}
              onSwitchToLogin={() => setAuthScreen('login')}
            />
          )}
        </div>
      </>
    );
  }

  // ====== MAIN APP (Logged in) ======
  const totalCount = getTotalCount();
  const levelInfo = getLevelInfo(totalCount);
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

  return (
    <>
      <AnimatedBackground />

      {/* Top Navigation */}
      {screen !== 'home' && (
        <nav className="top-nav">
          <div className="nav-logo" onClick={handleGoHome}>
            <span style={{ fontSize: '1.4rem' }}>🔥</span>
            <span>FLAMES</span>
          </div>
          <div className="nav-actions">
            <div className="level-badge">
              {levelInfo.emoji} {levelInfo.level}
            </div>
            <button
              className="btn-icon"
              onClick={handleViewHistory}
              title="History"
            >
              📜
            </button>
            <button
              className="btn-icon"
              onClick={handleLogout}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </nav>
      )}

      {/* Screen Router */}
      <div
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {screen === 'home' && (
          <Home onStart={handleStart} userName={displayName} onLogout={handleLogout} onViewHistory={handleViewHistory} />
        )}

        {screen === 'input' && (
          <InputForm
            onAnalyze={handleAnalyze}
            onBack={handleGoHome}
          />
        )}

        {screen === 'loading' && letterData && (
          <Loader
            name1Letters={letterData.name1Letters}
            name2Letters={letterData.name2Letters}
            remainingCount={letterData.remainingCount}
            onComplete={handleLoadingComplete}
          />
        )}

        {screen === 'wheel' && flamesResult && (
          <FlamesWheel
            resultIndex={flamesResult.index}
            onSpinComplete={handleWheelComplete}
          />
        )}

        {screen === 'result' && flamesResult && (
          <ResultCard
            name1={name1}
            name2={name2}
            result={flamesResult.result}
            mode={mode}
            onTryAgain={handleTryAgain}
            onViewHistory={handleViewHistory}
            onDownload={handleDownload}
          />
        )}

        {screen === 'history' && (
          <History
            onBack={handleBackFromHistory}
            onTryAgain={handleTryAgain}
          />
        )}
      </div>
    </>
  );
}
