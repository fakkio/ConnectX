import {Column} from "@/app/Column";
import {Disc} from "@/app/Disc";
import {ConnectX} from "@/engine/ConnectX";
import {HumanPlayer} from "@/engine/HumanPlayer";
import {RandomPlayer} from "@/engine/RandomPlayer";
import {isHumanPlayer} from "@/engine/types";
import {useGameState} from "@/hooks/useGameState";
import styles from "./Game.module.css";

const game = new ConnectX();
const humanPlayer = new HumanPlayer(game, "1", "#ff010b");
const randomPlayer = new RandomPlayer(game, "2", "#ffd918");

export function Game() {
  const gameState = useGameState(game);

  const handleColumnClick = (player: HumanPlayer, col: number) => {
    player.handleColumnClick(col);
  };

  const handleNewGame = () => {
    game.start([humanPlayer, randomPlayer]);
  };

  console.log("render");

  return (
    <div>
      <h3>React</h3>
      <div></div>
      <div className={styles.boardContainer}>
        <div className={styles.board}>
          <div className={styles.field}>
            <div className={styles.grid}>
              {gameState.status !== "ready" &&
                gameState.board.grid.map((col, colIndex) => {
                  const currentPlayer = gameState.currentPlayer;
                  const isInteractive =
                    gameState.status === "play" &&
                    col.length < gameState.board.rows &&
                    isHumanPlayer(currentPlayer);

                  return (
                    <Column
                      key={colIndex}
                      colIndex={colIndex}
                      isInteractive={isInteractive}
                      onInsert={
                        isInteractive
                          ? () => handleColumnClick(currentPlayer, colIndex)
                          : undefined
                      }
                    >
                      {col.map((cell, rowIndex) => (
                        <Disc
                          key={`${colIndex}-${rowIndex}`}
                          color={cell.color}
                          row={gameState.board.rows - rowIndex}
                        />
                      ))}
                      {isInteractive && (
                        <Disc
                          key={colIndex + "-" + col.length}
                          color={gameState.currentPlayer?.color}
                          isNext
                          row={gameState.board.rows - col.length}
                        />
                      )}
                    </Column>
                  );
                })}
            </div>
          </div>
          <div className={styles.front}></div>
        </div>
      </div>
      <button onClick={handleNewGame}>New Game</button>
      <pre>{JSON.stringify(gameState, null, 1)}</pre>
    </div>
  );
}
