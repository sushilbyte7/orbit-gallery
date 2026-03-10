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

const captions = [
    "When everything felt right for the first time.",
    "The moment I knew I wanted to see it every day.",
    "Where we talked until the world disappeared.",
    "Staying up just to hear your voice a little longer.",
    "My favorite sound in the whole world.",
    "When I realized home isn't a place, it's you.",
    "How they light up when you talk about what you love.",
    "Dancing in the kitchen like no one's watching.",
    "Getting lost together and finding our way back.",
    "The simplest thing that means everything.",
    "How you make everyone around you feel special.",
    "The best choice I ever made.",
    "A lovely memory to cherish forever."
];

const IMAGES: ImageData[] = [];

// Load all 99 images from the public/images directory
for (let i = 1; i <= 99; i++) {
    IMAGES.push({
        id: `img-${i}`,
        src: `/images/anjali (${i}).webp`,
        alt: `Anjali ${i}`,
        title: `Memory ${i}`,
        description: captions[(i - 1) % captions.length]
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
    containerSize: 600,
    sphereRadius: 200,
    dragSensitivity: 0.8,
    momentumDecay: 0.96,
    maxRotationSpeed: 6,
    baseImageScale: 0.15,
    hoverScale: 1.3,
    perspective: 1000,
    autoRotate: true,
    autoRotateSpeed: 0.2
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
                        {showHero && <GradualSpacing text="FOR ANJALI" />}
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">A collection of beautiful moments</p>
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

