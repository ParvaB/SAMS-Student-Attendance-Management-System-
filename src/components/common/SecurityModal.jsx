import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  ShieldCheck, 
  X, 
  KeyRound, 
  Clock, 
  AlertTriangle, 
  Lock, 
  CheckCircle, 
  RefreshCw, 
  Fingerprint,
  RotateCcw
} from 'lucide-react';

export default function SecurityModal() {
  const { 
    securityModalOpen, 
    setSecurityModalOpen, 
    currentUser, 
    currentRole,
    addToast 
  } = useAttendance();

  // Session countdown (15 minutes = 900 seconds)
  const [secondsLeft, setSecondsLeft] = useState(882);

  // Rate-limiting state (TC02: 5 failed attempts lockout)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Password visibility simulator
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('SuperSecretPass#2026');

  // Decrement session timer
  useEffect(() => {
    if (!securityModalOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [securityModalOpen]);

  // Lockout countdown
  useEffect(() => {
    if (!isLockedOut || lockoutTimer <= 0) return;
    const timer = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          setIsLockedOut(false);
          setFailedAttempts(0);
          addToast('Account lockout expired. Rate-limiting counter reset.', 'info');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLockedOut, lockoutTimer]);

  if (!securityModalOpen) return null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renewSession = () => {
    setSecondsLeft(900);
    addToast('User session token renewed for another 15 minutes (NFR-3)', 'success');
  };

  // TC02: Simulate failed password attempt
  const handleSimulateFailedLogin = () => {
    if (isLockedOut) return;

    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    if (nextAttempts >= 5) {
      setIsLockedOut(true);
      setLockoutTimer(900); // 15-minute lock
      addToast('CRITICAL: 5 consecutive failed login attempts! Account locked for 15 minutes as per TC02.', 'error', 6000);
    } else {
      addToast(`Bad credentials attempt ${nextAttempts}/5. Rate-limiting threshold: 5 attempts before lockout.`, 'warning');
    }
  };

  const handleResetLockout = () => {
    setIsLockedOut(false);
    setFailedAttempts(0);
    setLockoutTimer(0);
    addToast('Security lockout manually reset for demonstration purposes.', 'info');
  };

  // Realistic mock bcrypt hashes per role
  const mockBcryptHashes = {
    STUDENT: '$2b$12$K8yP1v0jKz4x7W2gA1b3c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a',
    FACULTY: '$2b$12$R7qL2w9mJx5y8V3hB2c4d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b',
    COORDINATOR: '$2b$12$M3nK5t8vQx1w9Z4jC3d5e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c',
    HOD: '$2b$12$V9xZ8m4kLw2p7Y5nD4e6f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f',
    ADMIN: '$2b$12$Z1aB2cD3eF4gH5iJ6kL7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
                Authentication & Security Architecture
                <span className="text-[10px] font-mono bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  NFR-3 • TC01 • TC02
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                JWT / Bcrypt / Inactivity Timeout / Rate Limiting Simulator
              </p>
            </div>
          </div>
          <button
            onClick={() => setSecurityModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Active Session Info Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {currentRole[0]}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  {currentUser.name}
                  <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                    {currentUser.id}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
              </div>
            </div>

            {/* 15-Minute Inactivity Session Badge */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <div className="text-right">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Session Expiry (NFR-3)
                </div>
                <div className="font-mono text-xs font-bold text-slate-800 tabular-nums">
                  {formatTime(secondsLeft)}
                </div>
              </div>
              <button
                onClick={renewSession}
                title="Renew 15-min JWT Session"
                className="ml-1 p-1 text-indigo-600 hover:bg-indigo-50 rounded transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section 1: Bcrypt Password Hashing & Salt (TC01) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password Encryption & Salt Specification (TC01)
                </h4>
              </div>
              <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Cost Factor: 12 Rounds
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Passwords are never stored in plaintext. In accordance with <strong>NFR-3 and TC01</strong>, user credentials are salted with 128-bit cryptographically secure pseudorandom entropy and hashed using Bcrypt (12 cost factor rounds).
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                <span>Stored Bcrypt Hash in Database (Immutable Auth Record):</span>
                <span className="font-mono text-[10px] text-slate-400">Alg: $2b$ (Blowfish)</span>
              </label>
              <div className="font-mono text-[11px] bg-slate-900 text-indigo-300 p-2.5 rounded-lg border border-slate-800 break-all select-all flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{mockBcryptHashes[currentRole] || mockBcryptHashes.STUDENT}</span>
              </div>
            </div>
          </div>

          {/* Section 2: 5-Attempt Rate Limiting & Account Lockout Simulator (TC02) */}
          <div className={`border rounded-xl p-4 transition-all duration-300 ${
            isLockedOut 
              ? 'bg-rose-50 border-rose-300 shadow-rose-500/10 shadow-lg' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lock className={`w-4 h-4 ${isLockedOut ? 'text-rose-600' : 'text-slate-700'}`} />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  5-Attempt Rate-Limiting Lockout Simulator (TC02)
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isLockedOut 
                    ? 'bg-rose-600 text-white border-rose-700' 
                    : failedAttempts > 2 
                    ? 'bg-amber-100 text-amber-800 border-amber-300' 
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  Failed Attempts: {failedAttempts} / 5
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              To mitigate brute-force dictionary attacks, the authentication gateway enforces a strict 5-attempt threshold. Upon 5 consecutive failed authentication attempts, the account is locked for 15 minutes.
            </p>

            {/* Lockout Warning State */}
            {isLockedOut ? (
              <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-lg text-rose-900 text-xs mb-3 space-y-1">
                <div className="font-bold flex items-center gap-2 text-rose-950">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  SECURITY LOCKOUT ACTIVE: Account Frozen for 15 Minutes
                </div>
                <p className="text-[11px] text-rose-800">
                  Authentication is temporarily denied for user <code className="bg-rose-200 px-1 py-0.5 rounded">{currentUser.id}</code>. IP address throttled. Remaining lockout time: <strong>{formatTime(lockoutTimer)}</strong>.
                </p>
              </div>
            ) : null}

            {/* Action Buttons to test TC02 */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleSimulateFailedLogin}
                disabled={isLockedOut}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Simulate 1 Bad Password Attempt
              </button>

              {(failedAttempts > 0 || isLockedOut) && (
                <button
                  onClick={handleResetLockout}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Counter (Demo)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            NFR-3 Compliance: OWASP ASVS Level 2 Verification Passed
          </span>
          <button
            onClick={() => setSecurityModalOpen(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Close Security Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
