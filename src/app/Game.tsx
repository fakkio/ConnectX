import {Column} from "@/app/Column";
import {Disc} from "@/app/Disc";
import {TypographyH1} from "@/components/ui/typography";
import {useGame} from "@/context/GameContext";
import {HumanPlayer} from "@/engine/HumanPlayer";
import {Connect4Error, isHumanPlayer} from "@/engine/types";
import {CSSProperties} from "react";
import styles from "./Game.module.css";

export function Game() {
  const {gameState} = useGame();

  const handleColumnClick = (player: HumanPlayer, col: number) => {
    player.handleColumnClick(col);
  };

  if (gameState.status === "ready") {
    throw new Connect4Error("Game component rendered in invalid state");
  }

  return (
    <div className={styles.gameWrapper}>
      <TypographyH1>Connect 4</TypographyH1>
      {gameState.status === "win" ? (
        <p>
          <span
            style={{backgroundColor: gameState.winner.color}}
            className="inline-block h-3 w-3 rounded-full"
          />{" "}
          {gameState.winner.name} wins!
        </p>
      ) : gameState.status === "draw" ? (
        <p>It&#39;s a draw!</p>
      ) : gameState.status === "play" ? (
        <p>
          <span
            style={{backgroundColor: gameState.currentPlayer?.color}}
            className="inline-block h-3 w-3 rounded-full"
          />{" "}
          {gameState.currentPlayer?.name}&#39;s turn
        </p>
      ) : null}
      <div className={styles.boardContainer}>
        <div
          className={styles.board}
          style={
            {
              "--rows": gameState.board.rows,
              "--cols": gameState.board.cols,
            } as CSSProperties
          }
        >
          <div className={styles.field}>
            <div className={styles.grid}>
              {gameState.board.grid.map((col, colIndex) => {
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
                        isWinner={
                          gameState.status === "win" &&
                          gameState.discsCoordinates.some(
                            ([colC, rowC]) =>
                              colC === colIndex && rowC === rowIndex,
                          )
                        }
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
    </div>
  );
}
