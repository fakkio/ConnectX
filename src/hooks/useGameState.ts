import {GameState} from "@/engine/types";
import {useSyncExternalStore} from "react";
import {ConnectX} from "@/engine/ConnectX";

export function useGameState(game: ConnectX) {
  const gameState = useSyncExternalStore(
    (callback) => game.subscribe(callback),

    () => game.getGameState(),

    () =>
      ({
        status: "ready",
        board: {cols: 7, rows: 6, grid: []},
        history: [],
        currentPlayer: null,
      }) satisfies GameState,
  );

  return gameState;
}
