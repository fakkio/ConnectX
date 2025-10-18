import {HumanPlayer} from "@/engine/HumanPlayer";
import {RandomPlayer} from "@/engine/RandomPlayer";
import {cns} from "@/helpers/cns";
import {useGameState} from "@/hooks/useGameState";
import {ConnectX} from "@/engine/ConnectX";
import {CSSProperties} from "react";
import styles from "./Game.module.css";

const game = new ConnectX();
const humanPlayer = new HumanPlayer(game, "1", "#ff010b");
const randomPlayer = new RandomPlayer(game, "2", "#ffd918");

export function Game() {
  const gameState = useGameState(game);

  const handleColumnClick = (col: number) => {
    humanPlayer.handleColumnClick(col);
  };

  return (
    <div>
      <h3>React</h3>
      <div className={styles.boardContainer}>
        <div className={styles.board}>
          <div className={styles.field}>
            <div className={styles.grid}>
              {gameState.board.grid.map((col, c) => {
                const isInteractive =
                  gameState.status === "play" &&
                  col.length < gameState.board.rows &&
                  gameState.currentPlayer?.type === "human";

                return (
                  <div
                    key={c}
                    className={styles.column}
                    onClick={
                      isInteractive ? () => handleColumnClick(c) : undefined
                    }
                    style={{cursor: isInteractive ? "pointer" : "not-allowed"}}
                  >
                    {col.map((cell, r) => (
                      <div
                        key={c + "-" + r}
                        className={styles.disc}
                        style={
                          {
                            "--row": gameState.board.rows - r,
                            "--player-color": cell.color,
                          } as CSSProperties
                        }
                      />
                    ))}
                    {isInteractive && (
                      <div
                        key={c + "-" + col.length}
                        className={cns(styles.disc, styles.next)}
                        style={
                          {
                            "--row": gameState.board.rows - col.length,
                            "--player-color": gameState.currentPlayer?.color,
                          } as CSSProperties
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.front}></div>
        </div>
      </div>
      <button onClick={() => game.start([humanPlayer, randomPlayer])}>
        New Game
      </button>
      <pre>{JSON.stringify(gameState, null, 1)}</pre>
      {/*      <div style={{display: "flex", flexDirection: "row"}}>
        {gameState.board.grid.map((row, r) => (
          <div
            key={r}
            style={{display: "flex", flexDirection: "column", width: "3rem"}}
          >
            {row.map((cell, c) => (
              <span
                key={r + "-" + c}
                style={{
                  height: "3rem",
                  width: "3rem",
                  borderRadius: "50%",
                  backgroundColor: cell.color,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {cell.name}
              </span>
            ))}
          </div>
        ))}
      </div>*/}
    </div>
  );
}
