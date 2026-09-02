import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ChevronDown, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const GiftBow = ({ size = 80 }) => (
  <svg viewBox="0 0 100 60" width={size} height={size * 0.6} className="drop-shadow-md select-none pointer-events-none">
    <defs>
      <linearGradient id="goldBowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff8db" />
        <stop offset="30%" stopColor="#ffd700" />
        <stop offset="70%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#aa7c11" />
      </linearGradient>
    </defs>
    {/* Left Loop */}
    <path d="M 50 35 C 10 5, 2 28, 50 35 Z" fill="url(#goldBowGrad)" stroke="#aa7c11" strokeWidth="0.5" />
    <path d="M 50 35 C 20 12, 12 25, 45 32 Z" fill="#fff8db" opacity="0.3" />

    {/* Right Loop */}
    <path d="M 50 35 C 90 5, 98 28, 50 35 Z" fill="url(#goldBowGrad)" stroke="#aa7c11" strokeWidth="0.5" />
    <path d="M 50 35 C 80 12, 88 25, 55 32 Z" fill="#fff8db" opacity="0.3" />

    {/* Left Ribbon Tail */}
    <path d="M 45 35 C 35 48, 25 55, 15 58 L 22 45 Z" fill="url(#goldBowGrad)" stroke="#aa7c11" strokeWidth="0.5" />
    
    {/* Right Ribbon Tail */}
    <path d="M 55 35 C 65 48, 75 55, 85 58 L 78 45 Z" fill="url(#goldBowGrad)" stroke="#aa7c11" strokeWidth="0.5" />

    {/* Center Knot */}
    <circle cx="50" cy="35" r="9" fill="url(#goldBowGrad)" stroke="#aa7c11" strokeWidth="1" />
    <circle cx="48" cy="32" r="3" fill="#ffffff" opacity="0.4" />
  </svg>
);

