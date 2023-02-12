<script setup lang="ts">
import ResourcesInfo from "./components/ResourcesInfo.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import GameMap from "./components/GameMap.vue";
import TileInfo from "./components/TileInfo.vue";
import { GameMapState } from "./state/GameMap";

const { selectedTile, position } = GameMapState();
</script>

<template>
  <div class="flex h-screen">
    <GameMap />
    <div class="flex w-60 flex-none flex-col">
      <div class="text-center text-sky-700 py-1">
        x: {{ position.x.toString() }} y: {{ position.y.toString() }} z: {{ position.z.toString() }}
      </div>
      <ResourcesInfo />
      <TileInfo />
    </div>
  </div>
  <WelcomeModal />
</template>
