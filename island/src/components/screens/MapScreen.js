import React from 'react';
import { ZONE_DATA, ZONE_ORDER, ZONE_POSITIONS } from '../../data/gameData';
import { LeavesBg, Waves, GameHeader } from '../shared';

export default function MapScreen({ state, dispatch }) {
  const allSolved = state.digits.every((d) => d !== null);

  return (
    <div className="screen bg-ocean" style={{ padding: 16, justifyContent: 'flex-start', paddingTop: 56 }}>
      <LeavesBg />
      <Waves />
      <GameHeader zoneName="מַפַּת הָאִי" elapsed={state.timer.elapsed} onBack={() => {}} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        {/* Island map */}
        <div className="island-map" style={{ flex: 1, minHeight: 0 }}>
          {/* island silhouette */}
          <div
            style={{
              position: 'absolute', top: '5%', left: '5%', right: '5%', bottom: '10%',
              background: 'radial-gradient(ellipse at 50% 50%, #2d6b3f 0%, #1a4a2a 50%, transparent 70%)',
              borderRadius: '50% 45% 48% 52% / 50% 50% 50% 50%',
              opacity: 0.6,
            }}
          />

          {ZONE_ORDER.map((id, i) => {
            const z = ZONE_DATA[id];
            const solved = state.zoneStatus[id].solved;
            return (
              <div
                key={id}
                className={`zone-node ${solved ? 'solved' : 'unsolved'} anim-fadeInUp stagger-${i + 1}`}
                style={{ top: ZONE_POSITIONS[i].top, right: ZONE_POSITIONS[i].right }}
                onClick={() => !solved && dispatch({ type: 'SET_SCREEN', screen: 'zone', zone: id })}
                role="button"
                aria-label={z.name}
              >
                <span>{z.emoji}</span>
                <span className="zone-label">{z.name}</span>
                {solved && <div className="digit-badge">{z.digit}</div>}
              </div>
            );
          })}
        </div>

        {/* Raft & code display */}
        <div className="raft-area anim-fadeInUp stagger-5">
          <div style={{ fontSize: '0.85rem', color: 'var(--sand)', fontWeight: 700 }}>🚣 הָרַפְסוֹדָה</div>

          <div className="raft-parts">
            {state.raftParts.map((found, i) => (
              <div key={i} className={`raft-part ${found ? 'found' : ''}`}>
                {found ? '🪵' : ''}
              </div>
            ))}
          </div>

          <div className="code-slots">
            {state.digits.map((d, i) => (
              <div key={i} className={`code-slot ${d !== null ? 'filled' : ''}`}>
                {d !== null ? d : '?'}
              </div>
            ))}
          </div>

          {allSolved && (
            <button
              className="btn btn-primary anim-fadeInUp"
              style={{ marginTop: 8 }}
              onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'code' })}
            >
              🔓 הַזֵן קוֹד!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
