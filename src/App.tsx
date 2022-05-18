import { useCallback, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "./App.css";

const ROWS = 9;
const COLS = 9;
const MINES_COUNT = 10;
const MINE_SYMBOL = "💣";

type GameStateColor = {
  [key: string]: string;
};

const gameStateColor: GameStateColor = {
  INITIALIZING: "text-black-300",
  PLAYING: "text-blue-800",
  WON: "text-green-700",
  LOSS: "text-red-700",
};

type CellValue = "" | number | "💣" | "🚩";

interface Cell {
  bgClass: string;
  value: CellValue;
}

const initialCellState: Cell = {
  bgClass: "bg-gray-300",
  value: "",
};
const initialCells = new Array(ROWS * COLS).fill(initialCellState);

const GameState = {
  INITIALIZING: "INITIALIZING...",
  PLAYING: "PLAYING",
  WON: "WON",
  LOSS: "LOSS",
};

function App() {
  const [cells, setCells] = useState<Cell[]>(() => initialCells);
  const [mines, setMines] = useState<number[]>([]);
  const [gameState, setGameState] = useState(GameState.INITIALIZING);
  const { width, height } = useWindowSize();

  useEffect(() => {
    calculateMines();
  }, []);

  function calculateMines() {
    let mine;
    let _mines = [];
    for (let i = 0; i < MINES_COUNT; i++) {
      mine = Math.floor(Math.random() * (ROWS * COLS));

      if (mine in mines) {
        while (mine in mines) {
          mine = Math.floor(Math.random() * (ROWS * COLS));
        }
      }

      _mines.push(mine);
    }

    setMines(_mines);

    setTimeout(() => {
      setGameState(GameState.PLAYING);
    }, 1000);
  }

  function restartGame() {
    setCells(initialCells);
    setMines([]);
    setGameState(GameState.INITIALIZING);

    calculateMines();
  }

  function discoverCell(index: number) {
    // Scenario: gameState is not PLAYING
    if (gameState !== GameState.PLAYING) {
      return;
    }

    const _cells = [...cells];

    // Scenario: User clicked on a cell that has a mine => LOSS
    if (mines.includes(index)) {
      _cells[index] = {
        ..._cells[index],
        value: MINE_SYMBOL,
        bgClass: "bg-red-300",
      };

      mines.forEach((mine) => {
        if (mine !== index) {
          _cells[mine] = {
            ..._cells[mine],
            value: MINE_SYMBOL,
          };
        }
      });
      setGameState(GameState.LOSS);
    }
    setCells(_cells);
  }

  if (gameState === GameState.WON) {
    return <Confetti width={width} height={height} />;
  }

  return (
    <main className="flex flex-col justify-center items-center w-screen h-screen space-y-4">
      <h1 className="text-2xl font-bold">Minesweeper</h1>

      <div className="flex flex-col items-center space-y-4">
        <h2>
          STATUS:{" "}
          <span className={`font-bold ${gameStateColor[gameState]}`}>
            {gameState}
          </span>
        </h2>
        {[GameState.WON, GameState.LOSS].includes(gameState) && (
          <button
            className="bg-red-500 text-white transition-all duration-200 hover:bg-red-600 px-4 py-2 rounded-md text-sm"
            onClick={restartGame}
          >
            Play again
          </button>
        )}
      </div>
      <div className="grid grid-cols-9 gap-[2px]">
        {cells.map(({ value, bgClass }, index) => (
          <button
            onClick={() => discoverCell(index)}
            className={`w-10 h-10 ${bgClass} hover:bg-gray-400 transition-all duration-200 ${
              gameState === GameState.LOSS && "pointer-events-none"
            }`}
            key={index}
          >
            {value}
          </button>
        ))}
      </div>
    </main>
  );
}

export default App;
