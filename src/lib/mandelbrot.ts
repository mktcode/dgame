import { Direction } from "./game";

const XMIN = -.1;
const XMAX = .1;
const YMIN = -.1;
const YMAX = .1;
const MAX_ITERATIONS = 500;
const MOVEMENT_FACTOR = 1;
const ZOOM_FACTOR = 1.1;
const INITIAL_ZOOM = 0.1;

let xOffsetCurrent = 0;
let yOffsetCurrent = 0;
let zoomCurrent = INITIAL_ZOOM;

export function isInMandelbrotSet(x0: number, y0: number) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const xtemp = x * x - y * y + x0;
    const ytemp = 2 * x * y + y0;
    x = xtemp;
    y = ytemp;
    if (x * x + y * y > 4) {
      return i;
    }
  }
  return -1;
}

export function getRainbowColor(iterCount: number) {
  if (iterCount === -1) {
    return "#000";
  } else {
    const hue = iterCount / MAX_ITERATIONS * 360;
    return `hsl(${hue}, 100%, 50%)`;
  }
}

export function drawMandelbrotSet(canvas: HTMLCanvasElement) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // console.log("Drawing Mandelbrot Set", xOffsetCurrent, yOffsetCurrent, zoomCurrent)
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const xRange = (XMAX - XMIN) / zoomCurrent;
  const yRange = (YMAX - YMIN) / zoomCurrent;
  const centerX = (XMAX + XMIN) / 2 + xOffsetCurrent / canvasWidth * xRange;
  const centerY = (YMAX + YMIN) / 2 + yOffsetCurrent / canvasHeight * yRange;
  for (let i = 0; i < canvasWidth; i++) {
    for (let j = 0; j < canvasHeight; j++) {
      const x = ((centerX * zoomCurrent) + (i / canvasWidth - 0.5) * xRange);
      const y = ((centerY * zoomCurrent) + (j / canvasHeight - 0.5) * yRange);
      const iterCount = isInMandelbrotSet(x, y);
      ctx.fillStyle = getRainbowColor(iterCount);
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

export function move(direction: Direction, canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  switch (direction) {
    case Direction.Up:
      yOffsetCurrent -= MOVEMENT_FACTOR / zoomCurrent;
      break;
    case Direction.Down:
      yOffsetCurrent += MOVEMENT_FACTOR / zoomCurrent;
      break;
    case Direction.Left:
      xOffsetCurrent -= MOVEMENT_FACTOR / zoomCurrent;
      break;
    case Direction.Right:
      xOffsetCurrent += MOVEMENT_FACTOR / zoomCurrent;
      break;
    case Direction.Forward:
      zoomCurrent *= ZOOM_FACTOR;
      break;
    case Direction.Backward:
      zoomCurrent /= ZOOM_FACTOR;
      break;
  }

  drawMandelbrotSet(canvas);
}

async function* approachValue(
  start: number,
  target: number,
  steps: number,
  duration: number,
  easing: ((t: number) => number) = t => t
): AsyncGenerator<number> {
  const stepDuration = duration / steps;
  let currentValue = start;

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const normalizedT = easing(t);
    const stepValue = (target - start) * normalizedT + start - currentValue;

    await new Promise((resolve) => setTimeout(resolve, stepDuration));
    currentValue += stepValue;
    yield currentValue;
  }

  yield target;
}


export async function zoomToTarget(xOffsetTarget: number, yOffsetTarget: number, zoomTarget: number, canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const STEPS = 25;
  const DURATION = 250;
  const xGenerator = approachValue(xOffsetCurrent, xOffsetTarget, STEPS, DURATION);
  const yGenerator = approachValue(yOffsetCurrent, yOffsetTarget, STEPS, DURATION);

  if (zoomCurrent < zoomTarget) {
    setTimeout(async () => {
      for await (const newXOffset of xGenerator) {
        xOffsetCurrent = newXOffset;
        drawMandelbrotSet(canvas);
      }
    }, 0);
  
    for await (const newYOffset of yGenerator) {
      yOffsetCurrent = newYOffset;
      drawMandelbrotSet(canvas);
    }
  
    if (zoomCurrent < zoomTarget) {
      while (zoomCurrent < zoomTarget) {
        zoomCurrent *= ZOOM_FACTOR;
        drawMandelbrotSet(canvas);
        await new Promise((resolve) => setTimeout(resolve, DURATION / STEPS));
      }
    } else {
      while (zoomCurrent > zoomTarget) {
        zoomCurrent /= ZOOM_FACTOR;
        drawMandelbrotSet(canvas);
        await new Promise((resolve) => setTimeout(resolve, DURATION / STEPS));
      }
    }
  } else {
    if (zoomCurrent < zoomTarget) {
      while (zoomCurrent < zoomTarget) {
        zoomCurrent *= ZOOM_FACTOR;
        drawMandelbrotSet(canvas);
        await new Promise((resolve) => setTimeout(resolve, DURATION / STEPS));
      }
    } else {
      while (zoomCurrent > zoomTarget) {
        zoomCurrent /= ZOOM_FACTOR;
        drawMandelbrotSet(canvas);
        await new Promise((resolve) => setTimeout(resolve, DURATION / STEPS));
      }
    }

    setTimeout(async () => {
      for await (const newXOffset of xGenerator) {
        xOffsetCurrent = newXOffset;
        drawMandelbrotSet(canvas);
      }
    }, 0);
  
    for await (const newYOffset of yGenerator) {
      yOffsetCurrent = newYOffset;
      drawMandelbrotSet(canvas);
    }
  }
}