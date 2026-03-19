import React, { useState, useRef } from 'react';

const ROTATIONS = { V: 'H', H: 'V', TR: 'BR', BR: 'BL', BL: 'TL', TL: 'TR' };
const PIPE_DISPLAY = { V: '┃', H: '━', TR: '┗', TL: '┛', BR: '┏', BL: '┓' };
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
                {cell && (
                  <span className={`pipe-symbol ${water ? 'water-flow' : ''}`} style={{ color: FIXED[r][c] ? 'var(--turquoise)' : 'var(--gold)' }}>
                    {PIPE_DISPLAY[cell]}
                  </span>
                )}
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
