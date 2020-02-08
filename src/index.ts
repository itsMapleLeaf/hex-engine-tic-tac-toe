import {
  Canvas,
  createRoot,
  Geometry,
  Grid,
  Label,
  Mouse,
  Polygon,
  SystemFont,
  useChild,
  useDraw,
  useNewComponent,
  useType,
  Vector,
} from "@hex-engine/2d"
import { vec } from "./helpers"

type GameState = "PLACING_X" | "PLACING_O" | "X_WON" | "O_WON" | "TIE"
type PlayerMark = "x" | "o" | " "
type GameGrid = Grid<PlayerMark>

function getWinnerState(grid: GameGrid): GameState | undefined {
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

  function hasWinningLine(mark: PlayerMark) {
    return winningStates.some((spacePositions) =>
      spacePositions.every((position) => grid.get(position) === mark),
    )
  }

  if (hasWinningLine("x")) return "X_WON"
  if (hasWinningLine("o")) return "O_WON"
  return undefined
}

function Root() {
  useType(Root)

  const canvas = useNewComponent(() => Canvas({ backgroundColor: "white" }))
  canvas.fullscreen()

  const grid: GameGrid = new Grid(3, 3, " ")
  const cellSize = new Vector(50, 50)
  const firstCellPosition = new Vector(100, 100)

  let state: GameState = "PLACING_X"

  for (const [rowIndex, columnIndex] of grid.contents()) {
    useChild(() =>
      Cell({
        size: cellSize,
        position: firstCellPosition
          .addX(cellSize.x * rowIndex)
          .addY(cellSize.y * columnIndex),
        getContent: () => grid.get(rowIndex, columnIndex),

        onClick() {
          switch (state) {
            case "PLACING_X": {
              const content = grid.get(rowIndex, columnIndex)
              if (content === " ") {
                grid.set(rowIndex, columnIndex, "x")
                state = getWinnerState(grid) ?? "PLACING_O"
              }
              break
            }
            case "PLACING_O": {
              const content = grid.get(rowIndex, columnIndex)
              if (content === " ") {
                grid.set(rowIndex, columnIndex, "o")
                state = getWinnerState(grid) ?? "PLACING_X"
              }
              break
            }
          }
        },
      }),
    )
  }

  const font = useNewComponent(() =>
    SystemFont({ name: "sans-serif", size: 14 }),
  )
  const stateLabel = useNewComponent(() => Label({ font }))

  useDraw((context) => {
    switch (state) {
      case "PLACING_X": {
        stateLabel.text = "X's turn"
        break
      }
      case "PLACING_O": {
        stateLabel.text = "O's turn"
        break
      }
      case "X_WON": {
        stateLabel.text = "X won"
        break
      }
      case "O_WON": {
        stateLabel.text = "O won"
        break
      }
      case "TIE": {
        stateLabel.text = "Tie game"
        break
      }
    }
    stateLabel.draw(context, { x: 20, y: 20 })
  })
}

function Cell({
  size,
  position,
  getContent,
  onClick,
}: {
  size: Vector
  position: Vector
  getContent: () => string
  onClick: () => void
}) {
  useType(Cell)

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(size),
      position,
    }),
  )

  const font = useNewComponent(() =>
    SystemFont({ name: "sans-serif", size: size.y }),
  )

  const label = useNewComponent(() => Label({ font }))

  useDraw((context) => {
    context.lineWidth = 1
    context.strokeStyle = "black"
    context.strokeRect(0, 0, size.x, size.y)

    label.text = getContent()
    label.draw(context)
  })

  const mouse = useNewComponent(Mouse)
  mouse.onClick(onClick)
}

createRoot(Root)
