<script setup lang="ts">
import WelcomeModal from "./components/WelcomeModal.vue";
import GameMap from "./components/GameMap.vue";
import GameMenu from "./components/GameMenu.vue";
</script>

<template>
  <div class="flex h-screen p-3 space-x-3">
    <GameMap />
    <GameMenu />
  </div>
  <WelcomeModal />
</template>
