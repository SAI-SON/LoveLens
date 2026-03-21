// ===== FLAMES ALGORITHM UTILITIES =====

/**
 * Remove common letters between two names
 * Returns the remaining letters and the list of cancelled letters
 */
export function removeCommonLetters(name1, name2) {
  const n1 = name1.toLowerCase().replace(/[^a-z]/g, '').split('');
  const n2 = name2.toLowerCase().replace(/[^a-z]/g, '').split('');
  
  const cancelled1 = new Array(n1.length).fill(false);
  const cancelled2 = new Array(n2.length).fill(false);
  
  for (let i = 0; i < n1.length; i++) {
    for (let j = 0; j < n2.length; j++) {
      if (!cancelled1[i] && !cancelled2[j] && n1[i] === n2[j]) {
        cancelled1[i] = true;
        cancelled2[j] = true;
        break;
      }
    }
  }
  
  const remaining1 = n1.filter((_, i) => !cancelled1[i]);
  const remaining2 = n2.filter((_, i) => !cancelled2[i]);
  
  return {
    name1Letters: n1.map((letter, i) => ({ letter, cancelled: cancelled1[i] })),
    name2Letters: n2.map((letter, i) => ({ letter, cancelled: cancelled2[i] })),
    remainingCount: remaining1.length + remaining2.length,
    remaining1,
    remaining2,
  };
}

/**
 * Calculate FLAMES result from remaining count
 */
export function calculateFlames(count) {
  if (count === 0) return { result: 'Friends', index: 0 };
  
  const flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  const flamesArr = [...flames];
  
  let idx = 0;
  while (flamesArr.length > 1) {
    idx = (idx + count - 1) % flamesArr.length;
    flamesArr.splice(idx, 1);
    if (idx === flamesArr.length) idx = 0;
  }
  
  const resultMap = {
    F: 'Friends',
    L: 'Lovers',
    A: 'Affection',
    M: 'Marriage',
    E: 'Enemies',
    S: 'Siblings',
  };
  
  return {
    result: resultMap[flamesArr[0]],
    letter: flamesArr[0],
    index: flames.indexOf(flamesArr[0]),
  };
}

/**
 * Get the emoji for a FLAMES result
 */
export function getResultEmoji(result) {
  const emojiMap = {
    Friends: '🤝',
    Lovers: '❤️',
    Affection: '💕',
    Marriage: '💍',
    Enemies: '⚔️',
    Siblings: '👫',
  };
  return emojiMap[result] || '💫';
}

/**
 * Get the color theme for a FLAMES result
 */
export function getResultTheme(result) {
  const themeMap = {
    Friends: {
      gradient: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
      particles: ['💙', '🤗', '✨', '🌟'],
    },
    Lovers: {
      gradient: 'linear-gradient(135deg, #ff2d75, #fb7185)',
      color: '#ff2d75',
      bg: 'rgba(255, 45, 117, 0.12)',
      particles: ['❤️', '💋', '🌹', '💘'],
    },
    Affection: {
      gradient: 'linear-gradient(135deg, #f472b6, #a855f7)',
      color: '#f472b6',
      bg: 'rgba(244, 114, 182, 0.12)',
      particles: ['💕', '💗', '💖', '🦋'],
    },
    Marriage: {
      gradient: 'linear-gradient(135deg, #f97316, #eab308)',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.12)',
      particles: ['💍', '👰', '🎊', '🥂'],
    },
    Enemies: {
      gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      particles: ['⚔️', '🔥', '💥', '⚡'],
    },
    Siblings: {
      gradient: 'linear-gradient(135deg, #34d399, #22d3ee)',
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.12)',
      particles: ['👫', '🏠', '💚', '🌿'],
    },
  };
  return themeMap[result] || themeMap.Friends;
}

/**
 * Generate a love score based on the result
 */
