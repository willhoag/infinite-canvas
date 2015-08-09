import InfiniteCanvas from './'
import Canvas from 'create-canvas'
let mainCanvas = Canvas(200, 300)
let canvas = new InfiniteCanvas(mainCanvas)

// move down 20 and right 40
canvas.move([-20, 40])

// move up 10 and right 20
canvas.move([10, 20])

// check updated origin
canvas.origin // [-10, 60]
