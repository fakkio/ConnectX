# Connect 4

## Opponents

### Monte Carlo Tree Search (MCTS)

The opponent plays random simulated games while keeping track of how often each move leads to a win.
When the allocated time runs out, the opponent selects the move that resulted in the highest number of victories.

#### Future Improvements

- Implement the UCT (Upper Confidence Bound for Trees) algorithm to balance exploration and exploitation during move selection.
- Reuse the search tree across turns to improve efficiency.
- Switch to a graph-based version to allow node sharing across multiple game paths.
