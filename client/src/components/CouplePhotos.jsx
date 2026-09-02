
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function CouplePhotos() {
  const couplePhotos = [
    {
      id: 'couple-1',
      title: 'Our Sweet Sunset Moment',
      caption: 'The way you hold me close when the world turns quiet.',
      date: 'December 2022',
      url: '/photos/Album_1_IMG_20221212_184945_890.jpg'
    },
    {
      id: 'couple-2',
      title: 'Hand in Hand Forever',
      caption: 'Walking together through every adventure in life.',
      date: 'December 2022',
      url: '/photos/Album_1_IMG_20221217_115920_073.jpg'
    },
    {
      id: 'couple-3',
      title: 'Sweet Laughs & Endless Joy',
      caption: 'Your smile is the brightest part of my universe.',
      date: 'December 2022',
      url: '/photos/Album_1_IMG_20221217_120000_791.jpg'
    },
    {
      id: 'couple-4',
      title: 'Cozy Evening Love',
      caption: 'In your arms, every place feels like home.',
      date: 'February 2023',
      url: '/photos/Album_1_IMG_20230202_221742_102.jpg'
    },
    {
      id: 'couple-5',
      title: 'Soulmates & Forever Partners',
      caption: 'Created for each other, yesterday, today, and always.',
      date: 'July 2025',
      url: '/photos/IMG_20250701_113007_157.jpg'
    },
    {
      id: 'couple-6',
      title: 'Our Gorgeous Today',
      caption: 'Holding the love of my life, my queen Bubusai.',
      date: 'June 2026',
      url: '/photos/IMG_20260621_102358_745.webp'
    }
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev + 1) % couplePhotos.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev - 1 + couplePhotos.length) % couplePhotos.length);
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-12 z-10 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0c0211, #1b072c, #0d0213)' }}>
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Heart size={14} fill="#ff3366" className="text-pink-500" /> Us Together <Heart size={14} fill="#ff3366" className="text-pink-500" />
          </span>
          <h2 className="fancy-title romantic-gradient-text text-3xl sm:text-5xl font-extrabold mb-3">
            Our Couple Moments & Memories 👩‍❤️‍👨
          </h2>
          <p className="text-pink-200/80 font-serif italic text-base sm:text-xl max-w-2xl mx-auto">
            "Hand in hand, heart to heart, building a lifetime of beautiful love together."
          </p>
        </motion.div>

        {/* 6 Couple Photo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {couplePhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => setSelectedIndex(index)}
              className="glass-card gold-border p-4 rounded-2xl group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-glow-gold"
            >
              {/* Photo Frame */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black/40 mb-4 border border-white/10">
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-pink-600/80 text-white flex items-center justify-center shadow-lg border border-pink-300">
                    <Maximize2 size={18} />
                  </span>
                </div>

                {/* Badge Date */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-pink-500/30 text-[11px] font-semibold text-pink-200 flex items-center gap-1">
                  <Sparkles size={10} className="text-yellow-400" /> {photo.date}
                </div>
              </div>

              {/* Title & Caption */}
              <div className="text-left px-1">
                <h3 className="text-lg font-serif font-bold text-yellow-300 mb-1 group-hover:text-pink-300 transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-pink-100/70 font-light leading-relaxed">
                  "{photo.caption}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Fullscreen Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 z-50 text-white/80 hover:text-white p-2 rounded-full bg-black/40 border border-white/20 hover:bg-red-900/60 transition-all cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white p-3 rounded-full bg-black/40 border border-white/20 hover:bg-pink-600/60 transition-all cursor-pointer"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white p-3 rounded-full bg-black/40 border border-white/20 hover:bg-pink-600/60 transition-all cursor-pointer"
            >
              <ChevronRight size={28} />
            </button>

            {/* Polaroid Lightbox Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full glass-card gold-border p-4 sm:p-6 rounded-3xl shadow-glow-gold text-center relative"
            >
              <div className="relative rounded-2xl overflow-hidden max-h-[70vh] flex items-center justify-center bg-black/50 mb-4 border border-pink-500/30">
                <img
                  src={couplePhotos[selectedIndex].url}
                  alt={couplePhotos[selectedIndex].title}
                  className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-yellow-300 mb-1">
                {couplePhotos[selectedIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-pink-200/80 italic font-serif">
                "{couplePhotos[selectedIndex].caption}"
              </p>
              <div className="mt-3 text-[11px] text-pink-400 font-semibold tracking-wider uppercase">
                {couplePhotos[selectedIndex].date} • Couple Memory {selectedIndex + 1} of {couplePhotos.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
