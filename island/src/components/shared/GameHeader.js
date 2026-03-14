import React from 'react';
import { TOTAL_TIME_SECONDS } from '../../data/gameData';

function TimerDisplay({ elapsed }) {
  const remaining = Math.max(0, TOTAL_TIME_SECONDS - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return (
    <div className="timer-display">
      <span style={{ fontSize: '1.2rem' }}>☀️</span>
      <span>{mins}:{secs.toString().padStart(2, '0')}</span>
    </div>
  );
}

export default function GameHeader({ zoneName, elapsed, onBack }) {
  return (
    <div className="game-header">
      <button onClick={onBack} aria-label="חזרה למפה">🚣</button>
      <span className="zone-name">{zoneName}</span>
      <TimerDisplay elapsed={elapsed} />
    </div>
  );
}
