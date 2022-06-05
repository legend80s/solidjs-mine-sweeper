import { produce } from 'solid-js/store';
import {
  boxes,
  nColumn as getColumnCount,
  setBoxes,
  setStatus,
  status,
} from '../store';

const dev = false;

const playing = () => status() === 'playing';

const colors = [
  '',
  'text-lime-400',
  'text-green-900',
  'text-amber-400',
  'text-violet-900',
  'text-red-900',
];

/**
 * @param {{ box: typeof boxes[0]; index: number; }} param0
 */
export function Box({ box, index }) {
  return (
    <button
      classList={{
        [`${colors[box().nNeighborhoodMines]}`]: true,
        'cursor-default': status() === 'failed' || box().isRevealed,
        'bg-gray-500/20': !box().isRevealed,
        'hover:bg-gray-100/40': playing() && !box().isRevealed,
      }}
      class='font-bold w-8 h-8 rounded text-center border border-slate-100'
      onClick={[onFieldClick, { index }]}
    >
      {!dev && !box().isRevealed
        ? ''
        : box().isMine
        ? '💥'
        : box().nNeighborhoodMines || ''}
    </button>
  );
}

/**
 * @param {{boxes: typeof boxes; number: index }} box
 */
function expandZeros({ boxes, index }) {
  // console.log('expandZeros index:', index);
  const box = boxes[index];

  // if (boxes[index].isRevealed) {
  //   return;
  // }

  !box.isRevealed && revealBox(box);

  getNeighborhoodIndices({ index }).forEach((neighborhoodIndex, idx) => {
    const box = boxes[neighborhoodIndex];
    // console.log('neighborhoodIndex:', neighborhoodIndex);

    if (box.isRevealed) {
      // console.log('idx isRevealed', idx);

      return;
    }

    const nNeighborhoodMines = calculateNeighborhoodMines(
      boxes,
      neighborhoodIndex
    );

    markMineCount(box, nNeighborhoodMines);

    // setTimeout(() => {
    revealBox(box);
    // }, idx * 50);

    if (nNeighborhoodMines === 0) {
      expandZeros({ boxes, index: neighborhoodIndex });
    }
  });
}

/**
 *
 * @param {typeof boxes[0]} box
 */
function revealBox(box) {
  setBoxes(
    ({ id }) => box.id === id,
    produce((box) => (box.isRevealed = true))
  );
}

/**
 * @param {{ index: number }} params
 */
function onFieldClick({ index }) {
  const box = boxes[index];

  // console.log('onFieldClick', { isRevealed: box.isRevealed, index });

  if (box.isRevealed || status() === 'failed' || status() === 'success') {
    return;
  }

  revealBox(box);

  if (box.isMine) {
    setStatus('failed');

    setTimeout(() => {
      alert('失败');
    });

    // revealAllMines();
    setBoxes(
      (box) => box.isMine,
      produce((box) => (box.isRevealed = true))
    );

    return;
  }

  const nNeighborhoodMines = calculateNeighborhoodMines(boxes, index);

  // console.log('nNeighborhoodMines:', nNeighborhoodMines);
  // console.log('before', box.nNeighborhoodMines);
  markMineCount(box, nNeighborhoodMines);
  // console.log('after', box.nNeighborhoodMines);

  if (nNeighborhoodMines === 0) {
    expandZeros({ boxes, index });
  }

  if (boxes.filter((box) => !box.isMine).every((box) => box.isRevealed)) {
    setStatus('success');

    setTimeout(() => {
      alert('成功 🎉🎉🎉');
    });
  }
}

function markMineCount(box, nNeighborhoodMines) {
  setBoxes(
    ({ id }) => id === box.id,
    produce((box) => (box.nNeighborhoodMines = nNeighborhoodMines))
  );
}

/** @param {typeof boxes} fields */
function calculateNeighborhoodMines(fields, idx) {
  return getNeighborhoodFields(fields, idx).reduce((acc, field) => {
    // console.log('field.isMine', field.isMine);
    return acc + (field.isMine ? 1 : 0);
  }, 0);
}

/**
 *
 * @param {typeof boxes} fields
 * @param {number} idx
 * @returns {typeof boxes}
 */
function getNeighborhoodFields(fields, idx) {
  return getNeighborhoodIndices({ index: idx }).map((index) => {
    return fields[index];
  });
}
/**
 *
 * @param {{ index: number }} index
 * @returns {number[]}
 */
function getNeighborhoodIndices({ index }) {
  const nColumn = getColumnCount();
  const total = nColumn ** nColumn;

  const isEndBorder = (index + 1) % nColumn === 0;
  const isStartBorder = index % nColumn === 0;

  const neighborhoodFields = [
    [-nColumn - 1, -nColumn, -nColumn + 1],
    [-1, 0, 1],
    [nColumn - 1, nColumn, nColumn + 1],
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

  // console.log('index', index, 'neighborhoodFields:', neighborhoodFields);

  return neighborhoodFields;
}
