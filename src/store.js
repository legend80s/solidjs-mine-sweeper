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

const cache = {}

/**
 * @param {{ index: number }} index
 * @returns {number[]}
 */
export function getNeighborhoodIndices({ index }) {
  if (cache[index]) {
    // console.log('index', index, 'hit');

    return cache[index];
  }

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

  return cache[index] = neighborhoodFields;
}
