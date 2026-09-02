import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, SkipForward, MessageSquare, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

const LETTERS = [
  {
    id: 'confession',
    title: 'My Confession 💖',
    subtitle: 'From the depths of my soul...',
    icon: <MessageSquare size={16} />,
    content: `Hey babe, i want your love.
we are good couples and i belive we are best partner.
i sure i have no give like you... i love sharing metalty.

your shames make me craze😁
your totaly make me mood, you my mood changer.
i always try talk more romaticaly, i know you like my romance.
i like childish and romances... your jelose fight...
i jelose only your case.

do you no you make treat me change my character?
i avoid my evrthing... iam like your cute anger😆
make me smile, anger about silly matter.
you give me big role in your silly matters.

i dont know why are late meet...
you are the girl give me everything in my life.
enjoy your romance, looking my heart disolved.
how you can make me happy like this?

i think you understand me very very well.
i tell you my evrthing, my every good secret, bad secret... 💖
your... i don't how to love you.`,
    signature: 'Yours and only yours, Hubby'
  },
  {
    id: 'everything',
    title: 'My Everything 💋',
    subtitle: 'To the queen of my heart...',
    icon: <Heart size={16} />,
    content: `Every time that iam with you, my heart still a beating for you.
you are the only person i have ever met who makes the world disappear...
you make me laugh and you make me smile.

you are just the most incredible person that i have ever met in my entire life.
you are a girl of so much faith and so much integrity, and you have my heart like nobody else does.

this is only for you...
my wife, my bubusw, and my life...
my girl, my besty, my woman, my child, my babe,
my secret holder, my soulmate, my supporter,
my owner of beauty character, my princess 💋

you are my everything in my life🫂🫂🫂`,
    signature: 'Your Loving Husband'
  },
  {
    id: 'dreams',
    title: 'Our Trip & Future ✈️',
    subtitle: 'Fulfilling all our sweet dreams...',
    icon: <Compass size={16} />,
    content: `Hey my babe,

Oru day ninw kond oru place povum oru trip... you and me...
antw elaa poothikalum nammale theerkum enitte thirikolu...
aarum kanaathe oru athr dooram povum ninw komde.

avide nee nanum naan nintw kode ulla romatice trip my dream aan.
naan you lips your eyes... nee enai nookiya mathi...
enta kayinu poovum nee entai koode vaneelale enk thaghum.
yaroodum eee enta mansile ula oru eth anoode thoonaathe sneham enk anoode thoonnde.

i want you my mother girl. i sure enta mother anw ishtaavum ninake.
entai parants valiya kariyaan. enat mother girls elai entai ummake nee sotham molavum.
naan ninw hurt akaathe kodoovum.

enni ennai Jelouse akiya edalo😁 naan sad aakum.
naan thnw ready aakum, ninw cool aakum.
randu kadi kodaalum vedila... i enjoy your every bites, naan ath appo parnna full kadi aavum alale aan🙊
i like your teeth so enta flesh antw pall enta bodyilw nee...
ank mansilkum palthum.

naan eghnw ninoode after marriage epoyathe kalaum nee orupaade happy aavum.`,
    signature: 'Your Bubu Husband'
  }
];

export default function AnimatedLetter() {
  const [activeTab, setActiveTab] = useState('confession');
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef(null);

  const currentLetter = LETTERS.find((l) => l.id === activeTab);

  const startTyping = (textToType) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setDisplayedText('');
    setIsDone(false);
    setHasStarted(true);

    let index = 0;
    timerRef.current = setInterval(() => {
      if (index < textToType.length) {
        setDisplayedText((prev) => prev + textToType.charAt(index));
        index++;
      } else {
        clearInterval(timerRef.current);
        setIsDone(true);
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.85 },
          colors: ['#ff3366', '#ffd700', '#ffffff']
        });
      }
    }, 20); // Fast, smooth character typing
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const selected = LETTERS.find((l) => l.id === tabId);
    startTyping(selected.content);
  };

  const handleViewportEnter = () => {
    if (!hasStarted) {
      startTyping(currentLetter.content);
    }
  };

  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText(currentLetter.content);
    setIsDone(true);
    setHasStarted(true);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.85 },
      colors: ['#ff3366', '#ffd700']
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section className="relative py-24 px-4 md:px-8 z-10 overflow-hidden flex flex-col items-center" style={{ background: 'linear-gradient(to bottom, #0d0213, var(--deep-purple))' }}>
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 bg-pink-500 pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full relative z-10">
        <h2 className="fancy-title romantic-gradient-text mb-2 flex items-center justify-center gap-2">
          From My Heart <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
        </h2>
        <p className="section-subtitle mb-10 text-center">
          Tap any of my letters to read my feelings reveal themselves word by word.
        </p>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 md:gap-4 mb-8 border-b border-pink-500/10 pb-4 select-none">
          {LETTERS.map((letter) => (
            <button
              key={letter.id}
              onClick={() => handleTabChange(letter.id)}
              className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 font-serif flex items-center gap-1.5 cursor-pointer ${
                activeTab === letter.id
                  ? 'bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-white shadow-md border border-pink-400/30'
                  : 'text-pink-200/60 hover:text-pink-100 hover:bg-white-5 border border-transparent'
              }`}
            >
              {letter.icon}
              {letter.title}
            </button>
          ))}
        </div>

        {/* Glassmorphic typing sheet */}
        <motion.div
          onViewportEnter={handleViewportEnter}
          viewport={{ once: true, margin: "-80px" }}
          className="glass-card gold-border p-6 md:p-10 shadow-glow relative overflow-hidden"
          style={{
            background: 'rgba(24, 7, 36, 0.4)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Sparkles decorations in corners */}
          <div className="absolute top-4 left-4 text-pink-500/20"><Sparkles size={20} /></div>
          <div className="absolute bottom-4 right-4 text-pink-500/20"><Sparkles size={20} /></div>

          {/* Subtitle / Header */}
          <p className="text-xs uppercase tracking-widest text-yellow-400/80 font-semibold mb-4 text-center font-serif italic">
            {currentLetter.subtitle}
          </p>

          {/* Letter Body */}
          <div className="font-handwriting text-pink-100 text-lg md:text-xl leading-relaxed text-justify whitespace-pre-line select-none min-h-[300px]">
            {displayedText}
            {!isDone && hasStarted && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-5 bg-pink-400 ml-1 vertical-middle"
              >
                |
              </motion.span>
            )}

            {isDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 pt-4 border-t border-pink-500/10 flex flex-col items-end"
              >
                <p className="italic text-pink-300/80 font-serif text-sm">With all my love,</p>
                <p className="font-bold text-yellow-300 font-serif text-base md:text-lg mt-1">{currentLetter.signature} ❤️</p>
              </motion.div>
            )}
          </div>

          {/* Control Bar */}
          <div className="mt-8 pt-4 border-t border-white-5 flex justify-between items-center flex-wrap gap-3">
            <span className="text-[10px] uppercase tracking-widest text-pink-300 font-bold font-mono">
              {isDone ? '✨ Read with love' : '✍️ Writing lines...'}
            </span>
            
            {!isDone && (
              <button
                onClick={handleSkip}
                className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white-5 hover:bg-pink-600 border border-white-10 text-white font-semibold text-xs transition-all duration-200 cursor-pointer shadow-sm"
              >
                <SkipForward size={10} /> Skip Animation
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .font-handwriting {
          font-family: 'Dancing Script', cursive;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}

