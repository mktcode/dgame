<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronUp,
  mdiChevronDown,
  mdiMagnifyPlus,
  mdiMagnifyMinus,
} from "@mdi/js";
import { Direction } from "@/lib/game";

const canvas = ref<HTMLCanvasElement | null>(null);

const MOVEMENT_FACTOR = 1;
const ZOOM_FACTOR = 1.1;

const xmin = -.1;
const xmax = .1;
const ymin = -.1;
const ymax = .1;
const maxIterations = 50;

let zoom = 0.1;
let xOffset = 0;
let yOffset = 0;

function isInMandelbrotSet(x0: number, y0: number) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < maxIterations; i++) {
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

function getRainbowColor(iterCount: number) {
  if (iterCount === -1) {
    return "#000";
  } else {
    const hue = -175 + iterCount / maxIterations * 180;
    return `hsl(${hue}, 100%, 50%)`;
  }
}

function drawMandelbrotSet() {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  canvas.value.width = 75;
  canvas.value.height = 75;
  
  const canvasWidth = canvas.value.width;
  const canvasHeight = canvas.value.height;
  const xRange = (xmax - xmin) / zoom;
  const yRange = (ymax - ymin) / zoom;
  const centerX = (xmax + xmin) / 2 + xOffset / canvasWidth * xRange;
  const centerY = (ymax + ymin) / 2 + yOffset / canvasHeight * yRange;
  for (let i = 0; i < canvasWidth; i++) {
    for (let j = 0; j < canvasHeight; j++) {
      const x = ((centerX * zoom) + (i / canvasWidth - 0.5) * xRange);
      const y = ((centerY * zoom) + (j / canvasHeight - 0.5) * yRange);
      const iterCount = isInMandelbrotSet(x, y);
      ctx.fillStyle = getRainbowColor(iterCount);
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

function move(direction: Direction) {
  switch (direction) {
    case Direction.Left:
      moveLeft();
      break;
    case Direction.Right:
      moveRight();
      break;
    case Direction.Up:
      moveUp();
      break;
    case Direction.Down:
      moveDown();
      break;
    case Direction.Forward:
      zoomIn();
      break;
    case Direction.Backward:
      zoomOut();
      break;
  }
  drawMandelbrotSet();
}

function moveLeft() {
  xOffset -= MOVEMENT_FACTOR / zoom * 5
}

function moveRight() {
  xOffset += MOVEMENT_FACTOR / zoom * 5
}

function moveUp() {
  yOffset -= MOVEMENT_FACTOR / zoom * 5
}

function moveDown() {
  yOffset += MOVEMENT_FACTOR / zoom * 5
}

function zoomIn() {
  zoom *= ZOOM_FACTOR;
}

function zoomOut() {
  zoom /= ZOOM_FACTOR;
}

onMounted(() => {
  drawMandelbrotSet();
});
</script>

<template>
  <div class="mt-3">
    <canvas
      ref="canvas"
      class="w-72 h-72 border-8 border-sky-900 rounded-xl"
      style="image-rendering: optimizeSpeed;"
    />
    <div class="grid grid-cols-3 gap-1 mt-2">
      <button @click="move(Direction.Backward)">
        <svg-icon type="mdi" :path="mdiMagnifyMinus" class="inline" />
      </button>
      <button @click="move(Direction.Up)">
        <svg-icon type="mdi" :path="mdiChevronUp" class="inline" />
      </button>
      <button @click="move(Direction.Forward)">
        <svg-icon type="mdi" :path="mdiMagnifyPlus" class="inline" />
      </button>
      <button @click="move(Direction.Left)">
        <svg-icon type="mdi" :path="mdiChevronLeft" class="inline" />
      </button>
      <button @click="move(Direction.Down)">
        <svg-icon type="mdi" :path="mdiChevronDown" class="inline" />
      </button>
      <button @click="move(Direction.Right)">
        <svg-icon type="mdi" :path="mdiChevronRight" class="inline" />
      </button>
    </div>
  </div>
</template>