export function generateLoveScore(result) {
  const ranges = {
    Friends: [55, 70],
    Lovers: [85, 99],
    Affection: [75, 90],
    Marriage: [90, 100],
    Enemies: [10, 35],
    Siblings: [45, 65],
  };
  const [min, max] = ranges[result] || [50, 80];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate AI-style love message
 */
export function generateLoveMessage(result, mode = 'normal') {
  const messages = {
    normal: {
      Friends: [
        "You share a beautiful bond of friendship! Your connection is built on trust, mutual respect, and genuine care for each other. 🌟",
        "A friendship that stands the test of time! You both complement each other's strengths and weaknesses perfectly. ✨",
        "Your friendship radiates positive energy! Together, you create a safe space of understanding and support. 💙",
      ],
      Lovers: [
        "Intense romantic chemistry detected! Your emotional wavelengths are perfectly synchronized. The stars align for a passionate connection. 💫",
        "Your love compatibility is off the charts! There's a magnetic pull between you two that's impossible to ignore. 🌹",
        "Deep emotional resonance found! You both share a rare form of intimate connection that many search a lifetime for. ❤️‍🔥",
      ],
      Affection: [
        "There's a warm, tender connection between you two! Your hearts beat in a gentle rhythm of affection and care. 💗",
        "Sweet affection flows naturally between you! This bond has the warmth of a cozy evening and the beauty of a sunrise. 🌸",
        "A beautiful undercurrent of affection exists! Your connection is nurturing, gentle, and full of warmth. 💕",
      ],
      Marriage: [
        "Soulmate-level compatibility detected! 🎊 Your connection transcends the ordinary – you were truly made for each other!",
        "Wedding bells are ringing! Your cosmic alignment suggests a partnership that will stand the test of time. 💍✨",
        "Ultimate compatibility achieved! Your energies merge in perfect harmony, creating an unbreakable bond of love. 🥂",
      ],
      Enemies: [
        "Opposites collide! Your energies create friction, but remember – even diamonds are formed under pressure. 💎",
        "A fiery dynamic detected! While there's tension, this energy can be channeled into growth and understanding. 🔥",
        "Competitive energies at play! Your strong personalities create sparks. Channel this intensity wisely. ⚡",
      ],
      Siblings: [
        "A familial bond detected! You share the comfort and chaos that comes with being like family. 🏡",
        "Sibling-like connection! You bicker, you laugh, you protect each other – the purest form of love. 👫",
        "Family vibes all the way! Your bond has that irreplaceable warmth of growing up together. 💚",
      ],
    },
    roast: {
      Friends: [
        "Friend zone-la poittu azhuthukko da! 💀 Love-ellam unakku illa, tea kadai-la friend-a enjoy pannu machan! 😂",
        "Ore oru varthai: FRIEND. Avanga kalyanathukku nee invitation card print pannum level da nee! 🤣",
        "Enna da ithu? Love-kku try pannitu friend-aayitta? Auto-la poganum, bus-la vandhuruchu maari irukku! 😅💔",
      ],
      Lovers: [
        "Aiyo rama! 😍 Rendu perum lovers-aam! Inga singles laam thoonguvaanga, konjam adjust pannunga da! 🙄❤️",
        "Lovers-aam! Kalyanam pannikko, illa Instagram-la couple photo podaatheenga, singles-ku BP varum da! 😤💘",
        "Ennada ithu? Love match-aam! Neenga rendu perum oru WhatsApp group-la irundha, group name 'Made for Each Other' dhan! 💀❤️‍🔥",
      ],
      Affection: [
        "Affection-aam! Solla maatteenga, kaattuva maatteenga, bus-la seat kuduppaanga maari irukku! Confess pannunga da! 😏",
        "Enna da ithu half-love? Biriyani order pannittu, quarter rice vandha maari irukku! Full-a love pannunga da! 💀",
        "Affection means 'I like you but bayam da'! Oru thairiyam vaangitu poi sollunga machan! 🫣💕",
      ],
      Marriage: [
        "MARRIAGE-AAM! 🚨 Yellarum odi vaanga! Kalyana hall book pannunga! Saapadu-kku biriyani fix pannunga! Ithu confirmed da! 😂💍",
        "Kalyanam fix machan! But first, TV remote-kku yaar own-nu decide pannunga. Adhu dhan real fight! 📺🤣",
        "Algorithm solludhu marriage nu, but un wallet solludhu 'wait pannu da'! 💸 Anyway congrats dosth! 🎊",
      ],
      Enemies: [
        "ENEMIES DA! 💀 Neenga rendu perum oru room-la irundha, TV remote-kku World War 3 start aagum! 🏃‍♂️🔥",
        "Aiyo! Universe-ay oru look pottu 'absolutely NO da' nu solliduchi! Oru 10 feet distance maintain pannunga! ☠️",
        "Unnga compatibility score machine-ay odaichiruchu da... wrong direction-la! Konjam peaceful-a irungala! 😈💥",
      ],
      Siblings: [
        "SIBLINGS-AAM! 😂 Love story start aagurathukku munnadiyay climax da! Nee avanga anna/thangachi maari dhan! 👊",
        "Nee avanga mela crush-aa vachirundha? Cancel da! Universe solludhu 'nee avanga family member dhan'! 🗑️😂",
        "Sibling vibes da! Last piece chicken-kku sandai poduveenga, date-kku poga maatteenga! 🍗💀",
      ],
    },
  };
  
  const modeMessages = messages[mode] || messages.normal;
  const resultMessages = modeMessages[result] || modeMessages.Friends;
  return resultMessages[Math.floor(Math.random() * resultMessages.length)];
}

/**
 * Get FLAMES wheel colors
 */
export function getWheelColors() {
  return [
    { letter: 'F', label: 'Friends', color: '#3b82f6', emoji: '🤝' },
    { letter: 'L', label: 'Lovers', color: '#ff2d75', emoji: '❤️' },
    { letter: 'A', label: 'Affection', color: '#f472b6', emoji: '💕' },
    { letter: 'M', label: 'Marriage', color: '#f97316', emoji: '💍' },
    { letter: 'E', label: 'Enemies', color: '#ef4444', emoji: '⚔️' },
    { letter: 'S', label: 'Siblings', color: '#34d399', emoji: '👫' },
  ];
}

/**
 * Get level info based on total analyses count
 */
export function getLevelInfo(count) {
  if (count >= 50) return { level: 'Love Expert', emoji: '💘', tier: 3 };
  if (count >= 20) return { level: 'Lover', emoji: '💖', tier: 2 };
  return { level: 'Beginner', emoji: '❤️', tier: 1 };
}

/**
 * Get daily challenge progress
 */
export function getDailyProgress() {
  const today = new Date().toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem('flames_daily') || '{}');
  if (stored.date !== today) {
    return { date: today, count: 0, goal: 5 };
  }
  return { ...stored, goal: 5 };
}

