// Generic time-slicing helper for CPU-bound loops running on the main thread.
// It repeatedly calls the provided `iteration` function in small batches and
// yields to the browser between batches so the UI can repaint and stay
// responsive (animations keep running).

export interface RunTimeSlicedOptions {
  timeSliceMS?: number; // max ms to spend per chunk before yielding (default 10)
  maxIterationsPerChunk?: number; // safety cap iterations per chunk (default 200)
}

export async function runTimeSliced(
  iteration: () => void | Promise<void>,
  timeLimitMS: number,
  options: RunTimeSlicedOptions = {},
) {
  const timeSliceMS = options.timeSliceMS ?? 10;
  const maxIterationsPerChunk = options.maxIterationsPerChunk ?? 200;

  const startTime = Date.now();
  const endTime = startTime + timeLimitMS;

  const yieldToBrowser = () =>
    new Promise<void>((resolve) => {
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(() => resolve());
      } else {
        setTimeout(() => resolve(), 0);
      }
    });

  while (Date.now() < endTime) {
    const chunkStart = Date.now();
    let iterations = 0;

    while (
      Date.now() < endTime &&
      iterations < maxIterationsPerChunk &&
      Date.now() - chunkStart < timeSliceMS
    ) {
      await iteration();
      iterations++;
    }

    if (Date.now() < endTime) {
      await yieldToBrowser();
    }
  }
}
