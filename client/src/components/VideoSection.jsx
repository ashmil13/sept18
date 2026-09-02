import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, Play, Pause, Film, Heart } from 'lucide-react';

export default function VideoSection() {
  const videoList = [
    {
      id: 'birthday-main-video',
      title: 'Birthday Video 🎂',
      url: '/photos/5_6269120499318527082.mp4',
      badge: 'Main Birthday Video'
    },
    {
      id: 'wa-vid-20250817',
      title: 'Romantic Love Video 💖',
      url: '/photos/VID-20250817-WA0015.mp4',
      badge: 'Featured Video'
    }
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const currentVideo = videoList[currentVideoIndex];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Video playback blocked by browser:", err);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 100);
  };

  return (
    <section className="relative py-20 px-4 md:px-8 z-10 overflow-hidden flex flex-col items-center" style={{ background: 'linear-gradient(to bottom, #0d0213, #150524, #0c0211)' }}>
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles size={14} className="text-yellow-400" /> Sound & Cinema Showcase <Sparkles size={14} className="text-yellow-400" />
          </span>
          <h2 className="fancy-title romantic-gradient-text text-3xl md:text-5xl font-extrabold mb-3">
            Our Romantic Video Showcase 🎥
          </h2>
          <p className="text-pink-200/80 font-serif italic text-base md:text-lg max-w-xl mx-auto">
            "Every second with you is a frame of pure love and happiness."
          </p>
        </motion.div>

        {/* Main Video Display Player Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass-card gold-border rounded-3xl p-3 md:p-5 shadow-glow-gold max-w-3xl mx-auto overflow-hidden"
        >
          {/* Video Container Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center group shadow-2xl border border-pink-500/20">
            <video
              ref={videoRef}
              key={currentVideo.url}
              src={currentVideo.url}
              playsInline
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain rounded-2xl"
            />

            {/* Custom Sound & Play Control Overlay */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-pink-600/80 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-green-400" />}
                <span>{isMuted ? 'Muted' : 'Sound On'}</span>
              </button>
            </div>

            {/* Floating Heart Accent */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-pink-900/60 text-pink-200 text-xs font-medium border border-pink-500/30 backdrop-blur-md flex items-center gap-1">
                <Heart size={12} fill="#ff3366" className="text-pink-500" /> {currentVideo.badge}
              </span>
            </div>
          </div>

          {/* Video Selection Thumbnails / Playlist Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {videoList.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => handleVideoSelect(idx)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  currentVideoIndex === idx
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border border-pink-400 shadow-glow scale-105'
                    : 'bg-black/40 hover:bg-black/70 text-pink-200/80 border border-white/10'
                }`}
              >
                <Film size={14} className={currentVideoIndex === idx ? 'text-yellow-300' : 'text-pink-400'} />
                <span>{vid.title}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
