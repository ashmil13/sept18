import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import defaultWishes from '../data/wishes.json';

export default function Wishes() {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const storedWishes = localStorage.getItem('ayshu_birthday_wishes');
      if (storedWishes) {
        setWishes(JSON.parse(storedWishes));
      } else {
        localStorage.setItem('ayshu_birthday_wishes', JSON.stringify(defaultWishes));
        setWishes(defaultWishes);
      }
    } catch (err) {
      console.error('Error reading wishes from localStorage:', err);
      setWishes(defaultWishes);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);

    setTimeout(() => {
      const newWish = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
        name: name.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
      };

      const updatedWishes = [newWish, ...wishes];
      setWishes(updatedWishes);

      try {
        localStorage.setItem('ayshu_birthday_wishes', JSON.stringify(updatedWishes));
      } catch (err) {
        console.error('Error saving wish to localStorage:', err);
      }

      setName('');
      setMessage('');
      setSubmitting(false);

      // Burst hearts on submit!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ff3366', '#ff80a0']
      });
    }, 400);
  };


  return (
    <section className="relative py-24 px-4 md:px-8 z-10 overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--deep-purple), #0c0211)' }}>
      {/* Decorative background lights */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl z-0 pointer-events-none" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="fancy-title romantic-gradient-text mb-2">Birthday Wishes</h2>
        <p className="section-subtitle">
          Leave a sweet note, a warm wish, or a loving message to celebrate this magical birthday!
        </p>

        <div className="grid grid-cols-1 lg-grid-cols-12 gap-8 mt-12 items-start">
          {/* Write a Wish Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg-col-span-5 glass-card gold-border p-6 shadow-glow"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-1-5 font-serif italic">
              <Sparkles size={16} className="text-yellow-400" /> Send Sweet Love
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-pink-300 uppercase tracking-widest mb-1-5">
                  Your Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Your Hubby ❤️"
                    className="w-full bg-black-40 border border-white-10 rounded-xl py-2-5 pl-10 pr-4 text-sm text-white placeholder-white-30 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 uppercase tracking-widest mb-1-5">
                  Your Birthday Message
                </label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-pink-400" />
                  <textarea
                    required
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a sweet message, blessing, or love note..."
                    className="w-full bg-black-40 border border-white-10 rounded-xl py-2-5 pl-10 pr-4 text-sm text-white placeholder-white-30 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1-5 px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-sm tracking-wider uppercase transition-all duration-300 shadow-glow disabled:opacity-50"
              >
                <Send size={14} /> {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* List of Wishes */}
          <div className="lg-col-span-7 flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: '500px' }}>
            {loading ? (
              <div className="py-12 text-center text-pink-200 text-sm">
                <div className="inline-block w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p>Loading sweet wishes...</p>
              </div>
            ) : wishes.length === 0 ? (
              <div className="glass-card p-8 text-center text-white-50 text-xs italic">
                No wishes left yet. Be the first to leave a message!
              </div>
            ) : (
              <AnimatePresence>
                {wishes.map((wish, index) => (
                  <motion.div
                    key={wish.id || wish._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="glass-card border border-white-5 p-5 relative shadow-md"
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="text-sm font-bold text-yellow-300 flex items-center gap-1">
                        <Heart fill="#ff3366" size={10} className="text-pink-500" /> {wish.name}
                      </h4>
                      <span className="text-xs text-white-40 font-mono">
                        {new Date(wish.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-pink-100-90 leading-relaxed font-light font-serif italic">
                      "{wish.message}"
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
