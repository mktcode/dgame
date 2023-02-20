import { Direction } from "@/lib/game";
import { isInMandelbrotSet, getRainbowColor, approachValue } from "@/lib/mandelbrot";
import { ref } from "vue";

const XMIN = -.1;
const XMAX = .1;
const YMIN = -.1;
const YMAX = .1;

const ZOOM_FACTOR = 1.1;
const INITIAL_ZOOM = 71.79517789085845;
const INITIAL_OFFSET_X = -280.3066026770185;
const INITIAL_OFFSET_Y = 278.61772214326425;
const MOVEMENT_FACTOR = 1;

export function MandelbrotState() {
  const canvas = ref<HTMLCanvasElement | null>(null);

  const currentZoom = ref(INITIAL_ZOOM);
  const currentOffsetX = ref(INITIAL_OFFSET_X);
  const currentOffsetY = ref(INITIAL_OFFSET_Y);

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
    const centerX = (XMAX + XMIN) / 2 + currentOffsetX.value / canvasWidth * xRange;
    const centerY = (YMAX + YMIN) / 2 + currentOffsetY.value / canvasHeight * yRange;
    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        const x = ((centerX * currentZoom.value) + (i / canvasWidth - 0.5) * xRange);
        const y = ((centerY * currentZoom.value) + (j / canvasHeight - 0.5) * yRange);
        const iterCount = isInMandelbrotSet(x, y);
        ctx.fillStyle = getRainbowColor(iterCount);
        ctx.fillRect(i, j, 1, 1);
      }
    }
  }

  async function zoomToTarget(xOffsetTarget: number, yOffsetTarget: number, zoomTarget: number, canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    const STEPS = 25;
    const DURATION = 250;
    const xGenerator = approachValue(currentOffsetX.value, xOffsetTarget, STEPS, DURATION);
    const yGenerator = approachValue(currentOffsetY.value, yOffsetTarget, STEPS, DURATION);

    if (currentZoom.value < zoomTarget) {
      setTimeout(async () => {
        for await (const newXOffset of xGenerator) {
          currentOffsetX.value = newXOffset;
          drawMandelbrotSet();
        }
      }, 0);
    
      for await (const newYOffset of yGenerator) {
        currentOffsetY.value = newYOffset;
        drawMandelbrotSet();
      }
    
      if (currentZoom.value < zoomTarget) {
        while (currentZoom.value < zoomTarget) {
          currentZoom.value *= ZOOM_FACTOR;
          drawMandelbrotSet();
          await new Promise((resolve) => setTimeout(resolve, DURATION / STEPS));
        }
      } else {
        while (currentZoom.value > zoomTarget) {
          currentZoom.value /= ZOOM_FACTOR;
          drawMandelbrotSet();
          await new Promise((resolve) => setTimeout(resolve, DURATION / STEPS));
        }
      }
    } else {
      if (currentZoom.value < zoomTarget) {
        while (currentZoom.value < zoomTarget) {
          currentZoom.value *= ZOOM_FACTOR;
          drawMandelbrotSet();
          await new Promise((resolve) => setTimeout(resolve, DURATION / STEPS));
        }
      } else {
        while (currentZoom.value > zoomTarget) {
          currentZoom.value /= ZOOM_FACTOR;
          drawMandelbrotSet();
          await new Promise((resolve) => setTimeout(resolve, DURATION / STEPS));
        }
      }

      setTimeout(async () => {
        for await (const newXOffset of xGenerator) {
          currentOffsetX.value = newXOffset;
          drawMandelbrotSet();
        }
      }, 0);
    
      for await (const newYOffset of yGenerator) {
        currentOffsetY.value = newYOffset;
        drawMandelbrotSet();
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
    zoomToTarget,
  };
}
