import React from 'react';

const EMOJIS = ['🌿', '🍃', '🌴', '🌺', '🍂'];

export default function LeavesBg() {
  return (
    <div className="leaves-bg">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="leaf"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
            fontSize: `${1.5 + Math.random() * 2}rem`,
          }}
        >
          {EMOJIS[i % EMOJIS.length]}
        </div>
      ))}
    </div>
  );
}
