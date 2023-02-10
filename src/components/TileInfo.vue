<script setup lang="ts">
import { GameMapState } from "../state/GameMap";

const { selectedTile, selectedTileInfo } = GameMapState();
</script>

<template>
  <div class="grow overflow-y-auto bg-sky-900">
    <div class="flex items-center justify-between">
      <div v-if="selectedTile" class="p-1 text-lg font-bold text-slate-300">
        {{ selectedTile.x }}/{{ selectedTile.y }}/{{ selectedTile.z }}
      </div>
      <button @click="selectedTile = null">x</button>
    </div>
    <div v-if="selectedTileInfo">
      <img
        :src="selectedTileInfo.image"
        :alt="selectedTileInfo.name"
        class="rounded"
      />
      <div class="px-3 pt-1 text-lg font-bold text-slate-400">
        {{ selectedTileInfo.name }}
      </div>
      <p class="px-3 text-slate-500">{{ selectedTileInfo.description }}</p>
    </div>
    <div v-else>
      <div
        class="flex aspect-square w-full items-center justify-center bg-slate-900 text-center text-3xl font-bold text-white text-opacity-30"
      >
        ?
      </div>
      <button class="w-full">Explore</button>
    </div>
  </div>
</template>
