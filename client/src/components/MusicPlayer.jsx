import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef(null);

  // Default romantic piano music: Erik Satie's Gymnopedie No 1
  const defaultTrack = 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Gymnopedie_No_1.mp3';
  const [audioUrl, setAudioUrl] = useState(defaultTrack);

  const handleAudioError = () => {
    if (audioUrl !== defaultTrack) {
      setAudioUrl(defaultTrack);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowTooltip(false);
      }).catch(err => {
        console.warn("Audio autoplay blocked by browser. User interaction needed:", err);
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {/* Floating Vinyl Player */}
      <div className="relative group">
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-16 left-0 bg-pink-600 text-white text-xs px-3 py-1-5 rounded-lg shadow-lg whitespace-nowrap animate-bounce border border-pink-400">
            Click here for romantic music! 🌹❤️
            <div className="absolute left-5 w-2.5 h-2.5 bg-pink-600 rotate-45 border-r border-b border-pink-400" style={{ bottom: '-5px' }}></div>
          </div>
        )}

        <button
          onClick={togglePlay}
          className={`flex items-center justify-center w-14 h-14 rounded-full glass-card gold-border transition-all-300 shadow-glow relative overflow-hidden ${
            isPlaying ? 'rotate-infinite' : 'hover-scale-105'
          }`}
          style={{
            animation: isPlaying ? 'spin 6s linear infinite' : 'none',
            zIndex: 10
          }}
        >
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <span className="absolute w-2 h-2 bg-pink-900 rounded-full border border-yellow-400 z-10"></span>
              {/* Vinyl lines */}
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-700 opacity-60 flex items-center justify-center">
                <Music size={16} className="text-pink-400 animate-pulse" />
              </div>
            </div>
          ) : (
            <Play size={20} className="text-pink-400 fill-pink-400 ml-1" />
          )}
        </button>

        {/* Music Controls overlay panel on hover */}
        <div className="absolute left-16 top-half translate-y-half flex items-center gap-2.5 bg-black-60 backdrop-blur-md border border-white-10 rounded-full px-4 py-2 opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-300">
          <button onClick={togglePlay} className="text-pink-400 hover:text-pink-300">
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          
          <button onClick={toggleMute} className="text-pink-400 hover:text-pink-300">
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-pink-900 rounded-lg appearance-none cursor-pointer"
          />

          {/* Mini Visualizer */}
          {isPlaying && (
            <div className="flex items-end gap-0-5 h-3 ml-1">
              <span className="w-0.5 bg-pink-400 rounded-full animate-bar-1"></span>
              <span className="w-0.5 bg-pink-400 rounded-full animate-bar-2"></span>
              <span className="w-0.5 bg-pink-400 rounded-full animate-bar-3"></span>
              <span className="w-0.5 bg-pink-400 rounded-full animate-bar-4"></span>
            </div>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onError={handleAudioError}
        loop
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-bar-1 { animation: bar-jump 0.8s ease-in-out infinite alternate; height: 100%; }
        .animate-bar-2 { animation: bar-jump 1.1s ease-in-out infinite alternate; height: 80%; animation-delay: 0.15s; }
        .animate-bar-3 { animation: bar-jump 0.9s ease-in-out infinite alternate; height: 60%; animation-delay: 0.3s; }
        .animate-bar-4 { animation: bar-jump 1.2s ease-in-out infinite alternate; height: 90%; animation-delay: 0.05s; }
        
        @keyframes bar-jump {
          0% { height: 2px; }
          100% { height: 12px; }
        }
      `}</style>
    </div>
  );
}
