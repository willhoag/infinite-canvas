import clearCanvas from 'clear-canvas'
import drawToCanvas from 'draw-to-canvas'
import resizeCanvas from 'resize-canvas'
import copyCanvas from 'copy-canvas'
import add from 'gl-vec2/add'
import max from 'gl-vec2/max'
import min from 'gl-vec2/min'
import subtract from 'gl-vec2/subtract'

// utility functions
let getDimensions = (canvas) => [canvas.width, canvas.height]
let abs = (arr) => arr.map(Math.abs)

// calculate where to scale from. If x or y is positive, scale from 0
// otherwise scale from bottom or right
function getResizeFrom (canvas, originDiff) {
  let resizeFrom = getDimensions(canvas)
  if (originDiff[0] <= 0) resizeFrom[0] = 0
  if (originDiff[1] <= 0) resizeFrom[1] = 0
  return resizeFrom
}

export default function InfiniteCanvas (canvas) {

  let canvasContext = canvas.getContext('2d')
  let buffer = copyCanvas(canvas)
  let bufferContext = buffer.getContext('2d')

  // private properties
  let origin = [0, 0]
  let originMax = [0, 0]
  let originMin = [0, 0]
  let originDraw = [0, 0]

  // set the absolute [x, y] origin position of the buffer canvas on
  // the main canvas to pan around
  function setOrigin (newOrigin) {

    // update origins
    let originDiff = subtract([], newOrigin, origin)
    origin = newOrigin
    originMax = max([], origin, originMax)
    originMin = min([], origin, originMin)

    // get dimensions
    let canvasDimensions = getDimensions(canvas)
    let bufferDimensions = getDimensions(buffer)
    let maxDimensions = add([], canvasDimensions,
      add([], originMax, abs(originMin)))

    // resize
    let maxDimensionsDiff = subtract([], maxDimensions, bufferDimensions)
    resizeCanvas({
      canvas: buffer,
      diff: maxDimensionsDiff,
      from: getResizeFrom(buffer, originDiff)
    })

    // redraw
    originDraw = min([], [0, 0], add([], originDraw, originDiff))
    refresh()
  }

  // pan with relative [x, y] values
  function move (originDiff) {
    setOrigin(add([], origin, originDiff))
  }

  // copy whatever was drawn on the canvas to the buffer
  function commitToBuffer () {
    drawToCanvas(canvas, bufferContext, origin)
  }

  // redraw to the canvas from the buffer
  function refresh () {

    // erase canvas
    clearCanvas(canvasContext)

    // draw to canvas
    drawToCanvas(buffer, canvasContext, originDraw)
  }

  return Object.freeze({
    canvas,
    buffer,
    canvasContext,
    bufferContext,
    getOrigin: () => origin,
    setOrigin,
    move,
    commitToBuffer,
    refresh
  })
}
