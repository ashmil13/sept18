import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Compass, Cake, Calendar, Sparkles, MapPin, X, Award, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import staticTimeline from '../data/timeline.json';

const iconMap = {
  heart: <Heart className="text-pink-500 fill-pink-500" size={18} />,
  compass: <Compass className="text-blue-400" size={18} />,
  cake: <Cake className="text-yellow-400" size={18} />,
  calendar: <Calendar className="text-purple-400" size={18} />,
  sparkles: <Sparkles className="text-yellow-400" size={18} />,
  mappin: <MapPin className="text-red-400" size={18} />,
  mahar: <Crown className="text-yellow-300 fill-yellow-400/30 animate-pulse" size={18} />
};

const getIcon = (name) => {
  const normalized = String(name).toLowerCase();
  if (normalized.includes('mahar')) return <Crown className="text-yellow-300 fill-yellow-400/30 animate-bounce" size={20} />;
  if (normalized.includes('ring')) return <Sparkles className="text-yellow-400 animate-pulse" size={18} />;
  return iconMap[normalized] || <Heart className="text-pink-500 fill-pink-500" size={18} />;
};

export default function Timeline({ photos }) {
  const [timelineItems] = useState(staticTimeline);
  const [activeMaharModal, setActiveMaharModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const triggerMaharCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#ff3366', '#ffffff', '#e5a93b', '#ec4899']
    });
    setActiveMaharModal(true);
  };

  return (
    <section className="relative py-24 px-4 md:px-8 z-10 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0e0214, #180528, #0b0213)' }}>
      {/* Decorative side glows */}
      <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }} />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }} />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles size={14} className="text-yellow-400" /> Sacred Journey <Sparkles size={14} className="text-yellow-400" />
          </span>
          <h2 className="fancy-title romantic-gradient-text text-3xl sm:text-5xl font-extrabold mb-2">
            Our Love Story & Timeline
          </h2>
          <p className="text-pink-200/80 font-serif italic text-base sm:text-lg max-w-2xl mx-auto">
            A walk down memory lane, tracing the beautiful milestones that defined our journey together.
          </p>
        </div>

        {/* Center timeline vertical glow line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 top-44 hidden md:block" style={{ height: '80%', background: 'linear-gradient(to bottom, #ec4899, #f59e0b, #ec4899, transparent)' }} />

        <div className="space-y-16 md:space-y-24 mt-12">
          {timelineItems.map((item, index) => {
            const isLeft = index % 2 === 0;
            const photoUrl = item.photoUrl
              ? item.photoUrl
              : photos && photos.length > 0
              ? photos[item.photoIndex % photos.length]
              : null;

            return (
              <div key={item.id || index} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                {/* Connection Dot in the center */}
                <div
                  onClick={() => item.isMahar && triggerMaharCelebration()}
                  className={`absolute left-1/2 transform -translate-x-1/2 w-11 h-11 rounded-full glass-card gold-border flex items-center justify-center z-20 hidden md:flex shadow-glow ${item.isMahar ? 'cursor-pointer animate-pulse ring-4 ring-yellow-400/40' : ''}`}
                >
                  {getIcon(item.icon)}
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-percent-45 flex ${isLeft ? 'justify-end' : 'justify-start md:order-2'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
                    onClick={() => {
                      if (item.isMahar) {
                        triggerMaharCelebration();
                      } else if (photoUrl) {
                        setSelectedItem(item);
                      }
                    }}
                    className={`w-full glass-card gold-border p-5 sm:p-6 shadow-glow transition-all duration-300 hover:shadow-glow-gold ${item.isMahar ? 'ring-2 ring-yellow-400/50 bg-gradient-to-br from-yellow-950/40 via-purple-950/60 to-pink-950/40 cursor-pointer group' : ''}`}
                  >
                    {/* Date Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-full bg-pink-950/80 border border-pink-500/30">
                          {getIcon(item.icon)}
                        </span>
                        <span className="text-xs font-semibold text-yellow-300 uppercase tracking-widest">{item.date}</span>
                      </div>
                      {item.isMahar && (
                        <span className="px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-[11px] text-yellow-300 font-bold tracking-wider animate-bounce">
                          ✨ CLICK TO VIEW MAHAR 💍
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-serif font-bold text-white mb-2 tracking-wide group-hover:text-yellow-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed font-light mb-4">
                      {item.description}
                    </p>

                    {/* Photo Box */}
                    {photoUrl && (
                      <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden border border-yellow-500/30 group relative bg-black/40">
                        <img
                          src={photoUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-4">
                          <span className="text-xs text-yellow-300 font-serif italic flex items-center gap-1">
                            <Sparkles size={12} /> {item.isMahar ? 'The Sacred Mahar Memory 💍' : 'Cherished Milestone'}
                          </span>
                          {item.isMahar && (
                            <span className="text-xs bg-yellow-500 text-black px-2.5 py-1 rounded-full font-bold shadow-md">
                              View Mahar ✨
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="w-percent-10 hidden md:block" />
                <div className={`w-percent-45 hidden md:block ${isLeft ? 'order-2' : ''}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* WONDERFUL ANIMATED MAHAR MODAL */}
      <AnimatePresence>
        {activeMaharModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none"
            onClick={() => setActiveMaharModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotate: 5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full glass-card gold-border p-6 sm:p-8 rounded-3xl shadow-[0_0_80px_rgba(255,215,0,0.4)] text-center relative border-2 border-yellow-400/80"
              style={{ background: 'linear-gradient(135deg, rgba(30, 8, 48, 0.95), rgba(60, 16, 80, 0.95), rgba(20, 5, 30, 0.95))' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveMaharModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/50 border border-yellow-400/40 hover:bg-red-900/60 transition-all"
              >
                <X size={22} />
              </button>

              {/* Title & Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-yellow-400/60 bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase tracking-widest mb-2 shadow-glow">
                  <Crown size={16} className="text-yellow-400" /> Sacred Covenant of Love <Crown size={16} className="text-yellow-400" />
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-extrabold text-yellow-300 tracking-wide drop-shadow-md">
                  💍 The Sacred Mahar Memory 👑
                </h3>
                <p className="text-xs sm:text-sm text-pink-200/90 italic font-serif mt-1">
                  "A sacred vow of eternal love, honor, devotion, and protection for my wife, Bubusai."
                </p>
              </div>

              {/* Image Frame with Golden Glow */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden border-2 border-yellow-400/70 shadow-[0_0_40px_rgba(255,215,0,0.3)] bg-black/60 mb-5 max-h-[65vh] flex items-center justify-center group"
              >
                <img
                  src="/photos/IMG-20250711-WA0064.jpg"
                  alt="The Sacred Mahar"
                  className="max-h-[62vh] w-auto max-w-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-yellow-400/50 text-xs text-yellow-300 font-semibold flex items-center gap-2 shadow-lg">
                  <Sparkles size={14} className="text-yellow-400 animate-spin" /> July 11, 2025 • Our Forever Promise 💖
                </div>
              </motion.div>

              {/* Romantic Bottom Note */}
              <div className="text-xs text-pink-100/90 font-serif leading-relaxed px-2">
                "Every token, every vow, and every beat of my heart belongs to you forever, my queen Aysha."
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