export default function Hero({ photos }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Unboxing & Shake states
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isHoveredLocal, setIsHoveredLocal] = useState(false);

  // Calculate target date (Next September 18)
  const getTargetDate = () => {
    const now = new Date();
    let targetYear = now.getFullYear();
    let targetDate = new Date(`September 18, ${targetYear} 00:00:00`);
    if (now > targetDate) {
      targetYear += 1;
      targetDate = new Date(`September 18, ${targetYear} 00:00:00`);
    }
    return targetDate;
  };

  // Slideshow effect
  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 5000); // Change photo every 5 seconds
    return () => clearInterval(interval);
  }, [photos]);

  // Countdown timer
  useEffect(() => {
    const target = getTargetDate();

    const updateTimer = () => {
      const difference = +target - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleUnwrap = () => {
    if (isBoxOpen || isUnwrapping) return;
    setIsUnwrapping(true);

    // After unboxing sequence reaches climax, shake screen & trigger confetti
    setTimeout(() => {
      setIsShaking(true);
      setIsBoxOpen(true);
      setIsUnwrapping(false);

      // Trigger Confetti
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0.6,
        decay: 0.94,
        startVelocity: 35,
        colors: ['#ff3366', '#ffd700', '#ff80a0', '#ffffff', '#e5a93b']
      };
      
      confetti({
        ...defaults,
        particleCount: 160,
        scalar: 1.2,
        shapes: ['circle']
      });

      confetti({
        ...defaults,
        particleCount: 80,
        scalar: 0.8,
        shapes: ['star']
      });

      // Stop shake animation after 600ms
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }, 850);
  };

  const scrollToNext = () => {
    const nextSection = document.getElementById('memories');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative h-screen w-full flex flex-col justify-center items-center overflow-hidden ${isShaking ? 'shake-effect' : ''}`}>
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {photos.length > 0 ? (
            <motion.div
              key={currentPhotoIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.55, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${photos[currentPhotoIndex]})` }}
            />
          ) : (
            // Romantic fallback gradient with subtle scaling
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute inset-0 bg-gradient-to-tr from-pink-900 via-purple-950 to-red-950"
            />
          )}
        </AnimatePresence>
        {/* Dark Overlay vignette to ensure legibility */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--deep-purple), transparent, rgba(0,0,0,0.5))' }} />
      </div>

      <AnimatePresence mode="wait">
        {!isBoxOpen ? (
          /* Giant Beating Gift Box Surprise Visual */
          <motion.div
            key="wrapped-gift-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            whileHover={!isUnwrapping ? {
              scale: 1.05,
              rotate: [0, -3, 3, -3, 3, 0],
              transition: { duration: 0.5, ease: 'easeInOut' }
            } : {}}
            onMouseEnter={() => setIsHoveredLocal(true)}
            onMouseLeave={() => setIsHoveredLocal(false)}
            onClick={handleUnwrap}
            className="custom-gift-box-wrapper"
          >
            {/* Backlight glow */}
            <motion.div
              className="custom-gift-box-glow"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Floating hover hearts */}
            {isHoveredLocal && !isUnwrapping && (
              <div className="absolute top-0 pointer-events-none overflow-visible z-30" style={{ height: '1px', width: '1px' }}>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: -20 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0.5, 1.3, 0.8],
                      x: [(Math.random() - 0.5) * 100],
                      y: [-120 - Math.random() * 80],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeOut'
                    }}
                    className="absolute text-pink-500"
                    style={{ left: '-10px' }}
                  >
                    <Heart fill="currentColor" size={12 + Math.random() * 8} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Sparkles around box */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-300"
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                  }}
                  animate={{
                    scale: [0.5, 1.2, 0.5],
                    opacity: [0.2, 0.9, 0.2]
                  }}
                  transition={{
                    duration: 1.5 + Math.random() * 1.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>

            {/* Box Lid */}
            <motion.div
              animate={isUnwrapping ? {
                y: -250,
                x: -80,
                rotate: -60,
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.8, ease: "easeOut" }
              } : {
                y: [0, -4, 0]
              }}
              transition={isUnwrapping ? {} : {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="custom-gift-box-lid"
            >
              {/* 3D Glossy overlays */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/20 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-10" />
              
              {/* Horizontal Ribbon on Lid */}
              <div className="custom-gift-box-ribbon-v" style={{ height: '100%', top: 0 }} />
              
              {/* Bow on Lid */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
                <GiftBow size={85} />
              </div>
            </motion.div>

            {/* Box Body */}
            <motion.div
              animate={isUnwrapping ? {
                y: 180,
                scale: 0.9,
                opacity: 0,
                transition: { duration: 0.7, ease: "easeIn" }
              } : {
                y: [0, 4, 0]
              }}
              transition={isUnwrapping ? {} : {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="custom-gift-box-body"
            >
              {/* 3D Glossy shading */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/20 to-transparent pointer-events-none z-20" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-20" />

              {/* Ribbon Vertical Body */}
              <div className="custom-gift-box-ribbon-v" />
              
              {/* Ribbon Horizontal Body */}
              <div className="custom-gift-box-ribbon-h" />
              
              {/* Pulsing center icon */}
              <div className="custom-gift-box-icon-container animate-bounce">
                <Gift size={36} className="text-yellow-400" />
              </div>
            </motion.div>
            
            <span className="custom-gift-box-label animate-pulse">
              Tap to Open Your Surprise 🎁
            </span>
          </motion.div>
        ) : (
          /* Main Glassmorphic Hero Greeting Card */
          <motion.div
            key="greeting-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.25 }}
            className="relative z-10 text-center max-w-3xl px-6 py-10 mx-4 glass-card gold-border flex flex-col justify-center items-center shadow-glow-gold"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="mb-4 text-pink-500 flex justify-center items-center gap-1"
            >
              <Heart fill="#ff3366" className="text-pink-500 animate-pulse" size={28} />
              <Sparkles className="text-yellow-400" size={24} />
              <Heart fill="#ff3366" className="text-pink-500 animate-pulse" size={28} />
            </motion.div>

            {/* Cursive Name/Surprise Title */}
            <h1 className="fancy-title romantic-gradient-text leading-tight mb-2 tracking-wide">
              Happy 18th Golden Birthday, Bubusai!
            </h1>
            
            <p className="text-sm md:text-base tracking-widest text-pink-200-90 font-medium uppercase mb-3">
              Welcome, my lovely wife Bubusai ❤️
            </p>

            <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-6 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-1 select-none">
              ✨ Turning 18 Years My Woman ✨
            </p>

            {/* Countdown Box Container */}
            <div className="flex flex-col items-center w-full">
              <p className="text-xs text-yellow-300 font-medium uppercase tracking-wider mb-4 flex items-center gap-1-5">
                <Sparkles size={14} /> Countdown to September 18th <Sparkles size={14} />
              </p>

              <div className="flex justify-center gap-3 w-full max-w-lg" style={{ gap: '15px' }}>
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-black-40 border border-white-10 shadow-inner"
                  >
                    <span className="text-xl md:text-3xl font-semibold text-white font-mono tracking-tight">
                      {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-pink-300 capitalize mt-1 font-light tracking-wider">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sparkly sub-message */}
            <p className="text-xs md:text-sm italic text-white-80 mt-6 max-w-md font-light leading-relaxed">
              "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Scroll Indicator - only visible after box is open */}
      {isBoxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={scrollToNext}
          className="absolute bottom-8 z-10 flex flex-col items-center cursor-pointer text-pink-400 hover:text-yellow-400 transition-colors duration-300"
        >
          <span className="text-xs uppercase tracking-widest font-light mb-1.5">Our Story</span>
          <ChevronDown size={20} className="animate-bounce" />
        </motion.div>
      )}

      {/* Custom CSS styles */}
      <style>{`
        @keyframes shake-screen {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-6px, -6px) rotate(-1deg); }
          20% { transform: translate(6px, 4px) rotate(1deg); }
          30% { transform: translate(-6px, 6px) rotate(0deg); }
          40% { transform: translate(6px, -4px) rotate(1deg); }
          50% { transform: translate(-3px, 6px) rotate(-1deg); }
          60% { transform: translate(3px, 3px) rotate(0deg); }
          70% { transform: translate(-3px, -3px) rotate(1deg); }
          80% { transform: translate(3px, -6px) rotate(-1deg); }
          90% { transform: translate(-3px, 3px) rotate(0deg); }
        }

        .shake-effect {
          animation: shake-screen 0.6s cubic-bezier(.36,.07,.19,.97) both;
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Premium custom gift box styling */
        .custom-gift-box-wrapper {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          width: 280px;
          height: 280px;
        }

        .custom-gift-box-glow {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, rgba(219, 39, 119, 0.1) 70%, transparent 100%);
          filter: blur(25px);
          z-index: 0;
          pointer-events: none;
        }

        .custom-gift-box-lid {
          width: 236px;
          height: 56px;
          background: linear-gradient(135deg, #ff4d6d 0%, #ff0a54 40%, #c9184a 80%, #800f2f 100%);
          border-radius: 10px 10px 4px 4px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.35), inset 0 2px 2px rgba(255,255,255,0.4);
          z-index: 20;
          position: relative;
          border: 1px solid rgba(255, 77, 109, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .custom-gift-box-body {
          width: 216px;
          height: 172px;
          background: linear-gradient(135deg, #ff0a54 0%, #c9184a 50%, #800f2f 100%);
          border-radius: 0 0 16px 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.45), inset 0 2px 2px rgba(255,255,255,0.2);
          position: relative;
          z-index: 10;
          border: 1px solid rgba(201, 24, 74, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .custom-gift-box-ribbon-v {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 100%;
          background: linear-gradient(to right, #ffd700 0%, #fff8db 30%, #ffd700 70%, #d4af37 100%);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
          z-index: 5;
        }

        .custom-gift-box-ribbon-h {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          height: 36px;
          background: linear-gradient(to bottom, #ffd700 0%, #fff8db 30%, #ffd700 70%, #d4af37 100%);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
          z-index: 5;
        }

        .custom-gift-box-icon-container {
          z-index: 15;
          background: rgba(15, 2, 21, 0.65);
          padding: 14px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 215, 0, 0.45);
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.4);
        }

        .custom-gift-box-label {
          position: absolute;
          bottom: -40px;
          font-size: 0.75rem;
          color: #fde047;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          background-color: rgba(0, 0, 0, 0.6);
          padding: 6px 16px;
          border-radius: 9999px;
          border: 1px solid rgba(236, 72, 153, 0.3);
          backdrop-filter: blur(4px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          z-index: 20;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
