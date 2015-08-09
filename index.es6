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

export default class InfiniteCanvas {

  constructor (canvas) {

    // optional new keyword
    if (!(this instanceof InfiniteCanvas)) {return new InfiniteCanvas(canvas)}

    // instantiate
    this.canvas = canvas
    this.canvasContext = canvas.getContext('2d')
    this.buffer = copyCanvas(canvas)
    this.bufferContext = this.buffer.getContext('2d')
    this.origin = [0, 0]
    this._originMax = [0, 0]
    this._originMin = [0, 0]
    this._originDraw = [0, 0]
  }

  // set the absolute [x, y] origin position of the buffer canvas on
  // the main canvas to pan around
  setOrigin (newOrigin) {

    // update origins
    let originDiff = subtract([], newOrigin, this.origin)
    this.origin = newOrigin
    this._originMax = max([], this.origin, this._originMax)
    this._originMin = min([], this.origin, this._originMin)

    // get dimensions
    let canvasDimensions = getDimensions(this.canvas)
    let bufferDimensions = getDimensions(this.buffer)
    let maxDimensions = add([], canvasDimensions,
      add([], this._originMax, abs(this._originMin)))

    // resize
    let maxDimensionsDiff = subtract([], maxDimensions, bufferDimensions)
    this.buffer = resizeCanvas(this.buffer, maxDimensionsDiff,
      getResizeFrom(this.buffer, originDiff))

    // redraw
    this._originDraw = min([], [0, 0], add([], this._originDraw, originDiff))
    this.refresh()
  }

  // pan with relative [x, y] values
  move (originDiff) {
    this.setOrigin(add([], this.origin, originDiff))
  }

  // copy whatever was drawn on the canvas to the buffer
  commitToBuffer () {
    drawToCanvas(this.canvas, this.bufferContext, this.origin)
  }

  // redraw to the canvas from the buffer
  refresh () {

    // erase canvas
    clearCanvas(this.canvasContext)

    // draw to canvas
    drawToCanvas(this.buffer, this.canvasContext, this._originDraw)
  }
}
