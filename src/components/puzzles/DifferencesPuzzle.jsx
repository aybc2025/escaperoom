import { useState } from 'react';
import { useGame, ACTIONS } from '../../context/GameContext';
import { ROOMS } from '../../constants';
import HintSystem from '../shared/HintSystem';
import SuccessOverlay from '../shared/SuccessOverlay';

/**
 * Differences Puzzle — Find 4 differences between two lab scenes.
 * The differences form the digit 8 (8 = the count of items arranged in "8" shape, 
 * but per spec the digit is 8).
 */

// Difference zones in the RIGHT image (relative % positions)
const DIFFERENCES = [
  { id: 'planet-color', x: 72, y: 15, w: 18, h: 22, label: 'צֶבַע כּוֹכַב הַלֶּכֶת' },
  { id: 'beaker-missing', x: 38, y: 55, w: 14, h: 18, label: 'צְלוֹחִית חֲסֵרָה' },
  { id: 'button-color', x: 12, y: 70, w: 12, h: 12, label: 'צֶבַע כַּפְתּוֹר' },
  { id: 'stars-count', x: 85, y: 8, w: 12, h: 14, label: 'מִסְפַּר כּוֹכָבִים' },
];

/**
 * Renders a minimalist space lab scene as SVG.
 * @param {boolean} isModified - if true, includes the 4 differences
 */
