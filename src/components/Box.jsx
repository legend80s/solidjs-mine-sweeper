import { produce } from 'solid-js/store';
import {
  boxes,
  getNeighborhoodIndices,
  playing,
  setBoxes,
  setStatus,
  status,
} from '../store';

const dev = false;

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
  const genDynamicClass = () => ({
    [`${colors[box().nNeighborhoodMines]}`]: true,
    'cursor-default': !playing() || box().isRevealed,
    'bg-gray-500/20': !box().isRevealed,
    'hover:bg-gray-100/40': playing() && !box().isRevealed,
  });

  return (
    <button
      classList={genDynamicClass()}
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
      // console.log(neighborhoodIndex, 'isRevealed');

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

  if (box.isRevealed || !playing()) {
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
    setStatus('won');

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
