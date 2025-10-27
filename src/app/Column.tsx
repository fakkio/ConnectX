import styles from "@/app/Game.module.css";
import {PropsWithChildren} from "react";

interface ColumnProps extends PropsWithChildren {
  colIndex: number;
  isInteractive: boolean;
  onInsert: (() => void) | undefined;
}

export function Column(props: ColumnProps) {
  return (
    <div
      role="button"
      tabIndex={props.isInteractive ? 0 : -1}
      aria-label={`Column ${props.colIndex + 1}`}
      className={styles.column}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          props.onInsert?.();
        }
      }}
      onClick={props.onInsert}
      style={{cursor: props.isInteractive ? "pointer" : "not-allowed"}}
    >
      {props.children}
    </div>
  );
}
