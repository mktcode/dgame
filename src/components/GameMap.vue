<script setup lang="ts">
import Tile from "@/components/Tile.vue";
import { GameMapState } from "@/state/GameMap";

const { gameMap, backgroundStyles } = GameMapState();
</script>

<template>
  <div
    ref="gameMap"
    class="aspect-square rounded-xl border-4 border-sky-900 border-opacity-10 transition-all hover:border-opacity-30 focus:border-opacity-100 bg-slate-900 bg-cover p-1 bg-blend-multiply grid grid-cols-10 gap-1"
    tabindex="1"
    :style="backgroundStyles"
  >
    <Tile
      v-for="i in 10 * 10"
      :key="`tile-${i}`"
      :index="i"
    />
  </div>
</template>
