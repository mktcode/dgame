<script setup lang="ts">
import Tile from "./Tile.vue";
import { GameMapState } from "../state/GameMap";

const {
  gameMap,
  position,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  moveForward,
  moveBackward,
} = GameMapState();
</script>

<template>
  <div
    ref="gameMap"
    class="grow space-y-1 overflow-hidden border-8 border-transparent bg-slate-900 bg-contain bg-blend-multiply transition-all hover:border-sky-500 hover:border-opacity-10 focus:border-sky-900 focus:border-opacity-50"
    :style="{
      backgroundImage: 'url(artwork/spaces/space1.jpeg)',
      backgroundPositionX: position.x + '%',
      backgroundPositionY: position.y + '%',
      backgroundSize: position.z * 2n + 300n + '%',
    }"
    tabindex="1"
    @keyup.left="moveLeft"
    @keyup.right="moveRight"
    @keyup.up.exact="moveUp"
    @keyup.down.exact="moveDown"
    @keyup.shift.down="moveBackward"
    @keyup.shift.up="moveForward"
  >
    <div v-for="y in 20" :key="y" class="flex space-x-1">
      <Tile v-for="x in 20" :key="x + y + position.z.toString()" :x="BigInt(x)" :y="BigInt(y)" :z="position.z" />
    </div>
  </div>
</template>
