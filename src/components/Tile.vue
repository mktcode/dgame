<script setup lang="ts">
import { computed } from "vue";
import { playAudio } from "@/lib/audio";
import { GameMapState } from "@/state/GameMap";

const props = defineProps<{
  index: number;
}>();

const { zoomed } = GameMapState();

const x = computed(() => Math.floor(props.index / 10));
const y = computed(() => props.index % 10);

function clickTile() {
  playAudio("button");
}
</script>

<template>
  <div class="relative flex aspect-square w-full" @click="clickTile">
    <div
      class="absolute inset-0 cursor-pointer items-center justify-center overflow-hidden bg-sky-900 text-sm transition-all bg-opacity-10 hover:bg-opacity-20"
      :class="{
        'rounded-lg': zoomed,
        'rounded': !zoomed,
      }"
    >
      <Transition>
        <img
          v-if="x === 3 && y === 3"
          src="/artwork/base.jpeg"
          alt="Tile"
        />
      </Transition>
    </div>
  </div>
</template>
