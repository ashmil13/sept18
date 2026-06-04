import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Decorations from './components/Decorations';
import MusicPlayer from './components/MusicPlayer';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import LoveLetter from './components/LoveLetter';
import Flames from './components/Flames';
import Cake from './components/Cake';
import { Heart } from 'lucide-react';
import photosList from './photosList.json';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [celebrateMode, setCelebrateMode] = useState(false);

  const triggerCelebrate = () => {
    setCelebrateMode(true);
    setTimeout(() => {
      setCelebrateMode(false);
    }, 4500);
  };

  useEffect(() => {
    setPhotos(photosList || []);
    setLoading(false);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-pink-600 selection:text-white overflow-hidden">
      {/* Background Animated Decorations (Hearts, Petals, Twinkles) */}
      <Decorations />

      {/* Floating Audio Soundtrack Widget */}
      <MusicPlayer />

      {/* Hero Header Banner + Birthday Message + Countdown clock */}
      <Hero photos={photos} />

      {/* Polaroid Memory Scrapbook Album & Carousel */}
      <Gallery photos={photos} triggerCelebrate={triggerCelebrate} />

      {/* Interactive Heart Envelope with handwriting scroll letter */}
      <LoveLetter />

      {/* FLAMES relationship compatibility game */}
      <Flames />

      {/* CSS Interactive Birthday Cake + Candle blow confetti trigger */}
      <Cake triggerCelebrate={triggerCelebrate} />

      {/* Sweet Luxurious Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-white-5 bg-black-60 backdrop-blur-sm text-center">
        <div className="flex justify-center items-center gap-1-5 text-pink-500 mb-3 animate-pulse">
          <Heart fill="#ff3366" size={16} />
          <Heart fill="#ff3366" size={20} />
          <Heart fill="#ff3366" size={16} />
        </div>
        <p className="font-serif text-lg text-yellow-300 italic mb-1 tracking-wide">
          Happy 18th Birthday, Aysha. You are my forever and always.
        </p>
        <p className="text-xs text-white-40 uppercase tracking-widest font-light">
          Created with love by your Hubby • September 18
        </p>
      </footer>

      {/* 18+ Celebration Mode Overlay */}
      <AnimatePresence>
        {celebrateMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0c0211]/95 flex flex-col items-center justify-center select-none pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 text-center px-4 z-10"
            >
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl md:text-6xl font-extrabold celebrate-title tracking-wide leading-tight mb-2"
                style={{
                  background: 'linear-gradient(to right, #ffd700, #ff3366, #ffd700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🎉 Happy Birthday to You, Ayshuma! 🎂
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl md:text-4xl font-bold font-serif italic text-pink-300"
              >
                💖 Happy Birthday to My Wife 💖
              </motion.h2>

              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-lg md:text-2xl font-semibold text-yellow-300 tracking-wider uppercase"
              >
                🌹 Happy Birthday to You, My Bubusai 🌹
              </motion.h3>
            </motion.div>

            {/* Floating balloons and birthday cakes */}
            <div className="absolute inset-0 overflow-hidden z-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: '105vh', x: `${Math.random() * 95}vw`, scale: 0.7 }}
                  animate={{ y: '-10vh', rotate: Math.random() * 360 }}
                  transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: i * 0.25 }}
                  className="absolute font-bold text-2xl font-mono"
                  style={{ opacity: 0.7, color: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ff3366' : '#ec4899' }}
                >
                  {i % 4 === 0 ? '18 🎈' : i % 4 === 1 ? '🎂' : i % 4 === 2 ? '💝' : '🥂'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
