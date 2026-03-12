import { useEffect, useState } from 'react';

/**
 * Confetti/spark burst animation overlay.
 * Shows on correct answers.
 */
export default function Confetti({ active, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ['#4EEADD', '#A78BFA', '#FF8A5C', '#4ADE80', '#FFD700', '#FF6B9D'];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 50 + (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      velocity: Math.random() * 80 + 40,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 0.2,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const endX = p.x + Math.cos(rad) * p.velocity;
        const endY = p.y - Math.abs(Math.sin(rad) * p.velocity);

        return (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animation: `confetti-fly 1.2s ease-out ${p.delay}s forwards`,
              '--end-x': `${endX - p.x}vw`,
              '--end-y': `${endY - p.y}vh`,
              '--rotation': `${p.rotation}deg`,
            }}
          />
        );
      })}
      
      <style>{`
        @keyframes confetti-fly {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--end-x), var(--end-y)) rotate(var(--rotation)) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}
