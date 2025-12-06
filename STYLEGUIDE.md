# Bio-Architect Style & Contribution Guide

## Visual Design System
*   **Aesthetic**: "Scientific/Cyber Protocol". sleek, glassmorphic, and high-tech.
*   **Colors**: Deep blacks/voids (`bg-black/90`), primary accents in Cyan (`text-cyan-400`, `border-cyan-500`).
*   **UI Components:**
    *   **Glassmorphism**: Encouraged (`backdrop-blur-md`, `bg-black/50`).
    *   **Borders**: Thin, technical borders (`border-white/10`, `border-cyan-500/30`).
    *   **Shapes**: Sharp corners (`rounded-sm`), tech-inspired geometric accents.
    *   **Typography**: Monospace for data (`font-mono`), bold display fonts for headers.

## Code Standards

### React + TypeScript
*   Use Functional Components with named exports.
*   Strict typing for all props and state. Avoid `any`.
*   Use `useMemo` and `useCallback` for expensive 3D calculations.

### State Management (Zustand)
*   Store logic in `src/store`.
*   Selectors should be granular to avoid unnecessary re-renders (especially in the 3D loop).

### 3D (R3F)
*   Keep `Canvas` logic separate from HTML UI overlays.
*   Use `drei` helpers for common tasks (Text, Html, Controls).
*   Dispose of geometries/materials if creating them procedurally in large types.

### CSS (Tailwind v4)
*   Use arbitrary values sparingly.
*   Use the new `@theme` directive in CSS if needed (though avoiding custom config is preferred for this MVP).
