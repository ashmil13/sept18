import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Flames() {
  const [name, setName] = useState('');
  const [partner, setPartner] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(-1);
  const [result, setResult] = useState(null);

  const calculateFlamesResult = (name1, name2) => {
    const n1 = name1.toLowerCase().trim();
    const n2 = name2.toLowerCase().trim();

    // Custom romantic Easter Egg for Aysha/Aisha and Ashmil
    const isAyshaAndAshmil = 
      ((n1.includes('aysha') || n1.includes('aisha')) && n2.includes('ashmil')) ||
      (n1.includes('ashmil') && (n2.includes('aysha') || n2.includes('aisha')));

    if (isAyshaAndAshmil) {
      return {
        letter: 'M',
        relation: 'Marriage 💍✨',
        emoji: '💖👩‍❤️‍👨💞',
        desc: 'Aysha & Ashmil: Bound together in a beautiful marriage of love, laughter, and lifelong partnership. A match made in heaven. Happy Birthday to my gorgeous wife, the queen of my heart! ❤️'
      };
    }

    // Standard FLAMES algorithm
    let name1Chars = name1.toLowerCase().replace(/[^a-z]/g, '').split('');
    let name2Chars = name2.toLowerCase().replace(/[^a-z]/g, '').split('');

    // Remove common characters
    for (let i = 0; i < name1Chars.length; i++) {
      const char = name1Chars[i];
      const index = name2Chars.indexOf(char);
      if (index !== -1) {
        name1Chars.splice(i, 1);
        name2Chars.splice(index, 1);
        i--; // Adjust index after splice
      }
    }

    const count = name1Chars.length + name2Chars.length;
    if (count === 0) {
      return {
        letter: 'M',
        relation: 'Marriage',
        emoji: '💍',
        desc: 'Complete harmony! You are bound for a lifetime of love and togetherness.'
      };
    }

    let flamesList = ['F', 'L', 'A', 'M', 'E', 'S'];
    let index = 0;
    while (flamesList.length > 1) {
      index = (index + count - 1) % flamesList.length;
      flamesList.splice(index, 1);
    }

    const resultChar = flamesList[0];
    const mapping = {
      'F': { letter: 'F', relation: 'Friends', emoji: '🤝', desc: 'A beautiful bond of trust, laughter, and endless conversations.' },
      'L': { letter: 'L', relation: 'Love', emoji: '❤️', desc: 'True, passionate love that makes the heart beat faster.' },
      'A': { letter: 'A', relation: 'Affection', emoji: '💖', desc: 'Deep care, support, and warmth between two caring souls.' },
      'M': { letter: 'M', relation: 'Marriage', emoji: '💍', desc: 'Forever together, bound by love, rings, and vows.' },
      'E': { letter: 'E', relation: 'Enemy (Playful Rivalry)', emoji: '⚡', desc: 'Opposites attract! You keep each other on your toes with playful banter.' },
      'S': { letter: 'S', relation: 'Soulmates', emoji: '✨', desc: 'Connected at the deepest level, destined for each other.' }
    };

    return mapping[resultChar];
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!name.trim() || !partner.trim()) return;

    setIsCalculating(true);
    setResult(null);
    setCurrentHighlight(-1);

    const finalResult = calculateFlamesResult(name, partner);

    // Light-up animation for letters (cycling through F-L-A-M-E-S)
    let count = 0;
    const interval = setInterval(() => {
      setCurrentHighlight(count % 6);
      count++;
      if (count > 18) {
        clearInterval(interval);
        setResult(finalResult);
        setIsCalculating(false);
        setCurrentHighlight(-1);

        // Burst of love confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#ff3366', '#ffd700', '#ff80a0', '#ffffff']
        });
      }
    }, 150);
  };

  const handleReset = () => {
    setName('');
    setPartner('');
    setResult(null);
    setIsCalculating(false);
    setCurrentHighlight(-1);
  };

  const letters = ['F', 'L', 'A', 'M', 'E', 'S'];

  return (
    <section id="flames" className="flames-section">
      <div className="max-w-4xl mx-auto text-center w-full relative z-10">
        <h2 className="fancy-title romantic-gradient-text mb-2">FLAMES Match</h2>
        <p className="section-subtitle">
          Test the relationship chemistry and check if the stars align! Enter your name and your partner's name.
        </p>

        <div className="flames-container mx-auto">
          <div className="flames-card glass-card">
            
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="flames-input-group">
                <label className="flames-label">Your Name</label>
                <input
                  type="text"
                  required
                  disabled={isCalculating || result !== null}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ashmil"
                  className="flames-input"
                />
              </div>

              <div className="flames-input-group">
                <label className="flames-label">Partner's Name</label>
                <input
                  type="text"
                  required
                  disabled={isCalculating || result !== null}
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  placeholder="e.g. Aysha"
                  className="flames-input"
                />
              </div>

              {/* F-L-A-M-E-S Dashboard */}
              <div className="flames-letters-row">
                {letters.map((letter, idx) => {
                  const isHighlighted = currentHighlight === idx;
                  const isFinal = result && result.letter === letter;
                  return (
                    <span 
                      key={idx} 
                      className={`flames-letter ${isHighlighted ? 'active' : ''} ${isFinal ? 'final' : ''}`}
                    >
                      {letter}
                    </span>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {!result && (
                  <motion.button
                    type="submit"
                    disabled={isCalculating || !name.trim() || !partner.trim()}
                    className="flames-button hover-scale-105"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {isCalculating ? 'Calculating Magic...' : 'Calculate FLAMES 💖'}
                  </motion.button>
                )}
              </AnimatePresence>
            </form>

            {/* Results Reveal Card */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="flames-result-area mt-6"
                >
                  <div className="heart-seal mb-4">
                    <Heart fill="#ff3366" className="text-pink-500 animate-pulse mx-auto" size={32} />
                  </div>

                  <h3 className="flames-result-title">
                    Relation: {result.emoji} <span className="highlight">{result.relation}</span> {result.emoji}
                  </h3>

                  <p className="flames-result-desc font-serif">
                    "{result.desc}"
                  </p>

                  <button
                    onClick={handleReset}
                    className="flames-reset-button"
                  >
                    <RefreshCw size={14} /> Try Another Match
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* Vanilla CSS Styles */}
      <style>{`
        .flames-section {
          position: relative;
          padding: 6rem 1rem;
          background: linear-gradient(to bottom, #0d0213 0%, #170425 50%, #0d0213 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }
        .flames-container {
          width: 100%;
          max-width: 500px;
        }
        .flames-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1.5px solid var(--rose-gold);
          box-shadow: 0 0 25px rgba(229, 169, 59, 0.2);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          margin-top: 1rem;
        }
        .flames-input-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }
        .flames-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #f9a8d4;
          margin-bottom: 0.5rem;
          font-family: var(--font-sans);
        }
        .flames-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }
        .flames-input:focus {
          border-color: #ff3366;
          box-shadow: 0 0 10px rgba(255, 51, 102, 0.4), inset 0 2px 4px rgba(0,0,0,0.2);
        }
        .flames-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .flames-button {
          width: 100%;
          background: linear-gradient(to right, #ff3366, #ff80a0);
          border: 1.5px solid #ff4d6d;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 9999px;
          padding: 0.85rem;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(255, 51, 102, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 1rem;
        }
        .flames-button:hover:not(:disabled) {
          transform: scale(1.03);
          box-shadow: 0 0 25px rgba(255, 51, 102, 0.75);
        }
        .flames-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
        .flames-letters-row {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin: 1.8rem 0;
          user-select: none;
        }
        .flames-letter {
          font-size: 2rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.12);
          transition: all 0.2s ease;
          font-family: var(--font-sans);
        }
        .flames-letter.active {
          color: #ffd700;
          text-shadow: 0 0 10px #ffd700, 0 0 20px #ff3366;
          transform: scale(1.3);
        }
        .flames-letter.final {
          color: #ff3366;
          text-shadow: 0 0 12px rgba(255, 51, 102, 0.85), 0 0 24px rgba(255, 51, 102, 0.4);
          transform: scale(1.4);
          animation: finalPulse 1s ease-in-out infinite alternate;
        }
        @keyframes finalPulse {
          0% { transform: scale(1.4); }
          100% { transform: scale(1.48); }
        }
        .flames-result-area {
          border-top: 1px dashed rgba(255, 255, 255, 0.15);
          padding-top: 1.8rem;
          animation: slideUp 0.5s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .flames-result-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.85rem;
        }
        .flames-result-title .highlight {
          color: #facc15;
          text-shadow: 0 0 10px rgba(250, 204, 21, 0.4);
        }
        .flames-result-desc {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto 1.5rem auto;
          font-style: italic;
        }
        .flames-reset-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          padding: 0.5rem 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 auto;
        }
        .flames-reset-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--rose-gold);
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}
