<script setup lang="ts">
import WelcomeModal from "./components/WelcomeModal.vue";
import GameMap from "./components/GameMap.vue";
import GameMenu from "./components/GameMenu.vue";
</script>

<template>
  <div>
    <div class="flex justify-center h-screen space-x-3 p-3">
      <GameMap />
      <GameMenu />
    </div>
    <WelcomeModal />
  </div>
</template>
