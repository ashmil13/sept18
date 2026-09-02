import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

const ROMANTIC_CAPTIONS = [
  "My absolute favorite view ❤️",
  "That smile that brightens my entire world",
  "Holding hands with my forever partner",
  "Beautiful moments, beautiful you",
  "You take my breath away, every single day",
  "A lifetime of memories, and this is just the beginning",
  "My princess, my wife, my soulmate 🌹",
  "Love is in the air whenever you are near",
  "Laughter, joy, and endless love with you",
  "You are the best thing that ever happened to me",
  "Every moment with you is a sweet dream",
  "Your happiness is my greatest goal",
  "Pure grace and beauty inside out",
  "The queen of my heart, looking stunning",
  "I fall in love with you more every single day",
  "My sweet sunshine on a cloudy day",
  "Two hearts beating as one ❤️",
  "With you, life is a beautiful love story",
  "You make every ordinary moment feel extraordinary",
  "Forever and always, my love 💖"
];

export default function Gallery({ photos, triggerCelebrate }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isCinematicMode, setIsCinematicMode] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Zipper & Celebration States
  const [isUnzipped, setIsUnzipped] = useState(false);
  const [isUnzipping, setIsUnzipping] = useState(false);

  // Zipper dragging state and motion values
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const x = useMotionValue(0);

  // Derive progress percentage from motion value x
  const xPct = useTransform(x, (latestX) => (latestX / containerWidth) * 100);

  // Symmetrical diagonal clip paths to form a "V" split opening behind the zipper pull
  const topClipPath = useTransform(xPct, (v) => `polygon(0% 0%, 100% 0%, 100% 100%, ${v}% 100%, 0% 0%)`);
  const bottomClipPath = useTransform(xPct, (v) => `polygon(0% 100%, 100% 100%, 100% 0%, ${v}% 0%, 0% 100%)`);
  const trackClipPath = useTransform(xPct, (v) => `inset(0% 0% 0% ${v}%)`);

  // Handle resizing and slide to 30% (half open) on mount
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      // Automatically slide from closed to 30% on mount to guide the user's attention
      x.set(0);
      animate(x, width * 0.3, {
        type: 'spring',
        stiffness: 120,
        damping: 18,
        delay: 0.5
      });
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openLightbox = (index) => {
    setSelectedPhotoIndex(index);
    setIsCinematicMode(false);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
    setIsCinematicMode(false);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Auto slideshow in cinematic mode
  useEffect(() => {
    let interval;
    if (isCinematicMode && selectedPhotoIndex !== null) {
      interval = setInterval(() => {
        setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
      }, 4000); // Fades to next photo every 4 seconds
    }
    return () => clearInterval(interval);
  }, [isCinematicMode, selectedPhotoIndex]);

  const toggleCinematic = (e) => {
    e.stopPropagation();
    setIsCinematicMode(!isCinematicMode);
  };

  // Get caption for a photo based on its index
  const getCaption = (index) => {
    return ROMANTIC_CAPTIONS[index % ROMANTIC_CAPTIONS.length];
  };

  const nextCarousel = () => {
    if (photos.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % photos.length);
  };

  const prevCarousel = () => {
    if (photos.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleUnzip = () => {
    if (isUnzipped || isUnzipping) return;
    setIsUnzipping(true);
    triggerCelebrate();

    // Animate the zipper pull smoothly off the right side of the screen
    animate(x, containerWidth + 60, {
      duration: 1.3,
      ease: [0.77, 0, 0.175, 1]
    });

    // Initial Confetti Poppers
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 }
    });

    // Sub Confetti Poppers from sides
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ffd700', '#ff3366', '#ff003c']
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ffd700', '#ff3366', '#ff003c']
      });
    }, 400);

    // Complete unzip
    setTimeout(() => {
      setIsUnzipped(true);
      setIsUnzipping(false);
    }, 1500);
  };

  const handleDrag = () => {
    const currentX = x.get();
    // If dragged past 85% of container width, trigger full unzipping
    if (currentX >= containerWidth * 0.85) {
      handleUnzip();
    }
  };

  const handleDragEnd = () => {
    const currentX = x.get();
    // Snap back to 30% open if released before completing the unzip gesture
    if (currentX < containerWidth * 0.85 && !isUnzipping && !isUnzipped) {
      animate(x, containerWidth * 0.3, {
        type: 'spring',
        stiffness: 300,
        damping: 30
      });
    }
  };

  return (
    <section id="memories" className="relative min-h-screen py-24 px-4 md:px-8 z-10" style={{ background: 'linear-gradient(to bottom, var(--deep-purple), #0c0211)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="fancy-title romantic-gradient-text mb-2">Memory Scrapbook</h2>
        <p className="section-subtitle">
          A visual collection of our most cherished moments together. Each picture holds a story, a laugh, and a piece of my heart.
        </p>

        {/* Zipper Wrapper Frame */}
        <div className="relative min-h-[600px] w-full rounded-2xl overflow-hidden border border-white-10 bg-black-40">
          
          {!isUnzipped ? (
            /* Closed Zipper Curtain Screen Overlay (Clickable anywhere to unzip) */
            <div 
              ref={containerRef}
              onClick={handleUnzip}
              className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden cursor-pointer"
              style={{ userSelect: 'none' }}
            >
              
              {/* Top curtain panel */}
              <motion.div
                animate={isUnzipping ? { y: '-100%' } : {}}
                transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
                className="custom-zipper-curtain-top"
                style={{ clipPath: topClipPath }}
              >
                <span className="text-[10px] text-pink-300 uppercase tracking-widest font-semibold opacity-30 select-none">
                  Memories Locked
                </span>
              </motion.div>

              {/* Bottom curtain panel */}
              <motion.div
                animate={isUnzipping ? { y: '100%' } : {}}
                transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
                className="custom-zipper-curtain-bottom"
                style={{ clipPath: bottomClipPath }}
              >
                <span className="text-[10px] text-pink-300 uppercase tracking-widest font-semibold opacity-30 select-none">
                  Slide Zipper to Reveal
                </span>
              </motion.div>

              {/* Zipper Track line */}
              <motion.div
                animate={isUnzipping ? { opacity: 0 } : {}}
                transition={{ duration: 0.4 }}
                className="custom-zipper-track"
                style={{ clipPath: trackClipPath }}
              >
                <div className="custom-zipper-teeth" />
              </motion.div>

              {/* Zipper Pull Handle */}
              <motion.div
                drag={isUnzipping || isUnzipped ? false : "x"}
                dragConstraints={{ left: 0, right: containerWidth }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                className="absolute top-1/2 left-0 z-40 transform -translate-y-1/2 cursor-grab active:cursor-grabbing flex flex-col items-center"
                style={{ x, marginLeft: '10px' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* SVG Zipper Pull handle */}
                <svg viewBox="0 0 40 60" width="45" height="65" className="drop-shadow-lg">
                  <defs>
                    <linearGradient id="zipperGoldOverlay" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fff8db" />
                      <stop offset="30%" stopColor="#ffd700" />
                      <stop offset="70%" stopColor="#d4af37" />
                      <stop offset="100%" stopColor="#aa7c11" />
                    </linearGradient>
                  </defs>
                  <path d="M 5 15 L 35 15 L 28 40 L 12 40 Z" fill="url(#zipperGoldOverlay)" stroke="#aa7c11" strokeWidth="1" />
                  <circle cx="20" cy="45" r="10" fill="none" stroke="url(#zipperGoldOverlay)" strokeWidth="3.5" />
                  <path d="M 18 35 L 18 45 L 22 45 L 22 35 Z" fill="url(#zipperGoldOverlay)" />
                  <text x="20" y="28" fill="#5c0d12" fontSize="9" fontWeight="bold" textAnchor="middle">ZIP</text>
                </svg>
              </motion.div>

              {/* Prompts Overlay */}
              <motion.div
                animate={isUnzipping ? { opacity: 0, scale: 0.8 } : {}}
                className="absolute z-20 flex flex-col items-center gap-2 pointer-events-none"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-black-60 border border-pink-500-30 px-6 py-2.5 rounded-full backdrop-blur-sm shadow-lg flex items-center gap-2"
                >
                  <span className="text-yellow-300 font-bold uppercase tracking-widest text-xs md:text-sm">
                    Tap to Unzip Memories 💝
                  </span>
                </motion.div>
              </motion.div>
            </div>
          ) : null}

          {/* Actual Scrapbook Content - Visible when unzipped */}
          <div className="w-full h-full p-4 md:p-8">
            {photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 h-[500px]">
                <ImageIcon size={48} className="text-pink-400 animate-pulse mb-3" />
                <p className="text-pink-200">No photos loaded yet.</p>
                <p className="text-xs text-white-50 mt-1">Please add photos to the "wife" folder to showcase them here!</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Cinematic slideshow trigger & rotating carousel banner */}
                <div className="mb-16 flex flex-col items-center">
                  <button
                    onClick={() => {
                      setSelectedPhotoIndex(0);
                      setIsCinematicMode(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-sm tracking-wider uppercase transition-all duration-300 shadow-glow hover:scale-105 border border-pink-400 mb-10 cursor-pointer"
                  >
                    <Play size={16} fill="currentColor" /> Play Cinematic Slideshow
                  </button>

                  {/* 3D-Like Featured Slideshow */}
                  <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden gold-border shadow-glow-gold bg-black-40">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={carouselIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-cover bg-center cursor-pointer"
                        style={{ backgroundImage: `url(${photos[carouselIndex]})` }}
                        onClick={() => openLightbox(carouselIndex)}
                      >
                        <div className="absolute inset-x-0 bottom-0 p-6 pt-16 flex flex-col justify-end text-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }}>
                          <p className="font-serif text-lg md:text-xl text-yellow-300 italic">
                            {getCaption(carouselIndex)}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Left/Right buttons */}
                    <button
                      onClick={(e) => { e.stopPropagation(); prevCarousel(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black-50 border border-white-10 text-white hover-bg-pink-600 transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextCarousel(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black-50 border border-white-10 text-white hover-bg-pink-600 transition-colors cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Grid Polaroid Layout (Fixed Aspect Ratio with Perfect Spacing) */}
                <div className="photo-grid">
                  {photos.map((url, index) => {
                    // Generate a stable rotation for each polaroid card
                    const rotation = (index % 3 === 0) ? '-2deg' : (index % 3 === 1) ? '2deg' : '-1deg';
                    
                    return (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                        className="photo-grid-item"
                      >
                        <div
                          onClick={() => openLightbox(index)}
                          className="polaroid cursor-pointer"
                          style={{ transform: `rotate(${rotation})` }}
                        >
                          <div className="polaroid-image-wrapper">
                            <img src={url} alt={`Memory ${index + 1}`} loading="lazy" />
                          </div>
                          <div className="polaroid-caption">{getCaption(index)}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>

      {/* Lightbox / Cinematic Slideshow Overlay */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black-95 p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white-10 hover-bg-pink-600 text-white transition-colors duration-200 cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Cinematic Autoplay Control */}
            <button
              onClick={toggleCinematic}
              className={`absolute top-6 left-6 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                isCinematicMode
                  ? 'bg-pink-600 text-white border-pink-400 shadow-glow animate-pulse'
                  : 'bg-white-10 text-white-80 border-transparent hover-bg-white-20'
              }`}
            >
              {isCinematicMode ? '⏸ Pause Slideshow' : '▶ Auto Play'}
            </button>

            {/* Previous Button */}
            {!isCinematicMode && (
              <button
                onClick={showPrev}
                className="absolute left-6 p-3 rounded-full bg-white-5 hover-bg-pink-600 text-white border border-white-10 transition-colors duration-200 cursor-pointer"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Active Image */}
            <div className="max-w-4xl flex flex-col items-center" style={{ maxHeight: '80vh' }} onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={selectedPhotoIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                src={photos[selectedPhotoIndex]}
                alt="Selected Memory"
                className="max-w-full rounded-lg gold-border shadow-glow-gold object-contain"
                style={{ maxHeight: '70vh' }}
              />
              
              {/* Caption */}
              <motion.p
                key={`caption-${selectedPhotoIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-yellow-400 font-serif text-lg md:text-xl text-center italic mt-6 select-none"
              >
                {getCaption(selectedPhotoIndex)}
              </motion.p>
            </div>

            {/* Next Button */}
            {!isCinematicMode && (
              <button
                onClick={showNext}
                className="absolute right-6 p-3 rounded-full bg-white-5 hover-bg-pink-600 text-white border border-white-10 transition-colors duration-200 cursor-pointer"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style>{`
        /* Zipper styles */
        .custom-zipper-curtain-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(135deg, #1b092a 0%, #150522 100%);
          border-bottom: 2.5px solid #d4af37;
          z-index: 10;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 20px;
          box-shadow: inset 0 -4px 12px rgba(0,0,0,0.6);
        }
        
        .custom-zipper-curtain-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(135deg, #150522 0%, #0c0211 100%);
          border-top: 2.5px solid #d4af37;
          z-index: 10;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 20px;
          box-shadow: inset 0 4px 12px rgba(0,0,0,0.6);
        }
        
        .custom-zipper-track {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(to bottom, #d4af37 0%, #aa7c11 100%);
          z-index: 15;
          transform: translateY(-50%);
          box-shadow: 0 0 12px rgba(212, 175, 87, 0.5);
        }
        
        .custom-zipper-teeth {
          width: 100%;
          height: 100%;
          background-image: repeating-linear-gradient(90deg, #ffd700, #ffd700 4px, transparent 4px, transparent 10px);
          opacity: 0.85;
        }

        .celebrate-title {
          font-family: var(--font-sans);
          font-weight: 900;
          letter-spacing: 0.15em;
          text-shadow: 0 0 15px rgba(244, 114, 182, 0.8), 0 0 35px rgba(219, 39, 119, 0.5);
        }
      `}</style>
    </section>
  );
}
