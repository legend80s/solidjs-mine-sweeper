import { createSignal, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { getItem, setItem } from './helper/storage';

const LAST_LEVEL = getItem('level') || 'easy';

// console.log('LAST_LEVEL:', LAST_LEVEL);

export const [boxes, setBoxes] = createStore([]);
export const [nColumn, setNColumn] = createSignal();
export const [status, setStatus] = createSignal('playing');

const [getLevel, setLevel] = createSignal(LAST_LEVEL);

export function isValidLevel(lvl) {
  return ['easy', 'medium', 'hard'].includes(lvl);
}

export const storeLevel = (lvl) => {
  if (!isValidLevel(lvl)) {
    return;
  }

  setLevel(lvl);

  setItem('level', lvl)
}

export const playing = () => status() === 'playing';

/**
 * @typedef {'easy' | 'medium' | 'hard'} ILevel
 */

export function initGame() {
  const level = getLevel();

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

/**
 * @param {{ index: number }} index
 * @returns {number[]}
 */
export function getNeighborhoodIndices({ index }) {
  const columnCount = nColumn();
  const total = columnCount ** 2;

  const isEndBorder = (index + 1) % columnCount === 0;
  const isStartBorder = index % columnCount === 0;

  const neighborhoodFields = [
    [-columnCount - 1, -columnCount, -columnCount + 1],
    [-1, 0, 1],
    [columnCount - 1, columnCount, columnCount + 1],
  ]
    .reduce((acc, [left, mid, right]) => {
      // rightmost
      if (isEndBorder) {
        return [...acc, left, mid];
      }

      // leftmost
      if (isStartBorder) {
        return [...acc, mid, right];
      }

      return [...acc, left, mid, right];
    }, [])
    .map((offset) => {
      return offset + index;
    })
    .filter((idx) => {
      return idx >= 0 && idx < total;
    });

  // console.log('index', index, 'neighborhoodFields:', neighborhoodFields, 'total', total);

  return neighborhoodFields;
}
