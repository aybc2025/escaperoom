import React, { useState, useEffect, useRef } from 'react';
import { ZONE_DATA, ZONE_HINTS } from '../../data/gameData';
import { LeavesBg, GameHeader, HintSystem, Confetti } from '../shared';
import JunglePuzzle from '../puzzles/JunglePuzzle';
import ParrotPuzzle from '../puzzles/ParrotPuzzle';
import WaterfallPuzzle from '../puzzles/WaterfallPuzzle';
import CavePuzzle from '../puzzles/CavePuzzle';
import BeachPuzzle from '../puzzles/BeachPuzzle';

const PUZZLE_MAP = {
  jungle: JunglePuzzle,
  parrots: ParrotPuzzle,
  waterfall: WaterfallPuzzle,
  cave: CavePuzzle,
  beach: BeachPuzzle,
};

export default function ZoneScreen({ zone, state, dispatch }) {
  const info = ZONE_DATA[zone];
  const hints = ZONE_HINTS[zone];
  const [showActiveHint, setShowActiveHint] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setShowActiveHint(true), 120_000);
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleSolve = () => {
    setConfetti(true);
    dispatch({ type: 'SOLVE_ZONE', zone });
    setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'map' }), 2500);
  };

  const goBack = () => dispatch({ type: 'SET_SCREEN', screen: 'map' });

  const PuzzleComponent = PUZZLE_MAP[zone];

  return (
    <div className={`screen ${info.bg}`} style={{ paddingTop: 56 }}>
      {zone !== 'cave' && <LeavesBg />}
      <GameHeader zoneName={info.name} elapsed={state.timer.elapsed} onBack={goBack} />

      <div
        className="scroll-area"
        style={{
          flex: 1, width: '100%', position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
      >
        <PuzzleComponent onSolve={handleSolve} />

        <HintSystem
          passiveEmoji={hints.passiveEmoji}
          passiveText={hints.passiveText}
          activeText={hints.activeText}
          showActive={showActiveHint}
          onPassiveUse={() => dispatch({ type: 'USE_HINT', hintType: 'passive' })}
          onActiveUse={() => dispatch({ type: 'USE_HINT', hintType: 'active' })}
        />
      </div>

      <Confetti active={confetti} />
    </div>
  );
}
