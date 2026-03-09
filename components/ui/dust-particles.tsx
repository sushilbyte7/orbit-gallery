'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speedY: number;
    speedX: number;
}

function createParticle(w: number, h: number): Particle {
    return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.5,       // 0.5–2.5 px
        opacity: Math.random() * 0.35 + 0.05, // 0.05–0.40
        speedY: -(Math.random() * 0.3 + 0.05), // slow upward
        speedX: (Math.random() - 0.5) * 0.15,  // slight horizontal drift
    };
}

export default function DustParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-seed so particles don't cluster after resize
            particles = Array.from({ length: 60 }, () =>
                createParticle(canvas.width, canvas.height)
            );
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Pick a color that's visible in both light and dark themes
            const isDark = document.documentElement.classList.contains('dark');
            const particleColor = isDark
                ? '255, 210, 225'   // soft rose — visible on dark background
                : '140,  80, 120';  // muted plum — visible on light background

            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
                ctx.fill();

                p.y += p.speedY;
                p.x += p.speedX;

                // Wrap around edges
                if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
                if (p.x < -5) p.x = canvas.width + 5;
                if (p.x > canvas.width + 5) p.x = -5;
            }

            animId = requestAnimationFrame(draw);
        };

        resize();
        draw();

        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
