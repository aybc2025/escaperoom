import React, { useState, useRef } from 'react';

const ROTATIONS = { V: 'H', H: 'V', TR: 'BR', BR: 'BL', BL: 'TL', TL: 'TR' };
const OPENINGS = {
  V:  ['top', 'bottom'],
  H:  ['left', 'right'],
  TR: ['top', 'right'],
  TL: ['top', 'left'],
  BR: ['bottom', 'right'],
  BL: ['bottom', 'left'],
};
const OPPOSITES = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const DIR_DELTA = { top: [-1, 0], bottom: [1, 0], left: [0, -1], right: [0, 1] };

/* SVG pipe renderer — wide pipes with visible water flow */
function PipeSVG({ type, hasWater }) {
  const W = 60, M = W / 2, T = 14; /* T = pipe thickness */
  const waterColor = '#3ba8d8';
  const pipeColor = hasWater ? waterColor : '#556';
  const bgColor = hasWater ? 'rgba(43,143,191,.12)' : 'none';

  const segments = {
    top:    { x: M - T/2, y: 0, w: T, h: M },
    bottom: { x: M - T/2, y: M, w: T, h: M },
    left:   { x: 0, y: M - T/2, w: M, h: T },
    right:  { x: M, y: M - T/2, w: M, h: T },
  };
  /* For corners, add a center square so the two segments join */
  const opens = OPENINGS[type];
  const rects = opens.map((dir) => segments[dir]);
  const isCorner = !opens.includes('top') || !opens.includes('bottom') ? true : false;
  const needCenter = type !== 'V' && type !== 'H';

  return (
    <svg viewBox={`0 0 ${W} ${W}`} width="100%" height="100%" style={{ display: 'block' }}>
      <rect width={W} height={W} fill={bgColor} rx="6" />
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx="3" fill={pipeColor} />
      ))}
      {needCenter && <rect x={M - T/2} y={M - T/2} width={T} height={T} fill={pipeColor} />}
      {hasWater && (
        <g className="water-stream">
          {rects.map((r, i) => (
            <rect key={`w${i}`} x={r.x + 3} y={r.y + 3} width={r.w - 6} height={r.h - 6} rx="2"
              fill="rgba(100,200,255,.5)" className="water-inner" />
          ))}
          {needCenter && <rect x={M - T/2 + 3} y={M - T/2 + 3} width={T - 6} height={T - 6} fill="rgba(100,200,255,.5)" className="water-inner" />}
        </g>
      )}
    </svg>
  );
}

/*
  Solution:
  [BR] [H ] [H ] [BL]
  [V ] [  ] [  ] [V ]
  [V ] [  ] [  ] [V ]
  [TR] [H ] [H ] [TL]
  Water goes around the perimeter.
*/
const INITIAL = [
  ['BR', 'V',  'V',  'BL'],   // (0,1) and (0,2) need V→H
  ['V',  null, null, 'H' ],   // (1,3) needs H→V
  ['H',  null, null, 'V' ],   // (2,0) needs H→V
  ['TR', 'V',  'V',  'TL'],   // (3,1) and (3,2) need V→H
];

const FIXED = [
  [true,  false, false, true ],
  [true,  false, false, false],
  [false, false, false, true ],
  [true,  false, false, true ],
];

/* null cells are walls — not playable */
const isWall = (r, c) => INITIAL[r][c] === null && FIXED[r][c] === false && r >= 1 && r <= 2 && c >= 1 && c <= 2;

