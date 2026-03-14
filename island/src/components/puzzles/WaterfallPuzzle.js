import React, { useState } from 'react';

/*
  4×4 grid. Source = top-left [0][0]. Target = bottom-right [3][3].
  Pipe types: V (vertical │), H (horizontal ─), BR (┌ bottom-right),
  BL (┐ bottom-left), TR (└ top-right), TL (┘ top-left).
  
  Openings per type:
    V  → top, bottom
    H  → left, right
    BR → bottom, right
    BL → bottom, left
    TR → top, right
    TL → top, left

  Solution path: (0,0)BR→(1,0)V→(2,0)V→(3,0)TR→(3,1)H→(3,2)H→(3,3) ← but we need TL at target? 
  Actually target is just a marker. Let me design a specific puzzle.

  Solution:
    [BR] [BL] [  ] [  ]
    [V ] [TL] [  ] [  ]
    [V ] [  ] [BR] [BL]
    [TR] [H ] [TR] [  ] ← hmm (3,3) needs to be reached

  Let me simplify: just require a valid connection from source to target.
  Pre-fill some cells, leave others for the player.
  When player clicks "release water", trace the path. If connected → win.
*/

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
  Desired solution grid:
  [BR] [H ] [H ] [BL]
  [V ] [  ] [  ] [V ]
  [V ] [  ] [  ] [V ]
  [TR] [H ] [H ] [TL]
  
  Fixed cells (given to player already correct): 
    (0,0)=BR, (0,3)=BL, (3,0)=TR, (3,3)=TL  ← corners
  
  Player must fill: (0,1)=H, (0,2)=H, (1,0)=V, (1,3)=V, (2,0)=V, (2,3)=V, (3,1)=H, (3,2)=H
  
  But 8 cells to fill is a lot. Let's pre-fill more:
  Fixed: (0,0)BR, (0,3)BL, (1,0)V, (2,3)V, (3,0)TR, (3,3)TL
  Player fills: (0,1), (0,2), (1,3), (2,0), (3,1), (3,2) → 6 cells
  
  Start them with wrong orientations that need rotating.
*/

const SOLUTION = [
  ['BR', 'H',  'H',  'BL'],
  ['V',  null, null, 'V' ],
  ['V',  null, null, 'V' ],
  ['TR', 'H',  'H',  'TL'],
];

const INITIAL = [
  ['BR', 'V',  'V',  'BL'],   // (0,1) and (0,2) start as V, need H
  ['V',  null, null, 'H' ],   // (1,3) starts as H, needs V
  ['H',  null, null, 'V' ],   // (2,0) starts as H, needs V
  ['TR', 'V',  'V',  'TL'],   // (3,1) and (3,2) start as V, need H
];

const FIXED = [
  [true,  false, false, true ],
  [true,  false, false, false],
  [false, false, false, true ],
  [true,  false, false, true ],
];

function tracePath(grid) {
  /* BFS from (0,0) following connected pipes */
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
  const [selectedPipe, setSelectedPipe] = useState(null);

  const handleClick = (r, c) => {
    if (solved || FIXED[r][c]) return;
    if (grid[r][c]) {
      /* rotate existing */
      const next = grid.map((row) => [...row]);
      next[r][c] = ROTATIONS[grid[r][c]];
      setGrid(next);
    } else if (selectedPipe) {
      const next = grid.map((row) => [...row]);
      next[r][c] = selectedPipe;
      setGrid(next);
      setSelectedPipe(null);
    }
  };

  const checkSolution = () => {
    const { path, reached } = tracePath(grid);
    setWaterCells(path);
    if (reached) {
      setFeedback({ ok: true, text: 'הַמַּיִם זוֹרְמִים! הַסִּפְרָה הִיא 7!' });
      setSolved(true);
      setTimeout(onSolve, 1500);
    } else {
      setFeedback({ ok: false, text: 'הַמַּיִם נִתְקְעוּ! נַסּוּ לְסוֹבֵב צִנּוֹרוֹת.' });
      setTimeout(() => setWaterCells([]), 1500);
    }
  };

  const isWater = (r, c) => waterCells.some((p) => p.r === r && p.c === c);

  return (
    <div className="puzzle-container">
      <div className="puzzle-instruction anim-fadeInUp">
        <p className="nikud">חַבְּרוּ אֶת הַצִּנּוֹרוֹת! לִחְצוּ עַל צִנּוֹר כְּדֵי לְסוֹבֵב אוֹתוֹ. בִּחְרוּ צִנּוֹר מִלְּמַטָּה כְּדֵי לְמַלֵּא תָּא רֵיק.</p>
      </div>

      <div className="pipe-drag-tray anim-fadeInUp stagger-1">
        <span style={{ fontSize: '0.8rem', color: 'var(--turquoise)', width: '100%', textAlign: 'center' }}>בִּחְרוּ צִנּוֹר:</span>
        {Object.keys(PIPE_DISPLAY).map((t) => (
          <div key={t} className={`pipe-drag-item ${selectedPipe === t ? 'selected' : ''}`} onClick={() => setSelectedPipe(t === selectedPipe ? null : t)}>
            <span style={{ fontSize: '1.5rem', color: 'var(--turquoise)' }}>{PIPE_DISPLAY[t]}</span>
          </div>
        ))}
      </div>

      <div className="pipe-grid anim-fadeInUp stagger-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const src = r === 0 && c === 0;
            const tgt = r === 3 && c === 3;
            return (
              <div
                key={`${r}-${c}`}
                className={`pipe-cell ${src ? 'source' : ''} ${tgt ? 'target' : ''} ${FIXED[r][c] ? 'fixed' : ''} ${isWater(r, c) ? 'filled-water' : ''}`}
                onClick={() => handleClick(r, c)}
              >
                {src && !cell && <span style={{ fontSize: '1.2rem' }}>💧</span>}
                {tgt && !cell && <span style={{ fontSize: '1.2rem' }}>🚪</span>}
                {cell && (
                  <span style={{ fontSize: '1.8rem', color: FIXED[r][c] ? 'var(--turquoise)' : 'var(--gold)', lineHeight: 1 }}>
                    {PIPE_DISPLAY[cell]}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {!solved && (
        <button className="btn btn-primary anim-fadeInUp stagger-3" onClick={checkSolution}>
          💧 שַׁחְרְרוּ מַיִם!
        </button>
      )}

      {feedback && <div className={`feedback-bubble ${feedback.ok ? 'feedback-success' : 'feedback-error'}`}>{feedback.text}</div>}
    </div>
  );
}
