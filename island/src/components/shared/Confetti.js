import React from 'react';

const COLORS = ['#F2C94C', '#3ED8C9', '#FF7B4A', '#4AE88D', '#8B6FB0', '#E85D4A'];

export default function Confetti({ active }) {
  if (!active) return null;

  return (
    <div className="confetti-container">
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${1.5 + Math.random()}s`,
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
