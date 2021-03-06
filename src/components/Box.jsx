import { produce } from "solid-js/store";
import {
  boxes,
  getNeighborhoodIndices,
  playing,
  revealAllMines,
  revealBox,
  setBoxes,
  setStatus,
  nColumn,
} from "../store";

const dev = false;

const colors = [
  "",
  "text-lime-400",
  "text-green-900",
  "text-amber-400",
  "text-violet-900",
  "text-red-900",
];

/**
 * @param {{ box: typeof boxes[0]; index: number; }} param0
 */
export function Box({ box, index }) {
  const genDynamicClass = () => {
    return {
      [`${colors[box().nNeighborhoodMines]}`]: true,
      "cursor-default": !playing() || box().isRevealed,
      "border-slate-200/80": box().isRevealed,
      "bg-gray-500/20 border-slate-400/20": !box().isRevealed,
      "transition duration-300 hover:bg-gray-100/40 hover:scale-110":
        playing() && !box().isRevealed,
    };
  };

  return (
    <button
      style={`width: ${(1 / nColumn()) * 100 * 0.9}vw; height: ${
        (1 / nColumn()) * 100 * 0.9
      }vw; max-width: 3rem;max-height: 3rem;`}
      classList={genDynamicClass()}
      class="
        font-mono
        rounded
        text-center
        border
      "
      onClick={[onFieldClick, { index }]}
    >
      {!dev && !box().isRevealed
        ? ""
        : box().isMine
        ? "💥"
        : box().nNeighborhoodMines || ""}
    </button>
  );
}

/**
 * @param {{boxes: typeof boxes; index: number }} box
 */
function expandZeros({ boxes, index }) {
  // console.log('expandZeros index:', index);
  const box = boxes[index];

  !box.isRevealed && revealBox(box);

  getNeighborhoodIndices({ index }).forEach((neighborhoodIndex, idx) => {
    const box = boxes[neighborhoodIndex];

    if (box.isRevealed) {
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
    setStatus("failed");
    revealAllMines();

    setTimeout(() => {
      alert("You Lost 🤕❗️❗️❗️");
    }, 20);

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
    setStatus("won");

    setTimeout(() => {
      alert("Congratulations! You Win 🎉");
    }, 20);
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
