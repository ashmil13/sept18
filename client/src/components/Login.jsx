import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldAlert, Sparkles, Lock, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Handle Lockout countdown timer
  useEffect(() => {
    let timer;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
    } else if (lockoutTime === 0 && failedAttempts >= 5) {
      setFailedAttempts(0);
      setErrorMsg('');
    }
    return () => clearInterval(timer);
  }, [lockoutTime, failedAttempts]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setErrorMsg('');

    const formattedEmail = email.trim().toLowerCase();
    const formattedPassword = password.trim();

    // STRICT PREDEFINED CREDENTIAL AUTHENTICATION
    if (formattedEmail === 'ayshu18@gmail.com' && formattedPassword === 'bubu18baba13') {
      setIsUnlocking(true);
      setFailedAttempts(0);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#ff3366', '#ffd700', '#6610f2', '#ffffff'],
      });

      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } else {
      const newFailCount = failedAttempts + 1;
      setFailedAttempts(newFailCount);
      setIsShaking(true);

      if (newFailCount >= 5) {
        setLockoutTime(30);
        setErrorMsg('Too many failed attempts! Portal locked for 30 seconds for security.');
      } else {
        setErrorMsg(`Access Denied! Invalid credentials. Only authorized access allowed (${5 - newFailCount} attempts remaining).`);
      }

      setTimeout(() => {
        setIsShaking(false);
      }, 650);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0210] selection:bg-pink-600 selection:text-white select-none overflow-hidden">
      {/* Background Animated Glow */}
      <div className="absolute w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Security Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={
          isShaking
            ? { x: [-14, 14, -10, 10, -5, 5, 0], opacity: 1, scale: 1, y: 0 }
            : isUnlocking
            ? { scale: 1.08, opacity: 0, transition: { duration: 0.8 } }
            : { opacity: 1, scale: 1, y: 0 }
        }
        className="w-full max-w-md glass-card gold-border rounded-3xl p-6 md:p-8 shadow-glow-gold relative z-10"
      >
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-pink-600/20 border border-pink-500/40 flex items-center justify-center mb-3 shadow-glow">
            <Lock className="text-pink-400" size={28} />
          </div>
          <h2 className="fancy-title romantic-gradient-text text-2xl md:text-3xl font-extrabold mb-1">
            Private Portal Access
          </h2>
          <p className="text-xs text-pink-200/70 uppercase tracking-widest font-medium">
            Strict Predefined Authentication
          </p>
        </div>

        {/* Security Alert Box */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2"
            >
              <ShieldAlert size={18} className="text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Strict Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1.5">
              Authorized Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your authorized email"
              required
              disabled={lockoutTime > 0 || isUnlocking}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-pink-500/30 text-white placeholder-pink-300/40 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={lockoutTime > 0 || isUnlocking}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-pink-500/30 text-white placeholder-pink-300/40 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-300 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={lockoutTime > 0 || isUnlocking}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white font-bold text-sm uppercase tracking-widest shadow-glow border border-pink-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUnlocking ? (
              <>
                <Sparkles size={18} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : lockoutTime > 0 ? (
              <span>Locked ({lockoutTime}s)</span>
            ) : (
              <>
                <KeyRound size={18} />
                <span>Unlock Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center text-[11px] text-pink-300/50 uppercase tracking-widest font-light flex items-center justify-center gap-1">
          <ShieldAlert size={12} className="text-pink-400" /> Authorized Couple Portal Only
        </div>
      </motion.div>
    </div>
  );
}
