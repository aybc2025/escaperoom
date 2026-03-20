import React, { useState } from 'react';

/* 7×7 grid: 0=blocked, 1=path, 2=obstacle-emoji, 3=start, 4=goal */
const GRID = [
  [3, 1, 1, 2, 0, 0, 0],
  [0, 2, 1, 2, 0, 2, 0],
  [0, 0, 1, 1, 1, 2, 0],
  [0, 2, 2, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 2],
  [0, 2, 0, 2, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 4],
];

/* Absolute direction arrows — no more facing/turning confusion */
const ARROW_DIR = {
  '➡️': [0, 1],
  '⬇️': [1, 0],
  '⬅️': [0, -1],
  '⬆️': [-1, 0],
};

/*
  Solution path: ➡️➡️⬇️⬇️➡️➡️⬇️⬇️➡️⬇️⬇️➡️
  Blanks at indices 3 and 8.
*/
const COMMANDS_TEMPLATE = ['➡️', '➡️', '⬇️', null, '➡️', '➡️', '⬇️', '⬇️', null, '⬇️', '⬇️', '➡️'];
const CORRECT = { 3: '⬇️', 8: '➡️' };
const OBSTACLE_EMOJIS = ['🐍', '🌵', '💩'];

export default function JunglePuzzle({ onSolve }) {
  const [commands, setCommands] = useState([...COMMANDS_TEMPLATE]);
  const [pickIdx, setPickIdx] = useState(null);
  const [playerPath, setPlayerPath] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [solved, setSolved] = useState(false);

  const pick = (sym) => {
    const next = [...commands];
    next[pickIdx] = sym;
    setCommands(next);
    setPickIdx(null);
  };

  const retry = () => {
    setCommands([...COMMANDS_TEMPLATE]);
    setPlayerPath([]);
    setFeedback(null);
    setPickIdx(null);
  };

  const simulate = () => {
    if (commands.includes(null)) {
      setFeedback({ ok: false, text: 'מַלְאוּ קֹדֶם אֶת הַחִצִּים הַחֲסֵרִים!' });
      return;
    }
    setSimulating(true);
    setFeedback(null);

    let pos = { r: 0, c: 0 };
    const path = [{ ...pos }];
    let fail = false;

    for (const cmd of commands) {
      const delta = ARROW_DIR[cmd];
      if (!delta) { fail = true; break; }
      const nr = pos.r + delta[0];
      const nc = pos.c + delta[1];
      if (nr < 0 || nr >= 7 || nc < 0 || nc >= 7 || GRID[nr][nc] === 2 || GRID[nr][nc] === 0) { fail = true; break; }
      pos = { r: nr, c: nc };
      path.push({ ...pos });
    }

    let step = 0;
    const iv = setInterval(() => {
      if (step < path.length) { setPlayerPath(path.slice(0, step + 1)); step++; }
      else {
        clearInterval(iv);
        setSimulating(false);
        if (fail || !(pos.r === 6 && pos.c === 6)) {
          setFeedback({ ok: false, text: 'אוֹפְּס! הַדֶּרֶךְ לֹא נְכוֹנָה. נַסּוּ שׁוּב!' });
        } else {
          setFeedback({ ok: true, text: 'מְצוּיָן! הִגַּעְתֶּם לָאַרְגָּז!' });
          setSolved(true);
          setTimeout(onSolve, 1500);
        }
      }
    }, 200);
  };

  const last = playerPath.length > 0 ? playerPath[playerPath.length - 1] : null;

  return (
    <div className="puzzle-container">
      <div className="puzzle-instruction anim-fadeInUp">
        <p className="nikud">מִישֶׁהוּ הִשְׁאִיר פֶּתֶק עִם הוֹרָאוֹת בְּחִצִּים. הַשְׁלִימוּ אֶת הַחִצִּים הַחֲסֵרִים וְשִׁגְרוּ!</p>
      </div>

      <div className="anim-fadeInUp stagger-1" style={{ display: 'flex', gap: 12, fontSize: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span>➡️ = יָמִינָה</span>
        <span>⬇️ = לְמַטָּה</span>
        <span>⬅️ = שְׂמֹאלָה</span>
        <span>⬆️ = לְמַעְלָה</span>
      </div>

      {/* command bar */}
      <div className="command-bar anim-fadeInUp stagger-2">
        {commands.map((cmd, i) => (
          <div
            key={i}
            className={`command-symbol ${cmd === null ? 'symbol-missing' : ''}`}
            style={cmd ? { background: 'rgba(255,255,255,.1)' } : undefined}
            onClick={() => cmd === null && !simulating && !solved && setPickIdx(i)}
          >
            {cmd || '❓'}
          </div>
        ))}
      </div>

      {pickIdx !== null && (
        <div className="symbol-picker anim-fadeIn">
          <span style={{ fontSize: '0.85rem', color: 'var(--gold)', width: '100%', textAlign: 'center' }}>בִּחְרוּ חֵץ:</span>
          {['➡️', '⬇️', '⬅️', '⬆️'].map((s) => (
            <div key={s} className="symbol-option" onClick={() => pick(s)}>{s}</div>
          ))}
        </div>
      )}

      {/* grid */}
      <div className="jungle-grid anim-fadeInUp stagger-3" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {GRID.map((row, r) =>
          row.map((cell, c) => {
            const isPlayer = last && last.r === r && last.c === c;
            const onPath = playerPath.some((p) => p.r === r && p.c === c);
            let cls = 'jungle-cell ';
            if (cell === 2) cls += 'obstacle';
            else if (cell === 1 || cell === 3) cls += 'path';
            else if (cell === 4) cls += 'goal';
            else cls += 'empty';

            return (
              <div
                key={`${r}-${c}`}
                className={cls}
                style={{
                  ...(isPlayer ? { background: 'var(--turquoise)', borderRadius: '50%' } : {}),
                  ...(onPath && !isPlayer ? { background: 'rgba(62,216,201,.2)' } : {}),
                }}
              >
                {cell === 2 && OBSTACLE_EMOJIS[(r + c) % 3]}
                {cell === 3 && !isPlayer && '🧒'}
                {cell === 4 && '📦'}
                {isPlayer && '🧒'}
              </div>
            );
          })
        )}
      </div>

      {!solved && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary anim-fadeInUp stagger-4" onClick={simulate} disabled={simulating}>
            {simulating ? 'בְּדֶרֶךְ...' : '🚀 שַׁגֵּר!'}
          </button>
          {feedback && !feedback.ok && (
            <button className="btn btn-secondary anim-fadeIn" onClick={retry} disabled={simulating}>
              🔄 נַסּוּ שׁוּב
            </button>
          )}
        </div>
      )}

      {feedback && (
        <div className={`feedback-bubble ${feedback.ok ? 'feedback-success' : 'feedback-error'}`}>{feedback.text}</div>
      )}
    </div>
  );
}