function tracePath(grid) {
  const visited = Array.from({ length: 4 }, () => Array(4).fill(false));
  const queue = [[0, 0]];
  visited[0][0] = true;
  const path = [];

  while (queue.length) {
    const [r, c] = queue.shift();
    const type = grid[r][c];
    if (!type) continue;
    path.push({ r, c });
    const opens = OPENINGS[type];
    for (const dir of opens) {
      const [dr, dc] = DIR_DELTA[dir];
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= 4 || nc < 0 || nc >= 4) continue;
      if (visited[nr][nc]) continue;
      const neighborType = grid[nr][nc];
      if (!neighborType) continue;
      if (OPENINGS[neighborType].includes(OPPOSITES[dir])) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return { path, reached: visited[3][3] };
}

export default function WaterfallPuzzle({ onSolve }) {
  const [grid, setGrid] = useState(INITIAL.map((r) => [...r]));
  const [feedback, setFeedback] = useState(null);
  const [solved, setSolved] = useState(false);
  const [waterCells, setWaterCells] = useState([]);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (r, c) => {
    if (solved || animating || FIXED[r][c] || isWall(r, c)) return;
    if (grid[r][c]) {
      const next = grid.map((row) => [...row]);
      next[r][c] = ROTATIONS[grid[r][c]];
      setGrid(next);
    }
  };

  const checkSolution = () => {
    const { path, reached } = tracePath(grid);
    setAnimating(true);
    setFeedback(null);

    /* Animate water flowing cell by cell */
    let step = 0;
    timerRef.current = setInterval(() => {
      if (step < path.length) {
        setWaterCells(path.slice(0, step + 1));
        step++;
      } else {
        clearInterval(timerRef.current);
        setAnimating(false);
        if (reached) {
          setFeedback({ ok: true, text: 'הַמַּיִם זוֹרְמִים! הַסִּפְרָה הִיא 7!' });
          setSolved(true);
          setTimeout(onSolve, 1500);
        } else {
          setFeedback({ ok: false, text: 'הַמַּיִם נִתְקְעוּ! נַסּוּ לְסוֹבֵב צִנּוֹרוֹת.' });
          setTimeout(() => setWaterCells([]), 1500);
        }
      }
    }, 250);
  };

  const isWater = (r, c) => waterCells.some((p) => p.r === r && p.c === c);

  return (
    <div className="puzzle-container">
      <div className="puzzle-instruction anim-fadeInUp">
        <p className="nikud">חַבְּרוּ אֶת הַצִּנּוֹרוֹת! לִחְצוּ עַל צִנּוֹר כְּדֵי לְסוֹבֵב אוֹתוֹ. הַמַּיִם צְרִיכִים לִזְרוֹם מִלְמַעְלָה לְמַטָּה.</p>
      </div>

      <div className="anim-fadeInUp stagger-1" style={{ fontSize: '0.8rem', color: 'var(--turquoise)', textAlign: 'center' }}>
        💧 מָקוֹר — לְמַעְלָה שְׂמֹאל &nbsp;|&nbsp; 🚪 יָעַד — לְמַטָּה יָמִין
      </div>

      <div className="pipe-grid anim-fadeInUp stagger-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const src = r === 0 && c === 0;
            const tgt = r === 3 && c === 3;
            const wall = isWall(r, c);
            const water = isWater(r, c);
            return (
              <div
                key={`${r}-${c}`}
                className={`pipe-cell ${src ? 'source' : ''} ${tgt ? 'target' : ''} ${FIXED[r][c] ? 'fixed' : ''} ${water ? 'filled-water' : ''} ${wall ? 'wall' : ''}`}
                onClick={() => handleClick(r, c)}
              >
                {wall && <span style={{ fontSize: '1rem', opacity: 0.2 }}>🪨</span>}
                {cell && <PipeSVG type={cell} hasWater={water} />}
                {src && <span className="pipe-label">💧</span>}
                {tgt && <span className="pipe-label">🚪</span>}
              </div>
            );
          })
        )}
      </div>

      {!solved && (
        <button className="btn btn-primary anim-fadeInUp stagger-3" onClick={checkSolution} disabled={animating}>
          {animating ? '💧 זוֹרֵם...' : '💧 שַׁחְרְרוּ מַיִם!'}
        </button>
      )}

      {feedback && <div className={`feedback-bubble ${feedback.ok ? 'feedback-success' : 'feedback-error'}`}>{feedback.text}</div>}
    </div>
  );
}
