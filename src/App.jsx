import { Board } from "./components/Board";
import { ControlPanel } from "./components/ControlPanel";
import { initGame } from "./store";

function App() {
  initGame();

  return (
    <div class="mt-10 flex flex-col items-center">
      <ControlPanel />
      <Board />
    </div>
  );
}

export default App;
