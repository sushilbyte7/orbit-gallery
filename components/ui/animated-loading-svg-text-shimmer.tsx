'use client';

import React from 'react';

export function AnimatedLoadingShimmer() {
    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{
                background: 'transparent',
                pointerEvents: 'none',
            }}
        >
            {/* Pulsing heart / orb */}
            <div className="relative flex items-center justify-center mb-6">
                <span
                    className="block rounded-full"
                    style={{
                        width: 56,
                        height: 56,
                        background: 'radial-gradient(circle, hsl(340,82%,70%) 0%, hsl(267,84%,75%) 100%)',
                        animation: 'loaderPulse 1.6s ease-in-out infinite',
                        boxShadow: '0 0 40px 10px hsl(340 82% 60% / 0.35)',
                    }}
                />
                {/* ring */}
                <span
                    className="absolute block rounded-full"
                    style={{
                        width: 80,
                        height: 80,
                        border: '2px solid hsl(340 82% 65% / 0.35)',
                        animation: 'loaderRing 1.6s ease-in-out infinite',
                    }}
                />
            </div>

            {/* Shimmer text */}
            <svg
                width="220"
                height="28"
                viewBox="0 0 220 28"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(340,30%,70%)" stopOpacity="0.5" />
                        <stop offset="40%" stopColor="hsl(340,82%,68%)" stopOpacity="1" />
                        <stop offset="60%" stopColor="hsl(267,84%,78%)" stopOpacity="1" />
                        <stop offset="100%" stopColor="hsl(340,30%,70%)" stopOpacity="0.5" />
                        <animateTransform
                            attributeName="gradientTransform"
                            type="translate"
                            from="-1 0"
                            to="1 0"
                            dur="1.8s"
                            repeatCount="indefinite"
                        />
                    </linearGradient>
                </defs>
                <text
                    x="110"
                    y="20"
                    textAnchor="middle"
                    fontSize="13"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    fontWeight="300"
                    letterSpacing="0.25em"
                    fill="url(#shimmerGrad)"
                    style={{ textTransform: 'uppercase' }}
                >
                    Loading memories
                </text>
            </svg>

            <style>{`
                @keyframes loaderPulse {
                    0%, 100% { transform: scale(1);   opacity: 1; }
                    50%       { transform: scale(1.15); opacity: 0.8; }
                }
                @keyframes loaderRing {
                    0%   { transform: scale(0.9); opacity: 0.6; }
                    50%  { transform: scale(1.1); opacity: 0.2; }
                    100% { transform: scale(0.9); opacity: 0.6; }
                }
            `}</style>
        </div>
    );
}
