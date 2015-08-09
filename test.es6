import tape from 'tape'
import InfiniteCanvas from './'
import createCanvas from 'create-canvas'

// init vars
let mainCanvas = null
let iCanvas = null
let compareCanvas = null

function drawTriangle (ctx, start=[0, 0]) {
  ctx.beginPath()
  ctx.moveTo((10 + start[0]), (10 + start[1]))
  ctx.lineTo((10 + start[0]), (16 + start[1]))
  ctx.lineTo((14 + start[0]), (13 + start[1]))
  ctx.closePath()
  ctx.stroke()
}

function test (description, fn) {
  tape(description, function (t) {
    t.done = () => {
      t.end()
      mainCanvas = iCanvas = compareCanvas = null
    }
    mainCanvas = createCanvas(200, 300)
    compareCanvas = createCanvas(200, 300)
    iCanvas = new InfiniteCanvas(mainCanvas)
    fn(t)
  })
}

test('origin should accumulate', function (t) {
  iCanvas.move([-20, 40])
  t.deepEqual(iCanvas.origin, [-20, 40])
  iCanvas.move([10, 20])
  t.deepEqual(iCanvas.origin, [-10, 60])
  t.done()
})

test('iCanvas should resize be the correct size', function (t) {
  t.equal(iCanvas.buffer.width, 200)
  t.equal(iCanvas.buffer.height, 300)
  iCanvas.move([20, 40])
  t.equal(iCanvas.buffer.width, 220)
  t.equal(iCanvas.buffer.height, 340)
  iCanvas.move([-10, 20])
  t.equal(iCanvas.buffer.width, 220)
  t.equal(iCanvas.buffer.height, 360)
  iCanvas.move([-40, 0])
  t.equal(iCanvas.buffer.width, 250)
  t.equal(iCanvas.buffer.height, 360)
  t.done()
})

test('should draw previous canvas in correct location moving down and right', function (t) {

  drawTriangle(iCanvas.buffer.getContext('2d'), [0, 0])
  drawTriangle(compareCanvas.getContext('2d'), [10, 30])

  iCanvas.move([10, 30])

  t.deepEqual(
    iCanvas.canvas.getContext('2d').getImageData(0, 0, 200, 300),
    compareCanvas.getContext('2d').getImageData(0, 0, 200, 300))

  t.end()
})

test('should draw previous canvas in correct location moving up and left', function (t) {
  drawTriangle(iCanvas.buffer.getContext('2d'), [40, 40])
  drawTriangle(compareCanvas.getContext('2d'), [20, 0])

  iCanvas.move([-20, -40])

  t.deepEqual(
    iCanvas.canvas.getContext('2d').getImageData(20, 0, 28, 8).data,
    compareCanvas.getContext('2d').getImageData(20, 0, 28, 8).data)

  t.end()
})
