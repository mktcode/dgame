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
</script>

<template>
  <div class="mb-3 rounded-xl bg-sky-900">
    <canvas
      ref="canvas"
      class="aspect-square w-full rounded-t-xl"
      style="image-rendering: optimizeSpeed"
    />
    <div class="grid grid-cols-3 rounded-b-xl bg-sky-900">
      <button @click="move(Direction.Backward)" class="rounded-t-none rounded-l-none">
        <svg-icon type="mdi" :path="mdiMagnifyMinus" class="inline" />
      </button>
      <button @click="move(Direction.Up)" class="rounded-t-none">
        <svg-icon type="mdi" :path="mdiChevronUp" class="inline" />
      </button>
      <button @click="move(Direction.Forward)" class="rounded-t-none rounded-r-none">
        <svg-icon type="mdi" :path="mdiMagnifyPlus" class="inline" />
      </button>
      <button @click="move(Direction.Left)" class="rounded-tl-none rounded-br-none">
        <svg-icon type="mdi" :path="mdiChevronLeft" class="inline" />
      </button>
      <button @click="move(Direction.Down)" class="rounded-b-none">
        <svg-icon type="mdi" :path="mdiChevronDown" class="inline" />
      </button>
      <button @click="move(Direction.Right)" class="rounded-tr-none rounded-bl-none">
        <svg-icon type="mdi" :path="mdiChevronRight" class="inline" />
      </button>
    </div>
  </div>
</template>
