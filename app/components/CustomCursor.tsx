'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if device is touch or mouse
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-transform duration-100 ease-out"
        style={{
          width: isHovering ? '40px' : '16px',
          height: isHovering ? '40px' : '16px',
          transform: `translate(${position.x - (isHovering ? 20 : 8)}px, ${position.y - (isHovering ? 20 : 8)}px)`,
          border: '1px solid rgba(255, 107, 0, 0.8)',
          background: isHovering ? 'rgba(255, 107, 0, 0.2)' : 'transparent',
          boxShadow: isHovering ? '0 0 15px rgba(255, 107, 0, 0.6)' : 'none',
        }}
      />
      <div
        className="pointer-events-none fixed top-0 left-0 z-[10000] rounded-full bg-[#FF6B00] transition-transform duration-75 ease-in"
        style={{
          width: '4px',
          height: '4px',
          transform: `translate(${position.x - 2}px, ${position.y - 2}px)`,
        }}
      />
      <style jsx global>{`
        body {
          cursor: none !important;
        }
        a, button, [role="button"] {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
