'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

export function GradualSpacing({ text = 'Gradual Spacing', className }: { text: string; className?: string }) {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    return (
        <div className="flex space-x-1 justify-center">
            <AnimatePresence>
                {text.split('').map((char, i) => (
                    <motion.p
                        ref={ref}
                        key={i}
                        initial={{ opacity: 0, x: -18 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        exit="hidden"
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className={cn("text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]", className)}
                    >
                        {char === ' ' ? <span>&nbsp;</span> : char}
                    </motion.p>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default GradualSpacing;
