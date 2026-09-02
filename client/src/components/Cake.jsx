import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Cake({ triggerCelebrate }) {
  const videos = [
    { title: 'Birthday Video 🎂', url: '/photos/5_6269120499318527082.mp4' },
    { title: 'Romantic Love Video 💖', url: '/photos/VID-20250817-WA0015.mp4' }
  ];
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const [candles, setCandles] = useState([
    { id: 1, isLit: false, left: '10%' },
    { id: 2, isLit: false, left: '26%' },
    { id: 3, isLit: false, left: '42%' },
    { id: 4, isLit: false, left: '58%' },
    { id: 5, isLit: false, left: '74%' },
    { id: 6, isLit: false, left: '90%' },
  ]);
  
  const [candlesWereLit, setCandlesWereLit] = useState(false);
  const [isCut, setIsCut] = useState(false);

  const litCount = candles.filter((c) => c.isLit).length;
  const allLit = litCount === candles.length;
  const allBlownOut = candlesWereLit && litCount === 0;

  // Track if candles have all been lit at least once
  useEffect(() => {
    if (allLit) {
      setCandlesWereLit(true);
      // Nice sparkles burst when all are lit
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.65 },
        colors: ['#ffd700', '#ff3366', '#ffffff']
      });
    }
  }, [allLit]);

  const toggleCandle = (id, e) => {
    e.stopPropagation();
    if (isCut) return; // Can't light candles after cutting the cake!
    
    setCandles((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextLit = !c.isLit;
          if (nextLit) {
            // Little sparkle when lit
            confetti({
              particleCount: 12,
              spread: 20,
              origin: { y: 0.6 },
              colors: ['#ffd700', '#ff80a0']
            });
          }
          return { ...c, isLit: nextLit };
        }
        return c;
      })
    );
  };

  const lightAll = () => {
    if (isCut) return;
    setCandles((prev) => prev.map((c) => ({ ...c, isLit: true })));
  };

  const blowAll = () => {
    if (isCut) return;
    setCandles((prev) => prev.map((c) => ({ ...c, isLit: false })));
  };

  const cutCake = () => {
    if (isCut) return;
    setIsCut(true);

    // 1. Trigger global celebration in App.jsx
    if (triggerCelebrate) {
      triggerCelebrate();
    }

    // 2. Blast massive celebration confetti
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#ff3366', '#ffd700', '#ff80a0', '#ffffff', '#e5a93b']
    });

    // 3. Keep launching fireworks for 4.5 seconds
    const duration = 4.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ff3366', '#ffd700', '#ff80a0']
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ff3366', '#ffd700', '#ff80a0']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  };

  const resetCake = () => {
    setCandles((prev) => prev.map((c) => ({ ...c, isLit: false })));
    setCandlesWereLit(false);
    setIsCut(false);
  };

  // Click handler for cake body (handles sequential interactions: light all -> cut cake -> reset cake on next click)
  const handleCakeClick = () => {
    if (isCut) {
      resetCake();
      return;
    }
    
    if (litCount < candles.length) {
      lightAll();
    } else {
      cutCake();
    }
  };

  return (
    <section className="relative py-24 px-4 md:px-8 z-10 overflow-hidden flex flex-col items-center" style={{ background: 'linear-gradient(to bottom, var(--deep-purple), #0d0213)' }}>
      <div className="max-w-4xl mx-auto text-center w-full relative z-10">
        <h2 className="fancy-title romantic-gradient-text mb-2">Make a Wish</h2>
        
        {/* Dynamic Instructional Guides */}
        <p className="section-subtitle max-w-lg mx-auto">
          {!isCut && litCount < candles.length && (
            <span className="text-yellow-300 font-medium">
              ✨ Tap the cake or candles to light their fires! 🕯️
            </span>
          )}
          {!isCut && allLit && (
            <span className="text-green-300 font-bold animate-pulse text-lg tracking-wide block">
              🎂 Tap the cake again to cut it and make a wish! 🔪✨
            </span>
          )}
          {isCut && (
            <span className="text-yellow-400 font-serif italic text-lg block">
              ✨ Happy 18th Golden Birthday, Bubusai! Your wishes are granted! ✨
            </span>
          )}
        </p>

        {/* The Interactive Cake Area */}
        <div className="custom-cake-area">
          <div 
            onClick={handleCakeClick}
            className="custom-cake-container"
          >
            
            {/* Number 18 - Rises when Cake is Cut */}
            <AnimatePresence>
              {isCut && (
                <motion.div
                  initial={{ scale: 0, y: 50, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.8, 1.6], 
                    y: -120, 
                    opacity: 1,
                    filter: [
                      'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
                      'drop-shadow(0 0 25px rgba(255, 51, 102, 0.9))',
                      'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))'
                    ]
                  }}
                  transition={{ 
                    y: { type: 'spring', stiffness: 70, damping: 12 },
                    scale: { duration: 0.8, ease: 'easeOut' },
                    filter: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className="absolute z-20 font-extrabold text-center flex flex-col items-center select-none"
                  style={{
                    background: 'linear-gradient(135deg, #ffd700 0%, #ff3366 50%, #ffd700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    left: 'calc(50% - 70px)',
                    width: '140px',
                    top: '80px'
                  }}
                >
                  <div className="text-xs uppercase tracking-widest text-pink-300 font-sans font-bold mb-1">
                    Aysha is
                  </div>
                  <span className="font-serif italic font-black text-8xl drop-shadow-xl select-none leading-none">18</span>
                  <div className="flex gap-1.5 text-red-500 mt-2">
                    <Heart fill="currentColor" size={14} className="animate-pulse" />
                    <Heart fill="currentColor" size={18} className="animate-bounce" />
                    <Heart fill="currentColor" size={14} className="animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cake Text Overlays (Rendered ONCE outside the clipped parts to prevent duplicate, overlapping, or fuzzy rendering) */}
            <AnimatePresence>
              {!isCut && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 pointer-events-none z-25 flex flex-col items-center justify-end pb-8"
                >
                  {/* Top Layer Text */}
                  <div className="absolute bottom-[135px] text-white-40 text-xs font-bold uppercase tracking-widest select-none">
                    Sweet Love
                  </div>
                  
                  {/* Bottom Layer Text */}
                  <div className="absolute bottom-[58px] text-white-30 text-sm font-extrabold uppercase tracking-widest select-none">
                    Happy Birthday
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Left Halved Piece (Clipped Left Half) */}
            <motion.div
              animate={{ x: isCut ? -75 : 0, rotate: isCut ? -6 : 0 }}
              transition={{ type: 'spring', stiffness: 90, damping: 16 }}
              style={{ clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)' }}
              className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none"
            >
              <div className="relative w-full h-full flex flex-col items-center justify-end pb-[32px] pointer-events-auto">
                {/* Candles */}
                <div className="custom-candles-container">
                  {candles.map((candle) => (
                    <div
                      key={candle.id}
                      onClick={(e) => toggleCandle(candle.id, e)}
                      className="custom-candle"
                      style={{
                        left: candle.left,
                        bottom: '0px',
                      }}
                    >
                      <div className="custom-candle-body">
                        <div className="custom-candle-stripes" />
                      </div>
                      <AnimatePresence>
                        {candle.isLit ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="custom-flame"
                          />
                        ) : (
                          candlesWereLit && (
                            <motion.div
                              initial={{ opacity: 0.8, y: -10, scale: 0.8 }}
                              animate={{ opacity: 0, y: -45, scale: 1.3 }}
                              transition={{ duration: 1.2 }}
                              className="absolute w-3 h-5 rounded-full top-[-20px] left-[1px] blur-[1px]"
                              style={{ backgroundColor: 'rgba(156, 163, 175, 0.6)' }}
                            />
                          )
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Layer 2 (Top Layer) */}
                <div className="custom-cake-layer-top">
                  <div className="custom-cake-drips-top">
                    <span className="drip drip-1"></span>
                    <span className="drip drip-2"></span>
                    <span className="drip drip-3"></span>
                    <span className="drip drip-4"></span>
                    <span className="drip drip-5"></span>
                  </div>
                </div>

                {/* Layer 1 (Bottom Layer) */}
                <div className="custom-cake-layer-bottom">
                  <div className="custom-cake-drips-bottom">
                    <span className="drip drip-1"></span>
                    <span className="drip drip-2"></span>
                    <span className="drip drip-3"></span>
                    <span className="drip drip-4"></span>
                    <span className="drip drip-5"></span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Halved Piece (Clipped Right Half) */}
            <motion.div
              animate={{ x: isCut ? 75 : 0, rotate: isCut ? 6 : 0 }}
              transition={{ type: 'spring', stiffness: 90, damping: 16 }}
              style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}
              className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none"
            >
              <div className="relative w-full h-full flex flex-col items-center justify-end pb-[32px] pointer-events-auto">
                {/* Candles */}
                <div className="custom-candles-container">
                  {candles.map((candle) => (
                    <div
                      key={candle.id}
                      onClick={(e) => toggleCandle(candle.id, e)}
                      className="custom-candle"
                      style={{
                        left: candle.left,
                        bottom: '0px',
                      }}
                    >
                      <div className="custom-candle-body">
                        <div className="custom-candle-stripes" />
                      </div>
                      <AnimatePresence>
                        {candle.isLit ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="custom-flame"
                          />
                        ) : (
                          candlesWereLit && (
                            <motion.div
                              initial={{ opacity: 0.8, y: -10, scale: 0.8 }}
                              animate={{ opacity: 0, y: -45, scale: 1.3 }}
                              transition={{ duration: 1.2 }}
                              className="absolute w-3 h-5 rounded-full top-[-20px] left-[1px] blur-[1px]"
                              style={{ backgroundColor: 'rgba(156, 163, 175, 0.6)' }}
                            />
                          )
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Layer 2 (Top Layer) */}
                <div className="custom-cake-layer-top">
                  <div className="custom-cake-drips-top">
                    <span className="drip drip-1"></span>
                    <span className="drip drip-2"></span>
                    <span className="drip drip-3"></span>
                    <span className="drip drip-4"></span>
                    <span className="drip drip-5"></span>
                  </div>
                </div>

                {/* Layer 1 (Bottom Layer) */}
                <div className="custom-cake-layer-bottom">
                  <div className="custom-cake-drips-bottom">
                    <span className="drip drip-1"></span>
                    <span className="drip drip-2"></span>
                    <span className="drip drip-3"></span>
                    <span className="drip drip-4"></span>
                    <span className="drip drip-5"></span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cake Plate (Stays Solid, Not Clipped) */}
            <div className="custom-cake-plate" />
          </div>
        </div>

        {/* Celebration UI Control Panel */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {litCount < candles.length ? (
              <motion.button
                key="light-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={lightAll}
                style={{
                  background: 'linear-gradient(to right, #f97316, #ef4444)',
                  borderColor: '#f97316'
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm tracking-wider uppercase transition-all duration-300 shadow-glow border hover-scale-105"
              >
                🕯️ Light All Candles
              </motion.button>
            ) : !isCut ? (
              <motion.button
                key="cut-btn"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: [1, 1.05, 1], y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ scale: { repeat: Infinity, duration: 1.5 } }}
                onClick={cutCake}
                style={{
                  background: 'linear-gradient(to right, #22c55e, #059669)',
                  borderColor: '#22c55e'
                }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-base tracking-widest uppercase transition-all duration-300 shadow-glow border hover-scale-105"
              >
                🔪 Cut the Cake! 🎂
              </motion.button>
            ) : (
              <motion.div
                key="celeb-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="glass-card gold-border p-6 max-w-md w-full shadow-glow-gold"
              >
                <h3 className="text-2xl font-bold text-yellow-300 flex justify-center items-center gap-1.5 font-serif italic mb-2">
                  <Sparkles size={20} className="animate-spin" /> Wish Granted! <Sparkles size={20} className="animate-spin" />
                </h3>
                <p className="text-sm text-pink-100 font-light leading-relaxed mb-4">
                  "May all your sweet dreams come true, my princess. Your happiness is my biggest wish every single day."
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={resetCake}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white-10 hover-bg-white-20 text-xs font-semibold text-white transition-all border border-white-20"
                  >
                    <RefreshCw size={12} /> Play Again
                  </button>
                  <button
                    onClick={cutCake}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-600 hover-bg-pink-500 text-xs font-semibold text-white transition-all border border-pink-400 shadow-glow"
                  >
                    💖 Celebrate Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Birthday Celebration Video Section - Plays After Cake Cutting */}
          <AnimatePresence>
            {isCut && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 w-full max-w-2xl mx-auto p-4 md:p-6 glass-card gold-border rounded-2xl shadow-glow-gold relative overflow-hidden text-center"
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <span className="text-xs uppercase tracking-widest text-pink-400 font-semibold mb-1 flex items-center gap-1">
                    <Sparkles size={14} className="text-yellow-400" /> Special Celebration Memory <Sparkles size={14} className="text-yellow-400" />
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-yellow-300 italic">
                    🎬 Our Birthday Celebration Video 🌹
                  </h3>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-pink-500/30 shadow-2xl bg-black aspect-video flex items-center justify-center">
                  <video
                    key={videos[activeVideoIndex].url}
                    src={videos[activeVideoIndex].url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain max-h-[60vh] rounded-xl bg-black"
                  />
                </div>

                {/* Video Playlist Buttons */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {videos.map((vid, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveVideoIndex(idx)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeVideoIndex === idx
                          ? 'bg-pink-600 text-white border border-pink-400 shadow-glow'
                          : 'bg-black/40 text-pink-200/70 border border-white/10 hover:bg-black/60'
                      }`}
                    >
                      🎥 {vid.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-cake-area {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 420px;
          margin-top: 16px;
        }
        .custom-cake-container {
          position: relative;
          width: 380px;
          height: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 32px;
          cursor: pointer;
          user-select: none;
        }
        .custom-cake-plate {
          position: absolute;
          bottom: 10px;
          width: 350px;
          height: 24px;
          background: linear-gradient(to top, #e5e7eb 0%, #ffffff 50%, #f3f4f6 100%);
          border: 1.5px solid #d1d5db;
          border-radius: 175px / 12px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          z-index: 1;
        }
        .custom-cake-layer-bottom {
          position: absolute;
          bottom: 22px;
          width: 290px;
          height: 110px;
          background: linear-gradient(135deg, #ff5e7e 0%, #d83c5d 100%);
          border-radius: 145px / 28px;
          border-bottom: 12px solid #a01f37;
          box-shadow: 0 8px 16px rgba(0,0,0,0.35);
          z-index: 10;
        }
        .custom-cake-drips-bottom {
          position: absolute;
          top: 0;
          left: 20px;
          right: 20px;
          height: 25px;
          display: flex;
          justify-content: space-around;
          pointer-events: none;
          z-index: 12;
        }
        .custom-cake-drips-bottom .drip {
          background-color: #ffccd5;
          border-radius: 0 0 10px 10px;
          box-shadow: inset 0 -2px 4px rgba(0,0,0,0.1);
        }
        .custom-cake-drips-bottom .drip-1 { width: 16px; height: 26px; }
        .custom-cake-drips-bottom .drip-2 { width: 12px; height: 18px; }
        .custom-cake-drips-bottom .drip-3 { width: 20px; height: 32px; }
        .custom-cake-drips-bottom .drip-4 { width: 14px; height: 22px; }
        .custom-cake-drips-bottom .drip-5 { width: 16px; height: 28px; }

        .custom-cake-layer-top {
          position: absolute;
          bottom: 112px;
          width: 220px;
          height: 85px;
          background: linear-gradient(135deg, #6d2f5b 0%, #582148 100%);
          border-radius: 110px / 22px;
          border-bottom: 8px solid #3c1230;
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
          z-index: 20;
        }
        .custom-cake-drips-top {
          position: absolute;
          top: 0;
          left: 15px;
          right: 15px;
          height: 20px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          z-index: 22;
        }
        .custom-cake-drips-top .drip {
          background-color: #ffffff;
          border-radius: 0 0 8px 8px;
          box-shadow: inset 0 -2px 3px rgba(0,0,0,0.1);
        }
        .custom-cake-drips-top .drip-1 { width: 12px; height: 20px; }
        .custom-cake-drips-top .drip-2 { width: 16px; height: 24px; }
        .custom-cake-drips-top .drip-3 { width: 10px; height: 15px; }
        .custom-cake-drips-top .drip-4 { width: 14px; height: 22px; }
        .custom-cake-drips-top .drip-5 { width: 12px; height: 18px; }

        .custom-candles-container {
          position: absolute;
          bottom: 178px;
          width: 200px;
          height: 60px;
          z-index: 30;
          pointer-events: none;
        }
        .custom-candle {
          position: absolute;
          width: 10px;
          height: 48px;
          cursor: pointer;
          pointer-events: auto;
          transition: all 0.3s ease;
        }
        .custom-candle-body {
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, #ec4899, #fef08a, #ec4899);
          border-radius: 5px;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .custom-candle-stripes {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.4) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.4) 75%);
          background-size: 6px 6px;
          border-radius: 5px;
        }
        .custom-flame {
          position: absolute;
          width: 14px;
          height: 24px;
          background: linear-gradient(to top, #ea580c, #facc15, #fef08a);
          border-radius: 50% 50% 20% 20%;
          top: -24px;
          left: -2px;
          transform-origin: bottom center;
          box-shadow: 0 0 12px rgba(234,88,12,0.85);
          animation: flicker 0.15s ease-in-out infinite alternate;
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1.5deg); }
          50% { transform: scale(1.08) rotate(2deg); }
        }
      `}</style>
    </section>
  );
}
