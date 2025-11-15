"use client";

import {Game} from "@/app/Game";
import {useGame} from "@/context/GameContext";
import {Intro} from "./Intro";

export default function Home() {
  const {gameState} = useGame();

  if (gameState.status === "ready") {
    return <Intro />;
  }

  return <Game />;
}
