<script setup lang="ts">
import { GameMapState } from "../state/GameMap";

const {
  gameMap,
  tilesInfo,
  position,
  selectedTile,
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
      backgroundSize: position.z * 2 + 300 + '%',
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
      <div
        v-for="x in 20"
        :key="x"
        class="flex aspect-square w-24 min-w-[3.5rem] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-sky-900 text-sm"
        :class="{
          'opacity-10 hover:opacity-20':
            !tilesInfo[position.z]?.[y + position.y]?.[x + position.x],
        }"
        @click="
          selectedTile = { x: x + position.x, y: y + position.y, z: position.z }
        "
      >
        <img
          v-if="tilesInfo[position.z]?.[y + position.y]?.[x + position.x]"
          :src="tilesInfo[position.z]?.[y + position.y]?.[x + position.x].image"
          alt="Tile"
        />
      </div>
    </div>
  </div>
</template>
