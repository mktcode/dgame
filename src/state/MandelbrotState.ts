import { Direction } from "@/lib/game";
import {
  isInMandelbrotSet,
  getRainbowColor,
} from "@/lib/mandelbrot";
import { ref } from "vue";

const XMIN = -0.1;
const XMAX = 0.1;
const YMIN = -0.1;
const YMAX = 0.1;

const ZOOM_FACTOR = 1.1;
export const INITIAL_ZOOM = 0.1;
const INITIAL_OFFSET_X = 0;
const INITIAL_OFFSET_Y = 0;
const MOVEMENT_FACTOR = 1;

const canvas = ref<HTMLCanvasElement | null>(null);

const currentZoom = ref(INITIAL_ZOOM);
const currentOffsetX = ref(INITIAL_OFFSET_X);
const currentOffsetY = ref(INITIAL_OFFSET_Y);

export function MandelbrotState() {

  function move(direction: Direction) {
    if (!canvas.value) return;

    switch (direction) {
      case Direction.Up:
        currentOffsetY.value -= MOVEMENT_FACTOR / currentZoom.value;
        break;
      case Direction.Down:
        currentOffsetY.value += MOVEMENT_FACTOR / currentZoom.value;
        break;
      case Direction.Left:
        currentOffsetX.value -= MOVEMENT_FACTOR / currentZoom.value;
        break;
      case Direction.Right:
        currentOffsetX.value += MOVEMENT_FACTOR / currentZoom.value;
        break;
      case Direction.Forward:
        currentZoom.value *= ZOOM_FACTOR;
        break;
      case Direction.Backward:
        currentZoom.value /= ZOOM_FACTOR;
        break;
    }
    // console.log("Moved", currentOffsetX.value, currentOffsetY.value, currentZoom.value)

    drawMandelbrotSet();
  }

  function drawMandelbrotSet() {
    if (!canvas.value) return;

    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;

    // console.log("Drawing Mandelbrot Set", currentOffsetX.value, currentOffsetY.value, currentZoom.value)

    const canvasWidth = canvas.value.width;
    const canvasHeight = canvas.value.height;
    const xRange = (XMAX - XMIN) / currentZoom.value;
    const yRange = (YMAX - YMIN) / currentZoom.value;
    const centerX =
      (XMAX + XMIN) / 2 + (currentOffsetX.value / canvasWidth) * xRange;
    const centerY =
      (YMAX + YMIN) / 2 + (currentOffsetY.value / canvasHeight) * yRange;
    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        const x =
          centerX * currentZoom.value + (i / canvasWidth - 0.5) * xRange;
        const y =
          centerY * currentZoom.value + (j / canvasHeight - 0.5) * yRange;
        const iterCount = isInMandelbrotSet(x, y);
        ctx.fillStyle = getRainbowColor(iterCount);
        ctx.fillRect(i, j, 1, 1);
      }
    }
  }

  return {
    canvas,
    currentZoom,
    currentOffsetX,
    currentOffsetY,
    move,
    drawMandelbrotSet,
  };
}
