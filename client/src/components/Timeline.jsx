import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Compass, Cake, Calendar, Sparkles, MapPin } from 'lucide-react';
import { DEFAULT_TIMELINE } from '../utils/localData';

const iconMap = {
  heart: <Heart className="text-pink-500 fill-pink-500" size={18} />,
  compass: <Compass className="text-blue-400" size={18} />,
  cake: <Cake className="text-yellow-400" size={18} />,
  calendar: <Calendar className="text-purple-400" size={18} />,
  sparkles: <Sparkles className="text-yellow-400" size={18} />,
  mappin: <MapPin className="text-red-400" size={18} />
};

// Fallback lookup if custom icon not in map
const getIcon = (name) => {
  const normalized = String(name).toLowerCase();
  if (normalized.includes('ring')) return <Sparkles className="text-yellow-400 animate-pulse" size={18} />;
  return iconMap[normalized] || <Heart className="text-pink-500 fill-pink-500" size={18} />;
};

export default function Timeline({ photos }) {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimelineItems(DEFAULT_TIMELINE);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-pink-200 mt-3 text-sm">Gathering our beautiful chapters...</p>
      </div>
    );
  }

  return (
    <section className="relative py-24 px-4 md:px-8 z-10 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0e0214, var(--deep-purple))' }}>
      {/* Decorative side glows */}
      <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }} />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }} />

      <div className="max-w-5xl mx-auto relative">
        <h2 className="fancy-title romantic-gradient-text mb-2">Our Love Story</h2>
        <p className="section-subtitle">
          A walk down memory lane, tracing the beautiful milestones that defined our journey together.
        </p>

        {/* Center line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 top-44 hidden md:block" style={{ height: '80%', background: 'linear-gradient(to bottom, #ec4899, #f43f5e, transparent)' }} />

        <div className="space-y-16 md:space-y-24 mt-16">
          {timelineItems.map((item, index) => {
            const isLeft = index % 2 === 0;
            // Map the photoIndex to the actual photo from the wife folder, if available
            const photoUrl = photos && photos.length > 0
              ? photos[item.photoIndex % photos.length]
              : null;

            return (
              <div key={item.id || item._id} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                {/* Connection Dot in the center */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full glass-card gold-border flex items-center justify-center z-20 hidden md:flex shadow-glow">
                  {getIcon(item.icon)}
                </div>

                {/* Left Side Content */}
                <div className={`w-full md:w-percent-45 flex ${isLeft ? 'justify-end' : 'justify-start md:order-2'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
                    className="w-full glass-card gold-border p-6 shadow-glow transition-all duration-300 hover:shadow-glow-gold"
                  >
                    {/* Mobile icon display */}
                    <div className="flex items-center gap-2 mb-3 md:hidden">
                      <span className="p-2 rounded-full bg-pink-950 border border-pink-500-30">
                        {getIcon(item.icon)}
                      </span>
                      <span className="text-xs font-semibold text-yellow-300 uppercase tracking-widest">{item.date}</span>
                    </div>

                    {/* Desktop Date */}
                    <span className="hidden md:block text-xs font-semibold text-yellow-300 uppercase tracking-widest mb-2">
                      {item.date}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{item.title}</h3>
                    
                    <p className="text-sm text-pink-100-80 leading-relaxed font-light mb-4">
                      {item.description}
                    </p>

                    {/* Dynamic Photo */}
                    {photoUrl && (
                      <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden border border-white-10 group relative">
                        <img
                          src={photoUrl}
                          alt={item.title}
                          className="w-full h-full object-cover hover-scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
                          <span className="text-xs text-yellow-300 font-serif italic">Cherished Chapter</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Spacemaker for md screens */}
                <div className="w-percent-10 hidden md:block" />

                {/* Right Side Empty placeholder for spacing */}
                <div className={`w-percent-45 hidden md:block ${isLeft ? 'order-2' : ''}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
