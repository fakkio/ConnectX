# Connect X (TypeScript + React)

An implementation of the classic **Connect Four** game built with **TypeScript** and **React**.
This project was born from my desire to experiment with advanced **JavaScript** concepts (such as *async generators*), modern **React** patterns (like `useSyncExternalStore`), and various **algorithms** and **data structures** — including **Monte Carlo Tree Search**, **neural networks**, **minimax with alpha-beta pruning**, **trees**, and **graphs**.

## Opponents

### Monte Carlo Tree Search (MCTS)

The opponent plays random simulated games while keeping track of how often each move leads to a win.
When the allocated time runs out, the opponent selects the move that resulted in the highest number of victories.

#### Future Improvements

- Implement the UCT (Upper Confidence Bound for Trees) algorithm to balance exploration and exploitation during move selection.
- Reuse the search tree across turns to improve efficiency.
- Switch to a graph-based version to allow node sharing across multiple game paths.
