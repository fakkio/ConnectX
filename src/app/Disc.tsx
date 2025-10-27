import styles from "@/app/Game.module.css";
import {cns} from "@/helpers/cns";
import {CSSProperties} from "react";

interface DiscProps {
  color: CSSProperties["color"];
  isNext?: boolean;
  row: number;
}
export function Disc({color, isNext, row}: DiscProps) {
  return (
    <div
      className={cns(styles.disc, isNext && styles.next)}
      style={
        {
          "--row": row,
          "--player-color": color,
        } as CSSProperties
      }
    />
  );
}
