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

    // Still checking localStorage
    if (isUnlocked === null) return null;

    // Unlocked — render the app
    if (isUnlocked) return <>{children}</>;

    // Password screen
    return (
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
                    <input
                        ref={inputRef}
                        type="password"
                        value={input}
                        onChange={e => { setInput(e.target.value); setError(false); }}
                        placeholder="••••••••"
                        autoComplete="off"
                        className="w-full text-center bg-transparent border-b outline-none py-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
                        style={{
                            borderColor: error
                                ? 'hsl(340 82% 60%)'
                                : 'hsl(var(--foreground) / 0.2)',
                            animation: shake ? 'gateShake 0.45s ease' : undefined,
                            fontSize: '1rem',
                            letterSpacing: '0.15em',
                        }}
                    />

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
    );
}
