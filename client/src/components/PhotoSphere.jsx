import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, RotateCw, Sparkles, X, Heart } from 'lucide-react';

export default function PhotoSphere({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const sphereRef = useRef(null);

  // Animation and drag state refs (to update styles at 60fps without React re-render lags)
  const rotationX = useRef(0);
  const rotationY = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startRotX = useRef(0);
  const startRotY = useRef(0);

  // Track window width to make the sphere radius responsive
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Limit photos to 32 max for optimal density and distribution on the sphere
  const displayedPhotos = useMemo(() => {
    return photos && photos.length > 0 ? photos.slice(0, 32) : [];
  }, [photos]);

  // Dynamically calculate radius based on window width
  const sphereRadius = useMemo(() => {
    if (windowWidth < 480) return 110;
    if (windowWidth < 768) return 140;
    if (windowWidth < 1024) return 200;
    return 240; // Default desktop radius
  }, [windowWidth]);

  // Golden angle distribution (Fibonacci Sphere)
  const points = useMemo(() => {
    const total = displayedPhotos.length;
    const pts = [];
    if (total === 0) return pts;

    for (let i = 0; i < total; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i; // golden angle

      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);

      pts.push({ x, y, z, url: displayedPhotos[i] });
    }
    return pts;
  }, [displayedPhotos, sphereRadius]);

  // Animation Loop for Auto-Rotation
  useEffect(() => {
    let animId;
    const tick = () => {
      if (!isDragging.current && !isHovered) {
        // Slow float rotation
        rotationY.current += 0.20;
        rotationX.current += 0.10;

        if (sphereRef.current) {
          sphereRef.current.style.transform = `rotateX(${rotationX.current}deg) rotateY(${rotationY.current}deg)`;
        }
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  // Drag handlers for mouse & touch
  const handleStart = (e) => {
    isDragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX.current = clientX;
    startY.current = clientY;
    startRotX.current = rotationX.current;
    startRotY.current = rotationY.current;
  };

  const handleMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - startX.current;
    const deltaY = clientY - startY.current;

    // Adjust rotation sensitivity
    const sensitivity = 0.35;
    rotationY.current = startRotY.current + deltaX * sensitivity;
    rotationX.current = startRotX.current - deltaY * sensitivity;

    if (sphereRef.current) {
      sphereRef.current.style.transform = `rotateX(${rotationX.current}deg) rotateY(${rotationY.current}deg)`;
    }
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    // Add event listeners globally for smoother release outside target
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  if (displayedPhotos.length === 0) {
    return null;
  }

  return (
    <section className="sphere-section">
      {/* Dynamic Background Glows */}
      <div className="glow-bg-1" />
      <div className="glow-bg-2" />

      {/* Header */}
      <div className="max-w-3xl text-center mb-6 relative z-20">
        <h2 className="fancy-title romantic-gradient-text mb-2 flex items-center justify-center gap-2">
          3D Memory Orb <Sparkles className="text-yellow-300 animate-spin-slow" size={20} />
        </h2>
        <p className="section-subtitle">
          An interactive orbiting constellation of our beautiful memories. Drag to spin the orb, and click any bubble to bring back that sweet moment!
        </p>
      </div>

      {/* 3D Sphere Container */}
      <div 
        className="sphere-container"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
      >
        <div
          ref={sphereRef}
          className="sphere-3d"
        >
          {points.map((pt, index) => (
            <div
              key={index}
              className="photo-bubble"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setSelectedPhoto(pt.url)}
              style={{
                transform: `translate3d(${pt.x}px, ${pt.y}px, ${pt.z}px) translate(-50%, -50%)`,
              }}
            >
              {/* Outer Glow Ring */}
              <div className="photo-bubble-glow" />

              {/* Photo Thumbnail Wrapper */}
              <div className="photo-bubble-img-wrapper">
                <img 
                  src={pt.url} 
                  alt={`Sphere Memory ${index + 1}`} 
                  loading="lazy"
                />
              </div>

              {/* Sparkle Decoration */}
              <div className="photo-bubble-sparkle">
                ✨
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rotating Guide Hint */}
      <div className="guide-hint">
        <RotateCw size={12} className="animate-spin-slow" /> Drag to Orbit • Click to View
      </div>

      {/* Lightbox / Zoom Focus Overlay */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="lightbox-close-btn"
            >
              <X size={20} />
            </button>

            {/* Photo Container */}
            <div 
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25 }}
                src={selectedPhoto}
                alt="Selected Sphere Memory"
                className="lightbox-img"
              />

              <div className="lightbox-caption">
                <Heart fill="currentColor" className="heart-pulse" size={16} /> My Forever Heartbeat
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom localized Styles */}
      <style>{`
        .sphere-section {
          position: relative;
          min-height: 750px;
          padding: 6rem 1rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          background: linear-gradient(to bottom, #0c0211, #13031f);
        }

        /* Background glows */
        .glow-bg-1 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 550px;
          height: 550px;
          border-radius: 50%;
          background: rgba(219, 39, 119, 0.08);
          filter: blur(80px);
          pointer-events: none;
        }

        .glow-bg-2 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: rgba(147, 51, 234, 0.12);
          filter: blur(80px);
          pointer-events: none;
          animation: pulse-glow-bg 4s ease-in-out infinite;
        }

        @keyframes pulse-glow-bg {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        /* 3D Sphere Container */
        .sphere-container {
          position: relative;
          width: 500px;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          cursor: grab;
          z-index: 20;
          perspective: 1000px;
          touch-action: none;
        }

        .sphere-container:active {
          cursor: grabbing;
        }

        .sphere-3d {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        /* Photo Bubbles */
        .photo-bubble {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backface-visibility: hidden;
        }

        .photo-bubble-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(250, 204, 21, 0.4);
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.35);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .photo-bubble:hover .photo-bubble-glow {
          border-color: #ec4899;
          transform: scale(1.15);
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.8), 0 0 35px rgba(250, 204, 21, 0.4);
        }

        .photo-bubble-img-wrapper {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .photo-bubble:hover .photo-bubble-img-wrapper {
          border-color: #f472b6;
        }

        .photo-bubble img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
          pointer-events: none;
          transition: transform 0.3s ease;
        }

        .photo-bubble:hover img {
          transform: scale(1.1);
        }

        .photo-bubble-sparkle {
          position: absolute;
          top: -6px;
          right: -6px;
          opacity: 0;
          font-size: 14px;
          transition: opacity 0.3s ease;
        }

        .photo-bubble:hover .photo-bubble-sparkle {
          opacity: 1;
        }

        /* Lightbox Modal */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.95);
          padding: 1rem;
          backdrop-filter: blur(8px);
        }

        .lightbox-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          padding: 0.625rem;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .lightbox-close-btn:hover {
          background-color: #db2777;
          transform: rotate(90deg);
        }

        .lightbox-content {
          max-width: 90%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 70vh;
          border-radius: 1rem;
          border: 1.5px solid #e5a93b;
          box-shadow: 0 0 25px rgba(229, 169, 59, 0.5);
          object-fit: contain;
        }

        .lightbox-caption {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 1.25rem;
          color: #facc15;
          font-family: 'Great Vibes', cursive;
          font-size: 1.75rem;
          letter-spacing: 0.05em;
          user-select: none;
        }

        .heart-pulse {
          animation: pulse-glow-heart 1.5s infinite;
          color: #ff3366;
        }

        @keyframes pulse-glow-heart {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 2px rgba(255, 51, 102, 0.6));
          }
          50% {
            transform: scale(1.25);
            filter: drop-shadow(0 0 8px rgba(255, 51, 102, 0.9));
          }
        }

        /* Guide hint styles */
        .guide-hint {
          margin-top: 2rem;
          font-size: 0.75rem;
          color: rgba(252, 231, 243, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          z-index: 20;
          user-select: none;
        }

        /* Utility Animations */
        .animate-spin-slow {
          animation: spin-slow-rot 8s linear infinite;
        }

        @keyframes spin-slow-rot {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .sphere-section {
            min-height: 600px;
            padding: 4rem 1rem;
          }
          .sphere-container {
            width: 320px;
            height: 320px;
          }
          .photo-bubble {
            width: 60px;
            height: 60px;
          }
          .glow-bg-1 {
            width: 320px;
            height: 320px;
          }
          .glow-bg-2 {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </section>
  );
}

