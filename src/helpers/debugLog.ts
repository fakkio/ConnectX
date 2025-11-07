import {DEBUG} from "@/consts";

export function debugLog(
  message?: unknown,
  ...optionalParams: unknown[]
): void {
  if (DEBUG) {
    console.log(message, ...optionalParams);
  }
}
