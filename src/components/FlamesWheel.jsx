import { useState, useEffect, useRef } from 'react';
import { getWheelColors } from '../utils/flames';

export default function FlamesWheel({ resultIndex, onSpinComplete }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const hasStarted = useRef(false);
  const hasCompleted = useRef(false);
  const segments = getWheelColors();
  const segmentAngle = 360 / segments.length;

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const safeIndex = Number.isFinite(resultIndex)
      ? Math.max(0, Math.min(segments.length - 1, resultIndex))
      : 0;

    // Calculate the target rotation so the pointer lands on the correct segment
    // The pointer is at the top (12 o'clock)
    // Segment 0 starts at 0 degrees (right), so we need to offset
    const targetSegmentCenter = safeIndex * segmentAngle + segmentAngle / 2;
    // We want the pointer (top = 270 degrees in standard terms, or -90 from right)
    // Since SVG 0 is at 3 o'clock, the top is at -90 degrees
    // The wheel rotates clockwise, pointer is at top
    // To land on segment `resultIndex`, the center of that segment needs to be at top (270°)
    const targetAngle = 360 - targetSegmentCenter + 270;
    const totalRotation = 360 * 5 + (targetAngle % 360); // 5 full spins + target
    
    const finishSpin = () => {
      if (hasCompleted.current) return;
      hasCompleted.current = true;
      setSpinning(false);
      onSpinComplete?.();
    };

    setSpinning(true);
    
    // Use requestAnimationFrame for smooth spinning
    const startTime = performance.now();
    const duration = 4000; // 4 seconds
    
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      setRotation(easedProgress * totalRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(finishSpin, 600);
      }
    }

    // Fallback: always continue even if animation frames are interrupted.
    const forceCompleteTimer = setTimeout(finishSpin, duration + 1500);
    requestAnimationFrame(animate);

    return () => {
      clearTimeout(forceCompleteTimer);
    };
  }, [resultIndex, segmentAngle, segments.length, onSpinComplete]);

  const radius = 140;
  const cx = 160;
  const cy = 160;

  function getSegmentPath(index) {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    
    const largeArc = segmentAngle > 180 ? 1 : 0;
    
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

  function getLabelPosition(index) {
    const angle = ((index * segmentAngle + segmentAngle / 2) - 90) * (Math.PI / 180);
    const labelR = radius * 0.65;
    return {
      x: cx + labelR * Math.cos(angle),
      y: cy + labelR * Math.sin(angle),
    };
  }

  return (
    <div className="app-container page-enter" style={{ minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="title-lg fade-in" style={{ marginBottom: 8 }}>
          Spinning the Wheel
        </h2>
        <p className="subtitle fade-in fade-in-delay-1" style={{ marginBottom: 40 }}>
          Your destiny awaits...
        </p>

        <div className="wheel-container fade-in fade-in-delay-2">
          {/* Pointer */}
          <div className="wheel-pointer">▼</div>
          
          {/* Wheel SVG */}
          <svg
            className="wheel-svg"
            viewBox="0 0 320 320"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'none' : 'transform 0.3s ease',
            }}
          >
            {/* Outer glow */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Segments */}
            {segments.map((seg, i) => (
              <g key={seg.letter}>
                <path
                  d={getSegmentPath(i)}
                  fill={seg.color}
                  fillOpacity={0.85}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                />
                {/* Emoji */}
                <text
                  x={getLabelPosition(i).x}
                  y={getLabelPosition(i).y - 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="22"
                >
                  {seg.emoji}
                </text>
                {/* Letter */}
                <text
                  x={getLabelPosition(i).x}
                  y={getLabelPosition(i).y + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontWeight="800"
                  fontSize="18"
                  fontFamily="Outfit, sans-serif"
                >
                  {seg.letter}
                </text>
              </g>
            ))}

            {/* Center circle */}
            <circle cx={cx} cy={cy} r="28" fill="#0a0118" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="20">
              🔥
            </text>
          </svg>
        </div>

        {spinning && (
          <p
            style={{
              marginTop: 24,
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          >
            ✨ The wheel is deciding your fate...
          </p>
        )}
      </div>
    </div>
  );
}
