import {GameState} from "@/engine/types";
import {useSyncExternalStore} from "react";
import {ConnectX} from "@/engine/ConnectX";

const serverSnapshot = {
  status: "ready",
} satisfies GameState;

export function useGameState(game: ConnectX) {
  const gameState = useSyncExternalStore(
    (callback) => game.subscribe(callback),

    () => game.gameState,

    () => serverSnapshot,
  );

  return gameState;
}
