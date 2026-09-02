import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleAutoFill = () => {
    setEmail('ayshu18@gmail.com');
    setPassword('bubu18baba13');
    setErrorMsg('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const formattedEmail = email.trim().toLowerCase();
    const formattedPassword = password.trim();

    if (formattedEmail === 'ayshu18@gmail.com' && formattedPassword === 'bubu18baba13') {
      setIsUnlocking(true);

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#0d6efd', '#6610f2', '#ff3366', '#ffd700', '#ffffff'],
      });

      setTimeout(() => {
        onLoginSuccess();
      }, 1100);
    } else {
      setIsShaking(true);
      if (!formattedEmail || !formattedPassword) {
        setErrorMsg('Please enter both your email and password!');
      } else {
        setErrorMsg('Incorrect email or password. Only Ayshu & Bubusai can access!');
      }

      setTimeout(() => {
        setIsShaking(false);
      }, 650);
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-primary bg-gradient p-3 z-3 user-select-none">
      {/* Bootstrap Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={
          isShaking
            ? { x: [-12, 12, -8, 8, -4, 4, 0], opacity: 1, scale: 1, y: 0 }
            : isUnlocking
            ? { scale: 1.05, opacity: 0, transition: { duration: 0.8 } }
            : { opacity: 1, scale: 1, y: 0 }
        }
        className="card border-0 shadow-lg rounded-4 w-100 my-auto"
        style={{ maxWidth: '380px' }}
      >
        <div className="card-body p-4 p-sm-5 text-dark">
          {/* Title */}
          <h2 className="card-title text-center font-bold mb-4 fw-extrabold text-primary">
            Login
          </h2>

          {/* Error Alert Box */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3"
                role="alert"
              >
                <ShieldAlert size={16} className="text-danger flex-shrink-0" />
                <div>{errorMsg}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secret Credentials Hint Box */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-info py-2 px-3 small mb-3"
              >
                <div className="fw-bold mb-1">Secret Credentials:</div>
                <div>Email: <strong>ayshu18@gmail.com</strong></div>
                <div>Password: <strong>bubu18baba13</strong></div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="btn btn-link btn-sm p-0 mt-1 text-decoration-none fw-bold"
                >
                  🪄 Click here to Auto-Fill
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bootstrap Form */}
          <form onSubmit={handleLogin}>
            {/* Email Floating Label Input */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingEmail">Email address</label>
            </div>

            {/* Password Floating Label Input */}
            <div className="form-floating mb-3 position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-link text-secondary position-absolute end-0 top-50 translate-middle-y text-decoration-none me-2"
                style={{ zIndex: 5 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Bootstrap Primary Submit Button */}
            <button
              type="submit"
              disabled={isUnlocking}
              className="btn btn-primary btn-lg w-100 mt-2 py-2.5 rounded-3 fw-semibold shadow-sm d-flex justify-content-center align-items-center gap-2"
            >
              {isUnlocking ? (
                <>
                  <Sparkles size={18} className="spinner-border spinner-border-sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>

            {/* Footer Links */}
            <div className="text-center mt-4 small text-muted">
              <div className="mb-1">
                Forgot{' '}
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                >
                  Password
                </button>
                ?
              </div>
              <div>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
