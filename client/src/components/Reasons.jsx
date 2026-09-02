import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Smile, Heart, Home, Brain, Music, Sparkles, Shield, Crown, Sun, Gift
} from 'lucide-react';
import staticReasons from '../data/reasons.json';

const iconMap = {
  smile: <Smile className="text-yellow-400 animate-pulse" size={26} />,
  'heart-handshake': <Heart className="text-pink-400 fill-pink-400" size={26} />,
  home: <Home className="text-blue-400" size={26} />,
  brain: <Brain className="text-purple-400" size={26} />,
  music: <Music className="text-green-400" size={26} />,
  sparkles: <Sparkles className="text-yellow-300" size={26} />,
  shield: <Shield className="text-cyan-400" size={26} />,
  crown: <Crown className="text-amber-400" size={26} />,
  sun: <Sun className="text-orange-400" size={26} />,
  gift: <Gift className="text-red-400" size={26} />
};

const getIcon = (name) => {
  return iconMap[String(name).toLowerCase()] || <Heart className="text-pink-500 fill-pink-500" size={26} />;
};

export default function Reasons() {
  const [reasons, setReasons] = useState(staticReasons);
  const [loading, setLoading] = useState(false);


  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-pink-200 mt-2 text-xs">Writing down my favorite things about you...</p>
      </div>
    );
  }

  return (
    <section className="relative py-24 px-4 md:px-8 z-10 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0c0211, var(--deep-purple))' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="fancy-title romantic-gradient-text mb-2">10 Reasons Why I Love You</h2>
        <p className="section-subtitle text-center">
          Just a tiny fraction of the infinite reasons why my heart belongs to you, and why you are my everything.
        </p>

        {/* Reason Card Grid */}
        <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-5 gap-6 mt-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.id || reason._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
              className="flip-card-container h-[270px] w-full"
            >
              <div className="flip-card w-full h-full relative">
                {/* Front Side */}
                <div className="flip-card-front glass-card gold-border flex flex-col justify-between items-center p-6 text-center shadow-glow">
                  <div className="w-14 h-14 rounded-full bg-white-5 border border-white-10 flex items-center justify-center mt-2 shadow-inner">
                    {getIcon(reason.icon)}
                  </div>
                  
                  <div className="my-3 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest mb-1.5 bg-black-20 px-2 py-0.5 rounded border border-white-5">
                      Reason #{reason.id || index + 1}
                    </span>
                    <h3 className="text-sm md:text-base font-extrabold text-white tracking-wide leading-tight px-1">{reason.title}</h3>
                  </div>

                  <span className="text-[10px] text-pink-300 bg-pink-950/40 px-3 py-1 rounded-full border border-pink-500/30 hover:bg-pink-500/10 hover:text-white transition-all duration-300 select-none cursor-pointer font-medium tracking-wide">
                    Hover to reveal 🌹
                  </span>
                </div>

                {/* Back Side */}
                <div className="flip-card-back bg-gradient-to-br from-pink-950 via-purple-950 to-rose-950 border border-pink-400 rounded-[20px] flex flex-col justify-center items-center p-5 text-center shadow-glow-gold">
                  <Heart fill="#ff3366" className="text-pink-500 mb-3.5 animate-pulse" size={24} />
                  <p className="text-sm text-white leading-relaxed font-semibold font-serif italic px-2">
                    "{reason.description}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {styles}
    </section>
  );
}

const styles = (
  <style>{`
    .flip-card-container {
      perspective: 1000px;
      transition: transform 0.4s ease;
    }
    
    .flip-card-container:hover {
      transform: translateY(-5px);
    }
    
    .flip-card {
      transform-style: preserve-3d;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .flip-card-container:hover .flip-card {
      transform: rotateY(180deg);
    }
    
    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: 20px;
    }
    
    .flip-card-back {
      transform: rotateY(180deg);
    }
  `}</style>
);
