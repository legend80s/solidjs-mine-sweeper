import { initGame, storeLevel } from '../store';

function reset(level) {
  if (level) {
    storeLevel(level);
  }

  initGame();
}

export function ControlPanel() {
  const cls = 'text-white font-medium px-2 py-1 rounded mr-1';

  return (
    <div class='flex mb-3'>
      <button
        onClick={[reset, null]}
        classList={{ [cls]: true, 'bg-green-700': true, 'mr-3': true }}
      >
        New Game
      </button>
      <div>
        <button
          onClick={[reset, 'easy']}
          classList={{ [cls]: true, 'bg-green-600': true }}
        >
          Easy
        </button>
        <button
          onClick={[reset, 'medium']}
          classList={{ [cls]: true, 'bg-yellow-600': true }}
        >
          Medium
        </button>
        <button
          onClick={[reset, 'hard']}
          classList={{ [cls]: true, 'bg-red-500': true }}
        >
          Hard
        </button>
      </div>
    </div>
  );
}
