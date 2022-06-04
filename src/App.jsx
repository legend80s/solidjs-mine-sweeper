import { createSignal } from 'solid-js';
import { Board } from './components/Board';
import { initGame } from './store';

function App() {
  const [level, setLevel] = createSignal('easy');

  initGame({ level: level() });

  return (
    <div class='grid mt-10 place-items-center'>
      <Board />
    </div>
  );
}

export default App;
