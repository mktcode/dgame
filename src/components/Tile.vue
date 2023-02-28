<script setup lang="ts">
import { computed } from "vue";
import { playAudio } from "@/lib/audio";

const props = defineProps<{
  index: number;
}>();

const x = computed(() => Math.floor(props.index / 12));
const y = computed(() => props.index % 12);

function clickTile() {
  playAudio("button");
}
</script>

<template>
  <div class="relative flex aspect-square w-full" @click="clickTile">
    <div
      class="absolute inset-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-4 border-sky-900 bg-sky-900 text-sm transition-all"
      :class="{
        'bg-opacity-10 hover:bg-opacity-20': true,
        'border-opacity-50': false,
        'border-opacity-0': true,
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
