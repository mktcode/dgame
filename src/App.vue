<script setup lang="ts">
import MiniMap from "./components/MiniMap.vue";
import BuildMenu from "./components/BuildMenu.vue";
import ResourcesInfo from "./components/ResourcesInfo.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import GameMap from "./components/GameMap.vue";
import TileInfo from "./components/TileInfo.vue";
</script>

<template>
  <div class="flex h-screen">
    <GameMap />
    <div class="flex w-60 flex-none flex-col">
      <MiniMap />
      <ResourcesInfo />
      <TileInfo />
      <BuildMenu />
    </div>
  </div>
  <WelcomeModal />
</template>
