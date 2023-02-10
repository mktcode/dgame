<script setup lang="ts">
import { GameMapState } from "../state/GameMap";

const { selectedTile, selectedTileInfo } = GameMapState();
</script>

<template>
  <div class="grow overflow-y-auto bg-sky-900">
    <div class="flex justify-between items-center">
      <div v-if="selectedTile" class="text-lg p-1 text-slate-300 font-bold">
        {{ selectedTile.x }}/{{ selectedTile.y }}/{{ selectedTile.z }}
      </div>
      <button @click="selectedTile = null">x</button>
    </div>
    <div v-if="selectedTileInfo">
      <div class="border-8 border-gray-700">
        <img :src="selectedTileInfo.image" :alt="selectedTileInfo.name" class="rounded" />
      </div>
      <div class="text-lg font-bold px-3 pt-1 text-slate-400">{{ selectedTileInfo.name }}</div>
      <p class="text-slate-500 px-3">{{ selectedTileInfo.description }}</p>
    </div>
  </div>
</template>
