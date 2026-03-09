'use client';

import SphereImageGrid, { ImageData } from "@/components/ui/img-sphere";
import ThemeSwitch from "@/components/ui/theme-switch";
import { AnimatedLoadingShimmer } from "@/components/ui/animated-loading-svg-text-shimmer";
import { PasswordGate } from "@/components/ui/password-gate";
import GradualSpacing from "@/components/ui/hero-shutter-text";
import DustParticles from "@/components/ui/dust-particles";
import React, { useState, useEffect, useCallback, useRef } from 'react';

// ==========================================
// EASY CONFIGURATION - Edit these values to customize the component
// ==========================================

const BASE_IMAGES: Omit<ImageData, 'id'>[] = [
    {
        src: "https://images.unsplash.com/photo-1758178309498-036c3d7d73b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Memory 1",
        title: "That day",
        description: "When everything felt right for the first time."
    },
    {
        src: "https://images.unsplash.com/photo-1757647016230-d6b42abc6cc9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2072",
        alt: "Memory 2",
        title: "Your smile",
        description: "The moment I knew I wanted to see it every day."
    },
    {
        src: "https://images.unsplash.com/photo-1757906447358-f2b2cb23d5d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Memory 3",
        title: "Our place",
        description: "Where we talked until the world disappeared."
    },
    {
        src: "https://images.unsplash.com/photo-1742201877377-03d18a323c18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
        alt: "Memory 4",
        title: "Late nights",
        description: "Staying up just to hear your voice a little longer."
    },
    {
        src: "https://images.unsplash.com/photo-1757081791153-3f48cd8c67ac?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Memory 5",
        title: "The way you laugh",
        description: "My favorite sound in the whole world."
    },
    {
        src: "https://images.unsplash.com/photo-1757626961383-be254afee9a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Memory 6",
        title: "Quiet mornings",
        description: "When I realized home isn't a place, it's you."
    },
    {
        src: "https://images.unsplash.com/photo-1756748371390-099e4e6683ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Memory 7",
        title: "Your eyes",
        description: "How they light up when you talk about what you love."
    },
    {
        src: "https://images.unsplash.com/photo-1755884405235-5c0213aa3374?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Memory 8",
        title: "Silly moments",
        description: "Dancing in the kitchen like no one's watching."
    },
    {
        src: "https://images.unsplash.com/photo-1757495404191-e94ed7e70046?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Memory 9",
        title: "Weekend adventures",
        description: "Getting lost together and finding our way back."
    },
    {
        src: "https://images.unsplash.com/photo-1756197256528-f9e6fcb82b04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
        alt: "Memory 10",
        title: "Holding hands",
        description: "The simplest thing that means everything."
    },
    {
        src: "https://images.unsplash.com/photo-1534083220759-4c3c00112ea0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Memory 11",
        title: "Your kindness",
        description: "How you make everyone around you feel special."
    },
    {
        src: "https://images.unsplash.com/photo-1755278338891-e8d8481ff087?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1674",
        alt: "Memory 12",
        title: "Every day with you",
        description: "The best choice I ever made."
    }
];

// Generate more images by repeating the base set
const IMAGES: ImageData[] = [];
for (let i = 0; i < 60; i++) {
    const baseIndex = i % BASE_IMAGES.length;
    const baseImage = BASE_IMAGES[baseIndex];
    IMAGES.push({
        id: `img-${i + 1}`,
        ...baseImage,
        alt: `${baseImage.alt} (${Math.floor(i / BASE_IMAGES.length) + 1})`
    });
}

// Component configuration - easily adjustable
interface SphereConfig {
    containerSize: number;
    sphereRadius: number;
    dragSensitivity: number;
    momentumDecay: number;
    maxRotationSpeed: number;
    baseImageScale: number;
    hoverScale: number;
    perspective: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
}

const CONFIG: SphereConfig = {
    containerSize: 600,          // Container size in pixels
    sphereRadius: 200,           // Virtual sphere radius (increased for better spacing)
    dragSensitivity: 0.8,        // Mouse drag sensitivity (0.1 - 2.0)
    momentumDecay: 0.96,         // How fast momentum fades (0.8 - 0.99)
    maxRotationSpeed: 6,         // Maximum rotation speed (1 - 10)
    baseImageScale: 0.15,        // Base image size (reduced to minimize overlap)
    hoverScale: 1.3,             // Hover scale multiplier (1.0 - 2.0)
    perspective: 1000,           // CSS perspective value (500 - 2000)
    autoRotate: true,            // Enable/disable auto rotation
    autoRotateSpeed: 0.2         // Auto rotation speed (0.1 - 2.0, higher = faster)
};

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [showHero, setShowHero] = useState(false);
    const settledCount = useRef(0);
    const totalImages = IMAGES.length;

    // Dismiss loader once all images settle (load or error)
    const handleImageSettle = useCallback(() => {
        settledCount.current += 1;
        if (settledCount.current >= totalImages) {
            setIsLoading(false);
        }
    }, [totalImages]);

    // Fallback: hide loader after 4 seconds no matter what
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    // Mount HeroText 300ms after loader is gone so GSAP animation plays fresh
    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setShowHero(true), 300);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <PasswordGate>
            <main className="relative w-full p-4 sm:p-6 flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 transition-colors duration-300">

                {/* Subtle floating dust particles */}
                <DustParticles />

                {/* Loading overlay */}
                {isLoading && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-amber-50/80 dark:bg-slate-950/80 backdrop-blur-sm"
                        style={{ transition: 'opacity 0.5s ease' }}
                    >
                        <AnimatedLoadingShimmer />
                    </div>
                )}

                {/* Gallery content fades in after loading */}
                <div
                    className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-4xl"
                    style={{
                        opacity: isLoading ? 0 : 1,
                        transition: 'opacity 0.6s ease',
                    }}
                >
                    {/* Gallery label in top-left corner */}
                    <div
                        className="absolute top-8 left-8 z-10 uppercase tracking-[0.3em] font-light"
                        style={{
                            fontFamily: 'ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                            fontSize: 'clamp(.75rem, 1.5vw, 1rem)',
                            color: 'hsl(var(--foreground) / .5)'
                        }}
                    >
                        moments
                    </div>

                    {/* Theme Switch in top-right corner */}
                    <div className="fixed top-4 right-4 z-50">
                        <ThemeSwitch />
                    </div>

                    <div className="absolute top-24 inset-x-0 text-center space-y-2 px-4 sm:static sm:inset-x-auto">
                        {showHero && <GradualSpacing text="HER" />}
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">All the moments that matter</p>
                    </div>

                    <SphereImageGrid
                        images={IMAGES}
                        {...CONFIG}
                        onImageSettle={handleImageSettle}
                    />

                </div>
            </main>
        </PasswordGate>
    );
}

