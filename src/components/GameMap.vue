<script setup lang="ts">
import Tile from "@/components/Tile.vue";
import { computed } from "vue";
import { GameMapState } from "@/state/GameMap";

const { gameMap, zoomed } = GameMapState();

const numberOfTiles = computed(() => (zoomed.value ? 10 * 10 : 25 * 25));
</script>

<template>
  <div
    ref="gameMap"
    class="aspect-square rounded-xl border-4 border-sky-900 border-opacity-10 transition-all hover:border-opacity-30 focus:border-opacity-100 bg-slate-900 bg-opacity-50 p-1 bg-blend-multiply grid"
    :class="{
      'grid-cols-10 gap-1': zoomed,
      'grid-cols-25 gap-0.5': !zoomed,
    }"
    tabindex="1"
  >
    <Tile
      v-for="i in numberOfTiles"
      :key="`tile-${i}`"
      :index="i"
    />
  </div>
</template>
