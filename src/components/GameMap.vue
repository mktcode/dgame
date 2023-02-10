<script setup lang="ts">
import { GameMapState } from "../state/GameMap";

const { position, moveLeft, moveRight, moveUp, moveDown } = GameMapState();
</script>

<template>
  <div
    class="grow overflow-hidden bg-green-800 space-y-1"
    tabindex="1"
    @keyup.left="moveLeft"
    @keyup.right="moveRight"
    @keyup.up="moveUp"
    @keyup.down="moveDown"
  >
    <div v-for="y in 20" :key="y" class="flex space-x-1">
      <div
        v-for="x in 20"
        :key="x"
        class="flex aspect-square w-24 items-center justify-center rounded-lg bg-green-900 text-sm"
      >
        {{ x + position.x }}, {{ y + position.y }}
      </div>
    </div>
  </div>
</template>
