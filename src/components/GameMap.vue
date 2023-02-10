<script setup lang="ts">
import { GameMapState } from "../state/GameMap";

const { tilesInfo, position, selectedTile, moveLeft, moveRight, moveUp, moveDown, moveForward, moveBackward } = GameMapState();
</script>

<template>
  <div
    class="grow overflow-hidden bg-slate-900 space-y-1 bg-contain bg-blend-multiply"
    :style="{
      backgroundImage: 'url(artwork/spaces/space1.jpeg)',
      backgroundPositionX: position.x + '%',
      backgroundPositionY: position.y + '%',
      backgroundSize: position.z + 300 + '%',
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
        class="flex aspect-square w-24 items-center justify-center rounded-lg bg-sky-900 text-sm cursor-pointer overflow-hidden"
        :class="{'opacity-20': !tilesInfo[position.z]?.[y + position.y]?.[x + position.x]}"
        @click="selectedTile = { x: x + position.x, y: y + position.y, z: position.z }"
      >
       <img v-if="tilesInfo[position.z]?.[y + position.y]?.[x + position.x]" :src="tilesInfo[position.z]?.[y + position.y]?.[x + position.x].image" alt="Tile" />
      </div>
    </div>
  </div>
</template>
