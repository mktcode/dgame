<script setup lang="ts">
import BuildMenu from "./components/BuildMenu.vue";
import ResourcesInfo from "./components/ResourcesInfo.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import GameMap from "./components/GameMap.vue";
import TileInfo from "./components/TileInfo.vue";
import { GameMapState } from "./state/GameMap";

const { selectedTile, position, tilesLoading } = GameMapState();
</script>

<template>
  <div class="flex h-screen">
    <GameMap />
    <div class="flex w-60 flex-none flex-col">
      x: {{ position.x.toString() }} y: {{ position.y.toString() }} z: {{ position.z.toString() }}, loading: {{ tilesLoading }}
      <ResourcesInfo />
      <TileInfo v-if="selectedTile" />
      <BuildMenu v-else />
    </div>
  </div>
  <WelcomeModal />
</template>
