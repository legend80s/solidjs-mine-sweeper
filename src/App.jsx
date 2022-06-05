import { Board } from './components/Board';
import { ControlPanel } from './components/ControlPanel';
import { initGame } from './store';

function App() {
  initGame();

  return (
    <div class='grid mt-10 place-items-center'>
      <ControlPanel />
      <Board />
    </div>
  );
}

export default App;