function LabScene({ isModified, onClickArea, foundDiffs }) {
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full" aria-hidden="true">
      {/* Background — lab wall */}
      <rect width="300" height="220" fill="#0F1340" />
      <rect x="5" y="5" width="290" height="210" rx="8" fill="#141852" stroke="#4EEADD" strokeWidth="1" opacity="0.3" />

      {/* Window with space view */}
      <rect x="190" y="15" width="90" height="60" rx="6" fill="#0B0E2D" stroke="#A78BFA" strokeWidth="1.5" />
      
      {/* Planet in window — DIFFERENCE 1: color changes */}
      <circle
        cx="230"
        cy="40"
        r="16"
        fill={isModified ? '#FF8A5C' : '#A78BFA'}
        opacity="0.9"
      />
      <ellipse cx="230" cy="40" rx="16" ry="5" fill="none" stroke={isModified ? '#FFB088' : '#C4B5FD'} strokeWidth="1" />

      {/* Stars in window — DIFFERENCE 4: different count */}
      <circle cx="260" cy="25" r="2" fill="#F0F0F0" />
      <circle cx="210" cy="22" r="1.5" fill="#F0F0F0" />
      <circle cx="250" cy="55" r="1.5" fill="#F0F0F0" />
      {!isModified && <circle cx="270" cy="50" r="2" fill="#4EEADD" />}

      {/* Table */}
      <rect x="20" y="120" width="260" height="8" rx="2" fill="#1E2266" />
      <rect x="40" y="128" width="8" height="60" fill="#1E2266" />
      <rect x="240" y="128" width="8" height="60" fill="#1E2266" />

      {/* Beakers on table */}
      <g>
        {/* Beaker 1 — always present */}
        <rect x="60" y="95" width="20" height="25" rx="2" fill="none" stroke="#4EEADD" strokeWidth="1.5" />
        <rect x="62" y="105" width="16" height="13" rx="1" fill="#4EEADD" opacity="0.3" />
        <line x1="65" y1="92" x2="75" y2="92" stroke="#4EEADD" strokeWidth="1.5" />
      </g>

      {/* Beaker 2 — DIFFERENCE 2: missing in modified */}
      {!isModified && (
        <g>
          <rect x="100" y="100" width="16" height="20" rx="2" fill="none" stroke="#FF8A5C" strokeWidth="1.5" />
          <rect x="102" y="108" width="12" height="10" rx="1" fill="#FF8A5C" opacity="0.3" />
          <line x1="104" y1="97" x2="112" y2="97" stroke="#FF8A5C" strokeWidth="1.5" />
        </g>
      )}

      {/* Control panel */}
      <rect x="15" y="140" width="50" height="40" rx="4" fill="#1E2266" stroke="#A78BFA" strokeWidth="1" />
      
      {/* Panel buttons — DIFFERENCE 3: button color changes */}
      <circle cx="28" cy="152" r="5" fill={isModified ? '#4EEADD' : '#FF8A5C'} />
      <circle cx="45" cy="152" r="5" fill="#A78BFA" />
      <rect x="22" y="163" width="26" height="4" rx="2" fill="#4EEADD" opacity="0.4" />
      <rect x="22" y="170" width="18" height="4" rx="2" fill="#A78BFA" opacity="0.3" />

      {/* Screen/monitor on wall */}
      <rect x="100" y="30" width="70" height="45" rx="4" fill="#0B0E2D" stroke="#4EEADD" strokeWidth="1" />
      <text x="135" y="50" textAnchor="middle" fill="#4EEADD" fontSize="8" fontFamily="monospace">STATUS</text>
      <rect x="110" y="55" width="50" height="3" rx="1" fill="#4ADE80" opacity="0.6" />
      <rect x="110" y="62" width="35" height="3" rx="1" fill="#4EEADD" opacity="0.4" />

      {/* Floor */}
      <rect x="0" y="188" width="300" height="32" fill="#0B0E2D" opacity="0.5" />
      <line x1="0" y1="188" x2="300" y2="188" stroke="#A78BFA" strokeWidth="0.5" opacity="0.3" />

      {/* Clickable areas (right image only) */}
      {onClickArea && DIFFERENCES.map((diff) => {
        const found = foundDiffs.includes(diff.id);
        return (
          <g key={diff.id}>
            <rect
              x={diff.x * 3}
              y={diff.y * 2.2}
              width={diff.w * 3}
              height={diff.h * 2.2}
              fill="transparent"
              className="cursor-pointer"
              onClick={() => onClickArea(diff.id)}
            />
            {found && (
              <circle
                cx={diff.x * 3 + (diff.w * 3) / 2}
                cy={diff.y * 2.2 + (diff.h * 2.2) / 2}
                r={Math.min(diff.w, diff.h) * 1.5}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2"
                className="animate-glow-pulse"
                style={{ color: '#4ADE80' }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function DifferencesPuzzle() {
  const { state, dispatch } = useGame();
  const room = ROOMS.lab;
  const labStatus = state.roomStatus.lab;
  const foundDiffs = labStatus.foundDiffs;

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassiveHint, setShowPassiveHint] = useState(false);
  const [wrongClick, setWrongClick] = useState(false);

  const handleClickDiff = (diffId) => {
    if (foundDiffs.includes(diffId)) return;

    dispatch({ type: ACTIONS.FIND_DIFFERENCE, payload: diffId });

    const newFound = [...foundDiffs, diffId];
    if (newFound.length === DIFFERENCES.length) {
      // All found!
      setTimeout(() => {
        setShowSuccess(true);
        dispatch({
          type: ACTIONS.SOLVE_ROOM,
          payload: { roomId: 'lab', digit: room.digit, digitIndex: room.digitIndex },
        });
      }, 800);
    }
  };

  const handleWrongClick = () => {
    setWrongClick(true);
    setTimeout(() => setWrongClick(false), 500);
  };

  const handleContinue = () => {
    dispatch({ type: ACTIONS.LEAVE_ROOM });
  };

  if (showSuccess) {
    return <SuccessOverlay digit={room.digit} digitIndex={room.digitIndex} onContinue={handleContinue} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Story */}
      <p className="text-game-base font-body text-ui-text mb-4 animate-slide-up text-center">
        הַמַּחְשֵׁב שֶׁל הַמַּעְבָּדָה הִשְׁתַּגֵּעַ וְשִׁנָה דְּבָרִים בַּתַּמוּנָה! מִצְאוּ מָה הִשְׁתַּנָה.
      </p>

      {/* Difference counter */}
      <div className={`text-center mb-4 animate-slide-up stagger-2 ${wrongClick ? 'animate-shake' : ''}`}>
        <span className="text-game-lg font-display font-bold text-accent-cyan">
          מְצָאתֶם: {foundDiffs.length}/{DIFFERENCES.length}
        </span>
      </div>

      {/* Two images side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Original (left/top) */}
        <div className="animate-slide-up stagger-3">
          <p className="text-sm text-ui-dim text-center mb-2 font-body">🅰️ מְקוֹרִי</p>
          <div
            className="rounded-xl border border-accent-cyan/20 overflow-hidden bg-space-deep"
            onClick={() => setShowPassiveHint(true)}
          >
            <LabScene isModified={false} foundDiffs={foundDiffs} />
          </div>
        </div>

        {/* Modified (right/bottom) — clickable */}
        <div className="animate-slide-up stagger-4">
          <p className="text-sm text-ui-dim text-center mb-2 font-body">🅱️ הַמְּשֻׁנֶּה — לִחֲצוּ עַל הַהֶבְדֵּלִים!</p>
          <div className="rounded-xl border border-accent-purple/30 overflow-hidden bg-space-deep glow-border-purple">
            <LabScene
              isModified={true}
              onClickArea={handleClickDiff}
              foundDiffs={foundDiffs}
            />
          </div>
        </div>
      </div>

      {/* Found differences list */}
      {foundDiffs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4 animate-fade-in">
          {DIFFERENCES.map((diff) => {
            const found = foundDiffs.includes(diff.id);
            return (
              <span
                key={diff.id}
                className={`px-3 py-1 rounded-full text-sm font-body ${
                  found ? 'bg-ui-success/20 text-ui-success' : 'bg-space-light/30 text-ui-dim/40'
                }`}
              >
                {found ? '✓' : '?'} {diff.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Passive hint */}
      {showPassiveHint && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-8 md:max-w-sm z-40 animate-bounce-in">
          <div className="bg-space-light/95 backdrop-blur-sm border border-accent-cyan/30 rounded-2xl p-4 text-game-sm text-ui-text shadow-lg">
            <button onClick={() => setShowPassiveHint(false)} className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center text-ui-dim hover:text-ui-text">✕</button>
            <p className="font-body">🧪 חַפְּשׂוּ הֶבְדֵּלִים בַּחַלּוֹן, עַל הַשּׁוּלְחָן וּבַפִּינוֹת!</p>
          </div>
        </div>
      )}

      <HintSystem
        passiveHint="🧪 חַפְּשׂוּ הֶבְדֵּלִים בַּחַלּוֹן, עַל הַשּׁוּלְחָן וּבַפִּינוֹת!"
        activeHint="יֵשׁ 4 הֶבְדֵּלִים: חַפְּשׂוּ שִׁנּוּיֵי צֶבַע, מַשֶּׁהוּ שֶׁנֶּעֱלַם, וּמִסְפַּר שׁוֹנֶה שֶׁל כּוֹכָבִים."
      />
    </div>
  );
}
