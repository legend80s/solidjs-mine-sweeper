import { Index, createSignal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import styles from './App.module.css';

const dev = false;

function App() {
  const nColumn = 9;
  const total = nColumn * nColumn;
  const nMine = 5;

  const [status, setStatus] = createSignal('playing');

  const initialFields = Array.from({ length: total }, (_, index) => ({
    id: index,
    isMine: index < nMine ? true : false,
    nNeighborhoodMines: 0,
    isRevealed: false,
  }));

  shuffle(initialFields);

  const [boxes, setBoxes] = createStore(initialFields);

  /**
   * @param {{boxes: typeof boxes; number: index }} box
   */
  function expandZeros({ boxes, index }) {
    console.log('expandZeros index:', index);
    const box = boxes[index];

    // if (boxes[index].isRevealed) {
    //   return;
    // }

    !box.isRevealed && revealBox(box);

    getNeighborhoodIndices(boxes, index, nColumn).forEach(
      (neighborhoodIndex, idx) => {
        const box = boxes[neighborhoodIndex];
        console.log('neighborhoodIndex:', neighborhoodIndex);

        if (box.isRevealed) {
          console.log('idx isRevealed', idx);

          return;
        }

        const nNeighborhoodMines = calculateNeighborhoodMines(
          boxes,
          neighborhoodIndex,
          nColumn
        );

        markMineCount(box, nNeighborhoodMines);

        // setTimeout(() => {
        revealBox(box);
        // }, idx * 50);

        if (nNeighborhoodMines === 0) {
          expandZeros({ boxes, index: neighborhoodIndex });
        }
      }
    );
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
   * @param {{ boxes: typeof boxes; index: number }} params
   */
  function onFieldClick({ index }) {
    const box = boxes[index];

    console.log('onFieldClick', { isRevealed: box.isRevealed, index });

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

    const nNeighborhoodMines = calculateNeighborhoodMines(
      boxes,
      index,
      nColumn
    );

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

  const colors = [
    '',
    'text-lime-400',
    'text-green-900',
    'text-amber-400',
    'text-violet-900',
    'text-red-900',
  ];

  return (
    <div class='grid mt-10 place-items-center'>
      <ul
        class='max-w-lg grid gap-x-0.5 gap-y-1'
        classList={{ ['grid-cols-' + nColumn]: true }}
      >
        <Index each={boxes}>
          {(box, idx) => (
            <button
              classList={{
                [`${colors[box().nNeighborhoodMines]}`]: true,
                'cursor-default': status() === 'failed' || box().isRevealed,
                'bg-gray-200/90': !box().isRevealed,
                'hover:bg-gray-100/40':
                  status() !== 'failed' && !box().isRevealed,
              }}
              class='font-bold w-8 h-8 rounded text-center border border-slate-100'
              onClick={[onFieldClick, { index: idx }]}
            >
              {!dev && !box().isRevealed
                ? ''
                : box().isMine
                ? '💥'
                : box().nNeighborhoodMines || ''}
            </button>
          )}
        </Index>
      </ul>
    </div>
  );

  /**
   *
   * @param {typeof boxes} fields
   * @param {number} idx
   * @param {number} nColumn
   * @returns {typeof boxes}
   */
  function getNeighborhoodFields(fields, idx, nColumn) {
    return getNeighborhoodIndices(boxes, idx, nColumn).map((index) => {
      return fields[index];
    });
  }
  /**
   *
   * @param {typeof boxes} fields
   * @param {number} idx
   * @param {number} nColumn
   * @returns {number[]}
   */
  function getNeighborhoodIndices(fields, idx, nColumn) {
    const isEndBorder = (idx + 1) % nColumn === 0;
    const isStartBorder = idx % nColumn === 0;
    // console.log('getNeighborhoodFields:', { idx, nColumn, isEndBorder, isStartBorder });

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
      .map((offset) => offset + idx)
      .reduce((acc, index) => {
        const field = fields[index];

        return field ? acc.concat(index) : acc;
      }, []);
    // console.log('neighborhoodFields:', neighborhoodFields);

    return neighborhoodFields;
  }

  /** @param {typeof boxes} fields */
  function calculateNeighborhoodMines(fields, idx, nColumn) {
    return getNeighborhoodFields(fields, idx, nColumn).reduce((acc, field) => {
      // console.log('field.isMine', field.isMine);
      return acc + (field.isMine ? 1 : 0);
    }, 0);

    // const nNeighborhoodMines = [
    //   [-nColumn - 1, -nColumn, -nColumn + 1],
    //   [-1, 0, 1],
    //   [nColumn - 1, nColumn, nColumn + 1],
    // ].reduce((acc, [left, mid, right]) => {
    //   // rightmost
    //   let n = 0;

    //   if ((idx + 1) % nColumn === 0) {
    //     n += [left, mid].reduce((acc, offset) => {
    //       return acc + (fields[idx + offset]?.isMine ? 1 : 0);
    //     }, 0);
    //   }
    //   // leftmost
    //   else if (idx % nColumn === 0) {
    //     n += [mid, right].reduce((acc, offset) => {
    //       return acc + (fields[idx + offset]?.isMine ? 1 : 0);
    //     }, 0);
    //   } else {
    //     n += [left, mid, right].reduce((acc, offset) => {
    //       return acc + (fields[idx + offset]?.isMine ? 1 : 0);
    //     }, 0);
    //   }

    //   return acc + n;
    // }, 0);

    // return nNeighborhoodMines;
  }
}

export default App;

/**
 *
 * @param {any[]} arr
 */
function shuffle(arr) {
  return arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
}
