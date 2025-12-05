# Eco-Synthesis Style & Contribution Guide

## Visual Design System
*   **Aesthetic**: "Code-Generated Sci-Fi" but with a **Solid 2D Interface**.
*   **Colors**: High contrast. Deep blacks/grays for backgrounds (`bg-gray-900`, `bg-black`), bright neons for data (`text-cyan-400`, `text-green-500`).
*   **UI Components:**
    *   No glassmorphism (avoid `backdrop-blur`).
    *   Solid, opaque panels with subtle borders (`border-gray-700`).
    *   Sharp corners or slightly rounded (`rounded-lg`), avoid pill-shapes unless for buttons.

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
