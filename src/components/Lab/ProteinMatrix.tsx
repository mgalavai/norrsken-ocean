import React, { useRef, useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const ProteinMatrix = () => {
    const { foldingState, setFoldingState } = useGameStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Convert -1 to 1 range to 0 to 100% css positions
    // x: -1 (left) -> 0%, 1 (right) -> 100%
    // y: -1 (bottom) -> 100%, 1 (top) -> 0% (CSS top is inverted)

    // Wait... joystick logic usually Y-up is positive 1. CSS top 0 is Y=1.
    // Let's stick to standard math: Y=1 is Top.
    // CSS Top = (1 - y) / 2 * 100%
    // CSS Left = (x + 1) / 2 * 100%

    const getCssPosition = (x: number, y: number) => ({
        // Map -1..1 to 0..1 fraction
        // Scale by (100% - 24px) so the 24px puck stays strictly inside the container
        left: `calc((100% - 24px) * ${(x + 1) / 2})`,
        top: `calc((100% - 24px) * ${(1 - y) / 2})`
    });

    const handlePointer = (e: React.PointerEvent | PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;

        // Invert the clamping logic for input:
        // We want the cursor center to map to x/y.
        // But visually we clamped it.
        // Actually, for interaction, standard full-width mapping is fine/preferred.
        // The user clicks "Right Edge", x becomes 1. Visual clamps to "Almost Right Edge".
        // This is standard behavior for sliders.

        // Normalize to -1 to 1
        let x = ((clientX - rect.left) / rect.width) * 2 - 1;
        let y = -(((clientY - rect.top) / rect.height) * 2 - 1); // Invert Y so up is positive

        // Snap to grid (step size 0.25 -> 4 steps per quadrant)
        const step = 0.25;
        x = Math.round(x / step) * step;
        y = Math.round(y / step) * step;

        // Clamp inside -1 to 1
        x = Math.max(-1, Math.min(1, x));
        y = Math.max(-1, Math.min(1, y));

        setFoldingState(x, y);
    };

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        const handleMove = (e: PointerEvent) => {
            if (isDragging) handlePointer(e);
        };

        window.addEventListener('pointerup', handleUp);
        window.addEventListener('pointermove', handleMove);

        return () => {
            window.removeEventListener('pointerup', handleUp);
            window.removeEventListener('pointermove', handleMove);
        };
    }, [isDragging]);

    const pos = getCssPosition(foldingState.x, foldingState.y);

    return (
        <div className="relative w-64 h-64 select-none group">

            {/* The Grid Container */}
            <div
                ref={containerRef}
                className="w-full h-full bg-white/10 backdrop-blur-md relative overflow-hidden cursor-crosshair box-border"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 0 60px rgba(255,255,255,0.1)'
                }}
                onPointerDown={(e) => {
                    setIsDragging(true);
                    handlePointer(e);
                }}
            >
                {/* Fine Grid Pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: 'center'
                }} />

                {/* 4 Division Lines (Quadrants) */}
                {/* Vertical Center Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/40" />
                {/* Horizontal Center Line */}
                <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-400/40" />

                {/* The Puck/Cursor */}
                <div
                    className="absolute w-6 h-6 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee] border-2 border-white/80 z-10 transition-transform duration-75 ease-out"
                    style={{ left: pos.left, top: pos.top }}
                >
                    {isDragging && <div className="absolute inset-0 animate-ping rounded-full bg-cyan-300 opacity-75"></div>}
                </div>
            </div>


        </div>
    );
};
