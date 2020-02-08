import {
  Canvas,
  createRoot,
  Geometry,
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
import { TicTacToeGame } from "./TicTacToeGame"

function Root() {
  useType(Root)

  const game = new TicTacToeGame()

  const canvas = useNewComponent(() => Canvas({ backgroundColor: "white" }))
  canvas.fullscreen()

  const cellSize = new Vector(50, 50)
  const firstCellPosition = new Vector(100, 100)

  for (const [rowIndex, columnIndex] of game.grid.contents()) {
    useChild(() =>
      Cell({
        size: cellSize,
        position: firstCellPosition
          .addX(cellSize.x * rowIndex)
          .addY(cellSize.y * columnIndex),

        getContent: () => game.grid.get(rowIndex, columnIndex),

        onClick() {
          game.handleClick(vec(rowIndex, columnIndex))
        },
      }),
    )
  }

  const font = useNewComponent(() =>
    SystemFont({ name: "sans-serif", size: 14 }),
  )
  const stateLabel = useNewComponent(() => Label({ font }))

  useDraw((context) => {
    switch (game.state) {
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
