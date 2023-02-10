<script setup lang="ts">
import { onMounted } from 'vue';
import { GameMapState } from '../state/GameMap';

const { gameMap } = GameMapState();

onMounted(() => {
  console.log(gameMap.value?.offsetWidth);
});
</script>

<template>
  <div class="grow bg-green-800" ref="gameMap">
    fight!
  </div>
</template>