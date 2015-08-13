// require module
import InfiniteCanvas from './'
let canvas = document.querySelector('#canvas')
let infiniteCanvas = new InfiniteCanvas(canvas) // make instance
let ctx = canvas.getContext('2d') // get canvas context
ctx = infiniteCanvas.canvasContext // or pull it from the instance
infiniteCanvas.setOrigin([-20, 40]) // move down 20 and right 40

// draw a circle on canvas
ctx.beginPath()
ctx.arc(100, 100, 50, 0, 2 * Math.PI)
ctx.stroke()
infiniteCanvas.commitToBuffer() // and commit it to buffer

// or draw directly to the buffer
let bufferCtx = infiniteCanvas.buffer.getContext('2d') // get buffer context
bufferCtx = infiniteCanvas.bufferContext // or pull it from the instance

// draw a circle on the buffer
bufferCtx.beginPath()
bufferCtx.arc(100, 100, 50, 0, 2 * Math.PI)
bufferCtx.stroke()
infiniteCanvas.refresh() // and update the canvas

infiniteCanvas.move([10, 20]) // move up 10 and right 20
infiniteCanvas.getOrigin() // [-10, 60] // check updated origin
