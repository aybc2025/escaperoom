import { useMemo } from 'react';

/**
 * Animated starfield background.
 * Generates random stars with twinkling CSS animations.
 */
export default function StarBackground({ count = 60 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-deep to-space-mid" />
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.id % 5 === 0 ? '#A78BFA' : star.id % 3 === 0 ? '#4EEADD' : '#F0F0F0',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
