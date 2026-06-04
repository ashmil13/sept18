import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MailOpen, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const LETTERS = [
  {
    id: 'confession',
    title: 'My Confession 💖',
    subtitle: 'From the depths of my soul...',
    content: `Hey babe i want your love we are good couples and i belive we are best partner i sure i have no give like you  i love sharing metalty your shames make me craze😁 your totaly make me mood you my mood changer i always  try talk  more romaticaly i know you like my romance i like childish  and romances your jelose fight i jelose only your case do you no you make treat me change my character i avoid my evrthing iam like your cute anger😆 make me smile anger about silly matter you give me big role in your silly matters  i dont know  why are late meet you are the girl give me everything  in my life enjoy your romance looking my heart disolved how you can make me  happy like this i think you understand me very very well  i tell you my evrthing my every good secret bad secret   💖  your i don't how to love you`,
    signature: 'Yours and only yours, Hubby'
  },
  {
    id: 'everything',
    title: 'My Everything 💋',
    subtitle: 'To the queen of my heart...',
    content: `Every time that iam with you my heart still a beating for  you are the only person love ever met who  i can just disappears go make me laugh and you make me smile  and you are just the most incredible  person that i have ever met in my entire life you are a girl of so much faith and so much integrity and you have my heart like no body else does this is only for you my wife my bubusw and my life my girl my besty my woman my child my babe my secret holder my solemate my soppter my  owner of beauty character my princess 💋 you are my everything in my life🫂🫂🫂`,
    signature: 'Your Loving Husband'
  }
];

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenedFully, setIsOpenedFully] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [activeLetterTab, setActiveLetterTab] = useState('confession');

  const handleHeartClick = (e) => {
    if (isOpen || isExploding) return;
    setIsExploding(true);

    // Get click coordinates relative to viewport for confetti origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Trigger canvas-confetti with heart shape
    const heartShape = confetti.shapeFromPath({
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    });

    // Main central burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { x, y },
      colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#ffd700'],
      shapes: [heartShape, 'circle'],
      scalar: 1.3,
      zIndex: 100
    });

    // Delayed double side-bursts for visual excitement
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ff0a54', '#ff477e', '#ff7096', '#ffd700'],
        shapes: [heartShape]
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ff0a54', '#ff477e', '#ff7096', '#ffd700'],
        shapes: [heartShape]
      });
    }, 250);

    // transition into modal open
    setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => {
        setIsOpenedFully(true);
        setIsExploding(false);
      }, 300);
    }, 900);
  };

  const handleClose = () => {
    setIsOpenedFully(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const activeLetter = LETTERS.find((l) => l.id === activeLetterTab);

  return (
    <section className="relative py-24 px-4 md:px-8 z-10 flex flex-col items-center overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--deep-purple), #0f0215)' }}>
      <div className="max-w-4xl mx-auto text-center w-full relative z-10 flex flex-col items-center">
        <h2 className="fancy-title romantic-gradient-text mb-2">My Heart For You</h2>
        <p className="section-subtitle">
          Within this glowing heart lies my deepest feelings for you. Tap the heart to release the magic.
        </p>

        {/* Heart container */}
        <div className="relative flex justify-center items-center min-h-[350px] w-full mt-6">
          {!isOpen && (
            <div className="relative flex items-center justify-center">
              {/* Local Framer Motion Explosion Particles */}
              {isExploding && (
                <div className="absolute pointer-events-none z-30 overflow-visible" style={{ width: '100px', height: '100px' }}>
                  {[...Array(28)].map((_, i) => {
                    const angle = (i / 28) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
                    const distance = 140 + Math.random() * 180;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
                        animate={{
                          opacity: [1, 1, 0],
                          scale: [0.2, 1.6, 0.4],
                          x: tx,
                          y: ty,
                          rotate: Math.random() * 360,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: "easeOut",
                        }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500"
                        style={{ color: i % 3 === 0 ? '#ff0a54' : i % 3 === 1 ? '#ffd700' : '#ff477e' }}
                      >
                        <Heart fill="currentColor" size={Math.random() * 16 + 10} />
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Glowing pulsating heart */}
              <motion.div
                onClick={handleHeartClick}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, -2, 2, -2, 2, 0], 
                  filter: 'drop-shadow(0 0 25px rgba(255, 51, 102, 0.95))' 
                }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer flex flex-col items-center justify-center select-none"
                style={{ width: '240px', height: '240px' }}
                animate={isExploding ? {
                  scale: [1, 1.4, 0.1],
                  opacity: [1, 1, 0],
                  rotate: [0, 15, -15, 45],
                  transition: { duration: 0.8, ease: "easeInOut" }
                } : {}}
              >
                {/* Floating sparkles around heart */}
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
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>

                {/* Backlight Glow */}
                <motion.div
                  className="absolute w-44 h-44 rounded-full bg-pink-500 blur-3xl opacity-60 z-0 pointer-events-none"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Main Beating SVG Heart */}
                <motion.svg
                  viewBox="0 0 24 24"
                  className="w-48 h-48 drop-shadow-2xl z-10"
                  animate={{
                    scale: [1, 1.08, 1, 1.15, 1],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <defs>
                    <radialGradient id="heartGradient" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ff758f" />
                      <stop offset="40%" stopColor="#ff0055" />
                      <stop offset="85%" stopColor="#d90429" />
                      <stop offset="100%" stopColor="#800010" />
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="url(#heartGradient)"
                    filter="url(#glow)"
                    stroke="#ff80a0"
                    strokeWidth="0.4"
                  />
                </motion.svg>

                {/* Interactive text badge */}
                <span className="absolute bottom-[-15px] text-xs text-yellow-300 font-bold uppercase tracking-widest bg-black-60 px-4 py-1.5 rounded-full border border-pink-500-30 backdrop-blur-sm shadow-md animate-pulse z-20">
                  Click My Heart 💖
                </span>
              </motion.div>
            </div>
          )}

          {isOpen && !isOpenedFully && (
            <div className="text-pink-300 flex flex-col items-center gap-2">
              <MailOpen size={36} className="animate-bounce" />
              <span className="text-xs uppercase tracking-widest">Unfolding My Love...</span>
            </div>
          )}
        </div>
      </div>

      {/* Love Letter Modal Scroll */}
      <AnimatePresence>
        {isOpenedFully && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black-80 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-[#fffcf5] text-amber-950 rounded-2xl p-6 md:p-10 shadow-2xl border-4"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
                borderColor: 'rgba(146, 64, 14, 0.25)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border transition-colors duration-200"
                style={{ borderColor: 'rgba(120, 53, 4, 0.15)' }}
              >
                <X size={18} />
              </button>

              {/* Heart Decor Seal */}
              <div className="flex justify-center text-red-600 mb-4 animate-pulse">
                <Heart fill="currentColor" size={28} />
              </div>

              {/* Navigation Tabs */}
              <div className="flex justify-center gap-2 md:gap-4 mb-6 border-b pb-4" style={{ borderColor: 'rgba(120, 53, 4, 0.1)' }}>
                {LETTERS.map((letter) => (
                  <button
                    key={letter.id}
                    onClick={() => setActiveLetterTab(letter.id)}
                    className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 font-serif flex items-center gap-1 ${
                      activeLetterTab === letter.id
                        ? 'bg-gradient-to-r from-red-700 to-pink-700 text-white shadow-md'
                        : 'text-amber-900/60 hover:text-amber-950 hover:bg-amber-100/50'
                    }`}
                  >
                    {letter.title}
                  </button>
                ))}
              </div>

              {/* Subtitle */}
              <p className="text-center text-xs md:text-sm text-amber-900/60 italic font-serif mb-6">
                {activeLetter.subtitle}
              </p>

              {/* Letter Content Container */}
              <div className="font-serif leading-relaxed text-left text-sm md:text-base selection:bg-pink-100 selection:text-red-900 space-y-6">
                <p className="font-semibold text-base md:text-lg font-handwriting tracking-wide">
                  My Dearest Love,
                </p>

                <p className="indent-6 font-handwriting text-lg md:text-xl leading-relaxed whitespace-pre-line text-amber-950 font-medium text-justify">
                  {activeLetter.content}
                </p>

                <div className="pt-6 border-t flex flex-col items-end" style={{ borderColor: 'rgba(120, 53, 4, 0.1)' }}>
                  <p className="font-handwriting text-lg italic text-amber-900/80">
                    With all my heart,
                  </p>
                  <p className="font-handwriting text-xl md:text-2xl font-bold text-red-700 mt-1">
                    {activeLetter.signature} ❤️
                  </p>
                </div>
              </div>

              {/* Floating faint background shapes for romantic scroll effect */}
              <div className="absolute top-1/2 left-4 pointer-events-none" style={{ color: 'rgba(239, 68, 68, 0.03)' }}>
                <Heart fill="currentColor" size={96} />
              </div>
              <div className="absolute bottom-1/4 right-4 pointer-events-none" style={{ color: 'rgba(239, 68, 68, 0.03)' }}>
                <Heart fill="currentColor" size={128} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {styleTag}
    </section>
  );
}

const styleTag = (
  <style>{`
    .font-handwriting {
      font-family: 'Dancing Script', cursive;
      font-weight: 600;
    }
  `}</style>
);
