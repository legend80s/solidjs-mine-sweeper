import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { getItem, setItem } from './helper/storage';

export const enum LevelEnum {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

interface IBox {
  id: number;
  isMine: boolean;
  nNeighborhoodMines: number;
  isRevealed: boolean;
}

const LAST_LEVEL = getItem('level') || LevelEnum.EASY;

// console.log('LAST_LEVEL:', LAST_LEVEL);

export const [boxes, setBoxes] = createStore<IBox[]>([]);
export const [nColumn, setNColumn] = createSignal<number>();
export const [status, setStatus] = createSignal('playing');

export const [getLevel, setLevel] = createSignal<LevelEnum>(LAST_LEVEL);

export function isValidLevel(lvl: LevelEnum) {
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

export function initGame() {
  const level = getLevel();

  const config: Record<LevelEnum, { nColumn: number; nMine: number; }> = {
    easy: { nColumn: 9, nMine: 9 },
    medium: { nColumn: 12, nMine: 20 },
    hard: { nColumn: 15, nMine: 80 },
  };

  const { nColumn, nMine } = config[level];

  const total = nColumn * nColumn;

  console.log('initGame:', {level, nColumn, nMine});

  const initialFields: IBox[] = Array.from({ length: total }, (_, index) => ({
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

function shuffle(arr: any[]) {
  return arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
}

/**
 * @param index
 * @returns
 */
export function getNeighborhoodIndices({ index }: { index: number; }): number[] {
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
