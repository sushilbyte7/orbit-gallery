'use client';

import React, { useState, useEffect, useRef } from 'react';

const CORRECT_PASSWORD = 'anjali123';
const STORAGE_KEY = 'gallery_unlock_ts';
const SESSION_DURATION_MS = 4 * 60 * 1000; // 4 minutes

interface PasswordGateProps {
    children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
    const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check localStorage on mount — auto-unlock if within 4 minutes
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const elapsed = Date.now() - parseInt(stored, 10);
            setIsUnlocked(elapsed < SESSION_DURATION_MS);
        } else {
            setIsUnlocked(false);
        }
    }, []);

    // Focus input when gate appears
    useEffect(() => {
        if (isUnlocked === false) {
            inputRef.current?.focus();
        }
    }, [isUnlocked]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input === CORRECT_PASSWORD) {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
            setIsUnlocked(true);
        } else {
            setError(true);
            setShake(true);
            setInput('');
            setTimeout(() => setShake(false), 500);
        }
    };

    return (
        <>
            {/* Always render children so the gallery starts loading in the background */}
            {children}

            {/* Show password gate overlay if NOT unlocked */}
            {isUnlocked === false && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900">
                    <div className="flex flex-col items-center gap-6 w-full max-w-xs px-6">

                        {/* Icon */}
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, hsl(340,82%,70%) 0%, hsl(267,84%,75%) 100%)',
                                boxShadow: '0 0 32px 8px hsl(340 82% 60% / 0.25)',
                                animation: 'gatePulse 2.4s ease-in-out infinite',
                            }}
                        />

                        {/* Heading */}
                        <div className="text-center space-y-1">
                            <p
                                className="uppercase tracking-[0.3em] font-light text-xs"
                                style={{ color: 'hsl(var(--foreground) / 0.45)' }}
                            >
                                moments
                            </p>
                            <p className="text-slate-700 dark:text-slate-300 text-sm font-light">
                                Enter the password to continue
                            </p>
                        </div>

                        {/* Input form */}
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                            <div className="relative w-full">
                                <input
                                    ref={inputRef}
                                    type={showPassword ? "text" : "password"}
                                    value={input}
                                    onChange={e => { setInput(e.target.value); setError(false); }}
                                    placeholder="••••••••"
                                    autoComplete="off"
                                    className="w-full text-center bg-transparent border-b outline-none py-2 px-10 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
                                    style={{
                                        borderColor: error
                                            ? 'hsl(340 82% 60%)'
                                            : 'hsl(var(--foreground) / 0.2)',
                                        animation: shake ? 'gateShake 0.45s ease' : undefined,
                                        fontSize: '1rem',
                                        letterSpacing: (!showPassword && input.length > 0) ? '0.15em' : 'normal',
                                    }}
                                />
                                {input.length > 0 && (
                                    <button
                                        type="button"
                                        onMouseDown={() => setShowPassword(true)}
                                        onMouseUp={() => setShowPassword(false)}
                                        onMouseLeave={() => setShowPassword(false)}
                                        onTouchStart={() => setShowPassword(true)}
                                        onTouchEnd={() => setShowPassword(false)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 select-none"
                                        aria-label="Press and hold to show password"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                    </button>
                                )}
                            </div>

                            {error && (
                                <p className="text-center text-xs" style={{ color: 'hsl(340 82% 60%)' }}>
                                    Incorrect password. Try again.
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2 rounded-full text-sm font-light tracking-widest uppercase transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, hsl(340,82%,68%), hsl(267,84%,75%))',
                                    color: '#fff',
                                    letterSpacing: '0.2em',
                                    opacity: input.length > 0 ? 1 : 0.5,
                                }}
                            >
                                Enter
                            </button>
                        </form>
                    </div>

                    <style>{`
                        @keyframes gatePulse {
                            0%, 100% { transform: scale(1); opacity: 1; }
                            50%       { transform: scale(1.1); opacity: 0.8; }
                        }
                        @keyframes gateShake {
                            0%, 100% { transform: translateX(0); }
                            20%      { transform: translateX(-8px); }
                            40%      { transform: translateX(8px); }
                            60%      { transform: translateX(-5px); }
                            80%      { transform: translateX(5px); }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
}
