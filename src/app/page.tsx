"use client";

import {Game} from "@/app/Game";
import {OnlyCssBoard} from "@/app/OnlyCssBoard";
import {useState} from "react";

export default function Home() {
  const [tab, setTab] = useState<"onlyCss" | "react">("react");

  return (
    <div>
      <h1>Connect 4</h1>
      <button onClick={() => setTab("onlyCss")}>Only CSS</button>
      <button onClick={() => setTab("react")}>React</button>
      {tab === "onlyCss" && <OnlyCssBoard />}
      {tab === "react" && <Game />}
    </div>
  );
}
