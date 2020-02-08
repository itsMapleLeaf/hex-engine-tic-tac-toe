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

type GameState = "PLACING_X" | "PLACING_O" | "X_WON" | "O_WON" | "TIE"

function Root() {
  useType(Root)

  const canvas = useNewComponent(() => Canvas({ backgroundColor: "white" }))
  canvas.fullscreen()

  const grid = new Grid(3, 3, " ")
  const cellSize = new Vector(50, 50)
  const firstCellPosition = new Vector(100, 100)

  let state: GameState = "PLACING_X"

  function checkForWinCondition() {
    for (const [rowIndex, columnIndex, value] of grid.contents()) {
      if (value === "x" || value === "o") {
        const up = grid.get(rowIndex - 1, columnIndex)
        const down = grid.get(rowIndex + 1, columnIndex)
        const left = grid.get(rowIndex, columnIndex - 1)
        const right = grid.get(rowIndex, columnIndex + 1)
        const upLeft = grid.get(rowIndex - 1, columnIndex - 1)
        const upRight = grid.get(rowIndex - 1, columnIndex + 1)
        const downLeft = grid.get(rowIndex + 1, columnIndex - 1)
        const downRight = grid.get(rowIndex + 1, columnIndex + 1)
        if (
          (up === value && down === value) ||
          (left === value && right === value) ||
          (upLeft === value && downRight === value) ||
          (upRight === value && downLeft === value)
        ) {
          state = value === "x" ? "X_WON" : "O_WON"
        }
      }
    }
    const allCells = [...grid.contents()].map(([row, column, value]) => value)
    if (
      allCells.every((value) => value !== " ") &&
      state !== "X_WON" &&
      state !== "O_WON"
    ) {
      state = "TIE"
    }
  }

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
                state = "PLACING_O"
              }
              break
            }
            case "PLACING_O": {
              const content = grid.get(rowIndex, columnIndex)
              if (content === " ") {
                grid.set(rowIndex, columnIndex, "o")
                state = "PLACING_X"
              }
              break
            }
          }

          checkForWinCondition()
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
