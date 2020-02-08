import { Grid, Vector } from "@hex-engine/2d"
import { vec } from "./helpers"

type GameState = "PLACING_X" | "PLACING_O" | "X_WON" | "O_WON" | "TIE"
type PlayerMark = "x" | "o" | " "
type GameGrid = Grid<PlayerMark>

export class TicTacToeGame {
  state: GameState = "PLACING_X"
  grid: GameGrid = new Grid(3, 3, " ")

  handleClick(position: Vector) {
    const currentMark = this.grid.get(position)

    switch (this.state) {
      case "PLACING_X": {
        if (currentMark === " ") {
          this.grid.set(position, "x")
          this.state = this.getWinnerState() ?? "PLACING_O"
        }
        break
      }
      case "PLACING_O": {
        if (currentMark === " ") {
          this.grid.set(position, "o")
          this.state = this.getWinnerState() ?? "PLACING_X"
        }
        break
      }
    }
  }

  private getWinnerState(): GameState | undefined {
    const winningStates = [
      [vec(0, 0), vec(1, 0), vec(2, 0)],
      [vec(0, 1), vec(1, 1), vec(2, 1)],
      [vec(0, 2), vec(1, 2), vec(2, 2)],
      [vec(0, 0), vec(0, 1), vec(0, 2)],
      [vec(1, 0), vec(1, 1), vec(1, 2)],
      [vec(2, 0), vec(2, 1), vec(2, 2)],
      [vec(0, 0), vec(1, 1), vec(2, 2)],
      [vec(2, 0), vec(1, 1), vec(0, 2)],
    ]

    const hasWinningLine = (mark: PlayerMark) => {
      return winningStates.some((spacePositions) =>
        spacePositions.every((position) => this.grid.get(position) === mark),
      )
    }

    if (hasWinningLine("x")) return "X_WON"
    if (hasWinningLine("o")) return "O_WON"
    return undefined
  }
}
