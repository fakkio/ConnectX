"use client";

import {ConnectX} from "@/engine/ConnectX";
import {HumanPlayer} from "@/engine/HumanPlayer";
import {RandomPlayer} from "@/engine/RandomPlayer";
import {GameState, GameStateReady, Player, PlayerConfig} from "@/engine/types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

type GameContextValue = {
  game: ConnectX;
  gameState: GameState;
  start: (players: PlayerConfig[]) => void;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);
const game = new ConnectX();
const serverSnapshot = {status: "ready"} as GameStateReady;
const start = (playerConfigs: PlayerConfig[]) => {
  const players: Player[] = playerConfigs.map(({type, name, color}) => {
    if (type === "human") return new HumanPlayer(game, name, color);
    else if (type === "random") return new RandomPlayer(game, name, color);
    else throw new Error(`Unknown player type: ${type}`);
  });
  void game.start(players);
};

export const GameProvider = ({children}: PropsWithChildren) => {
  const gameState = useSyncExternalStore(
    (callback) => game.subscribe(callback),
    () => game.gameState,
    () => serverSnapshot,
  );

  const value = useMemo(() => ({game, gameState, start}), [gameState]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be used within a GameProvider");
  return value;
}
