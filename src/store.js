import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export const [boxes, setBoxes] = createStore([]);
export const [nColumn, setNColumn] = createSignal();
export const [status, setStatus] = createSignal('playing');

/**
 * @typedef {'easy' | 'medium' | 'hard'} ILevel
 */

/**
 * @param {{ level: ILevel }} param0
 */
export function initGame({ level }) {
  /** @type {Record<ILevel, { nColumn: number; nMine: number; }>} */
  const config = {
    easy: { nColumn: 9, nMine: 9 },
    medium: { nColumn: 12, nMine: 20 },
    hard: { nColumn: 18, nMine: 80 },
  };

  const { nColumn, nMine } = config[level];

  const total = nColumn * nColumn;

  console.log('initGame:', {level, nColumn, nMine});

  const initialFields = Array.from({ length: total }, (_, index) => ({
    id: index,
    isMine: index < nMine ? true : false,
    nNeighborhoodMines: 0,
    isRevealed: false,
  }));

  shuffle(initialFields);
  setBoxes(initialFields);

  setNColumn(nColumn);
  setStatus('playing')
}

/**
 *
 * @param {any[]} arr
 */
function shuffle(arr) {
  return arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
}
