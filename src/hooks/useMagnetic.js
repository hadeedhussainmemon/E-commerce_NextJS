import { useState, useEffect, useCallback } from 'react';

/**
 * useMagnetic Hook
 * Calculates the distance between the cursor and a ref,
 * applying a subtle magnetic pull to the element.
 */
export default function useMagnetic() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();

        // Calculate center of the element
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Distance from cursor to center
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        // Limit the pull (strength factor)
        const strength = 0.35;
        setPosition({ x: deltaX * strength, y: deltaY * strength });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 });
    }, []);

    return {
        style: {
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: position.x === 0 ? 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
        },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave
    };
}
