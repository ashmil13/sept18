import React, { useEffect, useState } from 'react';

const HeartSvg = ({ className, size = 24, fill = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={fill}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const PetaSvg = ({ className, size = 20, rotate = 0 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{ transform: `rotate(${rotate}deg)` }}
    className={className}
  >
    {/* Rose petal shape: soft droplet curve */}
    <path
      d="M12,2 C17.5,2 21,8.5 19,14 C17,19.5 13.5,22 12,22 C10.5,22 7,19.5 5,14 C3,8.5 6.5,2 12,2 Z"
      fill="url(#petal-grad)"
    />
    <defs>
      <linearGradient id="petal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff4d6d" />
        <stop offset="100%" stopColor="#ff003c" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Decorations() {
  const [hearts, setHearts] = useState([]);
  const [petals, setPetals] = useState([]);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Generate floating hearts
    const heartList = Array.from({ length: 25 }).map((_, i) => ({
      id: `heart-${i}`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 12,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * -15, // Negative delay so some start midway
      opacity: Math.random() * 0.4 + 0.3,
      color: i % 3 === 0 ? '#ff3366' : i % 3 === 1 ? '#ff758f' : '#c31432',
    }));

    // Generate falling rose petals
    const petalList = Array.from({ length: 25 }).map((_, i) => ({
      id: `petal-${i}`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 16 + 12,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * -18,
      rotate: Math.random() * 360,
    }));

    // Generate twinkling sparkles
    const sparkleList = Array.from({ length: 30 }).map((_, i) => ({
      id: `sparkle-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));

    setHearts(heartList);
    setPetals(petalList);
    setSparkles(sparkleList);
  }, []);

  return (
    <div className="particle-container">
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDuration: `${sparkle.duration}s`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}

      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.left,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
            color: heart.color,
          }}
        >
          <HeartSvg size={heart.size} />
        </div>
      ))}

      {/* Falling Rose Petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="falling-petal"
          style={{
            left: petal.left,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <PetaSvg size={petal.size} rotate={petal.rotate} />
        </div>
      ))}
    </div>
  );
}
