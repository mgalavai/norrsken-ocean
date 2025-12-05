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
        left: `${((x + 1) / 2) * 100}%`,
        top: `${((1 - y) / 2) * 100}%`
    });

    const handlePointer = (e: React.PointerEvent | PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;

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
                className="w-full h-full bg-black/40 backdrop-blur-sm border-2 border-cyan-900/50 rounded-lg relative overflow-hidden cursor-crosshair shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                onPointerDown={(e) => {
                    setIsDragging(true);
                    handlePointer(e);
                }}
            >
                {/* Grid Lines */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: 'center'
                }} />

                {/* Center Crosshair */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-cyan-500/30" />
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-cyan-500/30" />

                {/* The Puck/Cursor */}
                <div
                    className="absolute w-6 h-6 -ml-3 -mt-3 bg-cyan-500 rounded-full shadow-[0_0_15px_#06b6d4] border-2 border-white z-10 transition-transform duration-75 ease-out"
                    style={{ left: pos.left, top: pos.top }}
                >
                    {isDragging && <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75"></div>}
                </div>
            </div>


        </div>
    );
};
