<script setup lang="ts">
import { ref, watch } from "vue";
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
import { GameMapState } from "@/state/GameMap";
import { MandelbrotState } from "@/state/MandelbrotState";

const { position } = GameMapState();
const {
  canvas,
  drawMandelbrotSet,
  move,
  zoomToTarget,
  currentZoom,
  currentOffsetX,
  currentOffsetY,
} = MandelbrotState();

watch(
  position,
  () => {
    if (canvas.value) {
      drawMandelbrotSet();
    }
  },
  { immediate: true, deep: true }
);

watch(
  canvas,
  () => {
    if (canvas.value) {
      canvas.value.width = 150;
      canvas.value.height = 150;
      drawMandelbrotSet();
    }
  },
  { immediate: true }
);

const targets = [
  [62.51 * 2, 0, 100000.9 * 2],
  [0, 0, 0.1],
  [-179.67670033502017 * 2, -70 * 2, 10.671895716335978 * 2],
  [-177.42780279723215 * 2, -70 * 2, 399.17525258063944 * 2],
  [-177.42780279723215 * 2, -70 * 2, 5399.17525258063944 * 2],
  [-179.48929220687117 * 2, -56.41334259080523 * 2, 1.1 * 2],
  [-140.15330133850924 * 2, 139.30886107163212 * 2, 35.2892739326841 * 2],
  [0, 0, 0.01],
  [-473.9943674308014, -348.81955981115823, 859497144.1069316],
];
let currentTarget = 0;
const isPlaying = ref(false);
const isMoving = ref(false);

async function moveNext() {
  isMoving.value = true;
  const [x, y, z] = targets[currentTarget];
  await zoomToTarget(x, y, z, canvas.value);
  isMoving.value = false;
  currentTarget++;
  if (currentTarget >= targets.length) {
    currentTarget = 0;
  }
  if (isPlaying.value) {
    moveNext();
  }
}

async function movePrev() {
  isMoving.value = true;

  currentTarget -= 1;
  if (currentTarget < 0) {
    currentTarget = targets.length - 1;
  }

  const [x, y, z] = targets[currentTarget];
  await zoomToTarget(x, y, z, canvas.value);
  isMoving.value = false;
}
</script>

<template>
  <div class="mb-3 rounded-xl bg-sky-900 p-2">
    <canvas
      ref="canvas"
      class="aspect-square w-full rounded-t-xl"
      style="image-rendering: optimizeSpeed"
    />
    <div class="grid grid-cols-3 gap-1 rounded-b-xl bg-sky-800">
      <button :disabled="isMoving" @click="move(Direction.Backward)">
        <svg-icon type="mdi" :path="mdiMagnifyMinus" class="inline" />
      </button>
      <button :disabled="isMoving" @click="move(Direction.Up)">
        <svg-icon type="mdi" :path="mdiChevronUp" class="inline" />
      </button>
      <button :disabled="isMoving" @click="move(Direction.Forward)">
        <svg-icon type="mdi" :path="mdiMagnifyPlus" class="inline" />
      </button>
      <button :disabled="isMoving" @click="move(Direction.Left)">
        <svg-icon type="mdi" :path="mdiChevronLeft" class="inline" />
      </button>
      <button :disabled="isMoving" @click="move(Direction.Down)">
        <svg-icon type="mdi" :path="mdiChevronDown" class="inline" />
      </button>
      <button :disabled="isMoving" @click="move(Direction.Right)">
        <svg-icon type="mdi" :path="mdiChevronRight" class="inline" />
      </button>
      <button @click="movePrev()" class="col-span-1" :disabled="isMoving">
        prev
      </button>
      <button @click="moveNext()" class="col-span-1" :disabled="isMoving">
        next
      </button>
      <button @click="isPlaying = !isPlaying" class="col-span-1">
        {{ isPlaying ? "stop" : "play" }}
      </button>
    </div>
    x: {{ currentOffsetX }}<br />
    y: {{ currentOffsetY }}<br />
    z: {{ currentZoom }}
  </div>
</template>