/**
 * Increment daily challenge
 */
export function incrementDaily() {
  const today = new Date().toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem('flames_daily') || '{}');
  const progress = stored.date === today ? stored : { date: today, count: 0 };
  progress.count += 1;
  localStorage.setItem('flames_daily', JSON.stringify(progress));
  return { ...progress, goal: 5 };
}

/**
 * Save a result to history
 */
export function saveToHistory(name1, name2, result, score) {
  const history = JSON.parse(localStorage.getItem('flames_history') || '[]');
  history.unshift({
    id: Date.now(),
    name1,
    name2,
    result,
    score,
    timestamp: new Date().toISOString(),
  });
  // Keep only last 50
  if (history.length > 50) history.length = 50;
  localStorage.setItem('flames_history', JSON.stringify(history));
  
  // Update total count
  const total = parseInt(localStorage.getItem('flames_total') || '0', 10) + 1;
  localStorage.setItem('flames_total', total.toString());
  
  return history;
}

/**
 * Get history
 */
export function getHistory() {
  return JSON.parse(localStorage.getItem('flames_history') || '[]');
}

/**
 * Clear history
 */
export function clearHistory() {
  localStorage.removeItem('flames_history');
}

/**
 * Get total analyses count
 */
export function getTotalCount() {
  return parseInt(localStorage.getItem('flames_total') || '0', 10);
}
