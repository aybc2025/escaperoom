import React from 'react';

export default function Waves({ color = 'rgba(62,216,201,0.15)' }) {
  return (
    <div className="waves-container">
      <svg className="wave-line" viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path
          d="M0,20 Q150,0 300,20 Q450,40 600,20 Q750,0 900,20 Q1050,40 1200,20 L1200,40 L0,40 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
