import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Decorations from './components/Decorations';
import MusicPlayer from './components/MusicPlayer';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import PhotoSphere from './components/PhotoSphere';
import AnimatedLetter from './components/AnimatedLetter';
import Flames from './components/Flames';
import Cake from './components/Cake';
import VideoSection from './components/VideoSection';
import Login from './components/Login';
import { Heart, LogOut } from 'lucide-react';

// Statically load photos from assets
const photoModules = import.meta.glob('./assets/photos/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}', { eager: true });

const selectedHeroFiles = [
  'IMG_20260821_084415_697.jpg',
  'IMG_20260821_084423_913.jpg',
  'IMG_20260821_204401_583.webp',
  'IMG-20250727-WA0059.jpg',
  'IMG-20250727-WA0057.jpg',
  'IMG-20250727-WA0077.jpg',
  'IMG-20250817-WA0026.jpg',
  'IMG-20250817-WA0029.jpg',
  'IMG-20260205-WA0016.jpg',
  'IMG-20251020-WA0055.jpg',
  'IMG-20260210-WA0003.jpg',
  'IMG-20260214-WA0002.jpg',
  'IMG-20260209-WA0011.jpg',
  'IMG-20260214-WA0007.jpg'
];

// Extract exact face-focused photos for Hero background slideshow
const heroPhotos = Object.entries(photoModules)
  .filter(([path]) => {
    const filename = path.split('/').pop() || '';
    return selectedHeroFiles.includes(filename);
  })
  .sort(([pathA], [pathB]) => {
    const fileA = pathA.split('/').pop() || '';
    const fileB = pathB.split('/').pop() || '';
    return selectedHeroFiles.indexOf(fileA) - selectedHeroFiles.indexOf(fileB);
  })
  .map(([, mod]) => mod.default || mod);

const staticPhotos = Object.entries(photoModules).map(([, mod]) => mod.default || mod);

export default function App() {
  const [photos, setPhotos] = useState(staticPhotos);
  const [loading, setLoading] = useState(false);
  const [celebrateMode, setCelebrateMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ayshu_logged_in') === 'true';
  });

  const handleLoginSuccess = () => {
    localStorage.setItem('ayshu_logged_in', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ayshu_logged_in');
    setIsAuthenticated(false);
  };

  const triggerCelebrate = () => {
    setCelebrateMode(true);
    setTimeout(() => {
      setCelebrateMode(false);
    }, 4500);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} photos={photos} />;
  }

  return (
    <div className="relative min-h-screen selection:bg-pink-600 selection:text-white overflow-hidden">
      {/* Floating Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-40 px-3 py-2 rounded-full bg-black/40 hover:bg-red-900/60 border border-pink-500/30 text-pink-200 text-xs flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg hover:scale-105 cursor-pointer group"
        title="Lock Portal / Log Out"
      >
        <LogOut size={14} className="group-hover:text-red-400" />
        <span className="hidden sm:inline font-medium">Lock Portal</span>
      </button>

      {/* Background Animated Decorations (Hearts, Petals, Twinkles) */}
      <Decorations />

      {/* Floating Audio Soundtrack Widget */}
      <MusicPlayer />

      {/* Hero Header Banner + Birthday Message + Countdown clock */}
      <Hero photos={heroPhotos.length > 0 ? heroPhotos : photos} />

      {/* Polaroid Memory Scrapbook Album & Carousel */}
      <Gallery photos={photos} triggerCelebrate={triggerCelebrate} />

      {/* 3D Orbiting Memory Sphere */}
      <PhotoSphere photos={photos} />

      {/* Romantic Video & Sound Cinema Showcase */}
      <VideoSection />

      {/* Typewriter Animated Love Letter */}
      <AnimatedLetter />

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
          Happy 18th Golden Birthday, Bubusai. You are my forever and always.
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
