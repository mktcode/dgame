<script setup lang="ts">
import { ref, watch } from 'vue';
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
import { GameMapState } from '@/state/GameMap';
import { drawMandelbrotSet, move, zoomToTarget } from '@/lib/mandelbrot';

const { position } = GameMapState();

const canvas = ref<HTMLCanvasElement | null>(null);

watch(position, () => {
  if (canvas.value) {
    drawMandelbrotSet(canvas.value);
  }
}, { immediate: true, deep: true });

watch(canvas, () => {
  if (canvas.value) {
    canvas.value.width = 50;
    canvas.value.height = 50;
    drawMandelbrotSet(canvas.value);
  }
}, { immediate: true });

const targets = [
  [ 62.51, 0, 100000.9 ],
  [ 0, 0, 0.1 ],
  [ -179.67670033502017, -70, 10.671895716335978 ],
  [ -177.42780279723215, -70, 399.17525258063944 ],
  [ -177.42780279723215, -70, 99995399.17525258063944 ],
  [ -179.48929220687117, -56.41334259080523, 1.1],
  [ -140.15330133850924, 139.30886107163212, 169.2892739326841],
  [ 0, 0, 0.01 ]
]
let currentTarget = 0;
const isMoving = ref(false);
async function moveTo() {
  isMoving.value = true;
  const [ x, y, z ] = targets[currentTarget];
  await zoomToTarget(x, y ,z, canvas.value);
  isMoving.value = false;
  currentTarget++;
  if (currentTarget >= targets.length) {
    currentTarget = 0;
  }
}
</script>

<template>
  <div class="mb-3 p-2 bg-sky-900 rounded-xl">
    <canvas
      ref="canvas"
      class="w-full aspect-square rounded-t-xl"
      style="image-rendering: optimizeSpeed;"
    />
    <div class="grid grid-cols-3 gap-1 rounded-b-xl bg-sky-800">
      <button @click="move(Direction.Backward, canvas)">
        <svg-icon type="mdi" :path="mdiMagnifyMinus" class="inline" />
      </button>
      <button @click="move(Direction.Up, canvas)">
        <svg-icon type="mdi" :path="mdiChevronUp" class="inline" />
      </button>
      <button @click="move(Direction.Forward, canvas)">
        <svg-icon type="mdi" :path="mdiMagnifyPlus" class="inline" />
      </button>
      <button @click="move(Direction.Left, canvas)">
        <svg-icon type="mdi" :path="mdiChevronLeft" class="inline" />
      </button>
      <button @click="move(Direction.Down, canvas)">
        <svg-icon type="mdi" :path="mdiChevronDown" class="inline" />
      </button>
      <button @click="move(Direction.Right, canvas)">
        <svg-icon type="mdi" :path="mdiChevronRight" class="inline" />
      </button>
      <button @click="moveTo()" class="col-span-3" :disabled="isMoving">
        next
      </button>
    </div>
  </div>
</template>