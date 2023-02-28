<script setup lang="ts">
import WelcomeModal from "./components/WelcomeModal.vue";
import GameMap from "./components/GameMap.vue";
import GameMenu from "./components/GameMenu.vue";
import { GameMapState } from "./state/GameMap";

const { backgroundStyles } = GameMapState();
</script>

<template>
  <div>
    <div class="flex justify-center h-screen space-x-3 p-3 bg-slate-900 bg-blend-multiply" :style="backgroundStyles">
      <GameMap />
      <GameMenu />
    </div>
    <WelcomeModal />
  </div>
</template>
