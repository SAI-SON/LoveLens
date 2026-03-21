import { useState, useEffect, useRef } from 'react';

const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝', '🌹', '✨', '💫', '🔥'];

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    size: Math.random() * 2 + 1,
  }));
}

function generateHearts(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: hearts[Math.floor(Math.random() * hearts.length)],
    left: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 20,
    size: Math.random() * 1.2 + 0.6,
  }));
}

export default function AnimatedBackground() {
  const [stars] = useState(() => generateStars(50));
  const [floatingHearts] = useState(() => generateHearts(15));

  return (
    <>
      <div className="animated-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="stars">
          {stars.map(star => (
            <div
              key={star.id}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="floating-hearts">
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: `${heart.left}%`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}rem`,
            }}
          >
            {heart.emoji}
          </div>
        ))}
      </div>
    </>
  );
}
