# infinite-canvas

an infinite html5 canvas

[![Build Status](https://travis-ci.org/willhoag/infinite-canvas.svg)](https://travis-ci.org/willhoag/infinite-canvas)
[![npm version](https://badge.fury.io/js/infinite-canvas.svg)](http://badge.fury.io/js/infinite-canvas)

## Description
Provides an interface to pan an html5 canvas vertically and horizontally infinitely. This works by creating a infinitely growing buffer canvas that adjusts it's size and position when moving the origin relatively with `.move([x, y])` or absolutely with `.setOrigin([x, y])`. Essentially, the wrapped canvas becomes a window that you move around the buffer canvas. When moved beyond the dimensions of the buffer canvas, the buffer is resized and the image data is repositioned to compensate.

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install infinite-canvas --save
```

## Usage

```js
// require module
import InfiniteCanvas from 'infinite-canvas'

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

```

## API

### Make an instance

`new InfiniteCanvas(canvas:canvas):instance` provided a canvas, returns a new InfiniteCanvas object

### Methods

`.setOrigin(pos:array):undefined` provide an array with the absolute [x, y] position for the origin of the wrapped canvas on the buffer canvas

`.move(posDiff:array):undefined` provide an array with the relative [x, y] position for the origin of the wrapped canvas on the buffer canvas

`.commitToBuffer():undefined` draw new image data from the wrapped canvas to the buffer canvas. This is essentially saving it. Otherwise, it'll be lost when panning. Use when drawing to the wrapped canvas.

`.refresh():undefined` draws image data from the buffer canvas to the wrapped canvas. Use when drawing directly to the buffer canvas.

`.getOrigin():array` returns the current absolute origin [x, y] of the wrapped canvas on the buffer canvas

### Properties

`.canvas:canvas` access to the wrapped canvas

`.canvasContext:canvas` access to the wrapped canvas's 2d context

`.buffer:canvas` access to the buffer canvas

`.bufferContext:canvas` access to the buffer canvas's 2d context

## Notes
I can see it being useful to draw beyond the borders of the canvas or buffer canvas (draw off screen). So, I'm currently considering adding a padding option for the buffer canvas or providing a draw method that will update the buffer accordingly. Also, zooming ability would be nice as well.

## License

ISC
