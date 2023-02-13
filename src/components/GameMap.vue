<script setup lang="ts">
import { computed } from "vue";
import Tile from "./Tile.vue";
import { Direction, GameMapState } from "../state/GameMap";

const { gameMap, position, move } = GameMapState();

const visibleTilesX = computed(() => {
  const tiles = [];

  for (let i = position.value.x; i < position.value.x + 10n; i++) {
    tiles.push(i);
  }

  return tiles;
});

const visibleTilesY = computed(() => {
  const tiles = [];

  for (let i = position.value.y; i < position.value.y + 10n; i++) {
    tiles.push(i);
  }

  return tiles;
});
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
    @keyup.left="move(Direction.Left)"
    @keyup.right="move(Direction.Right)"
    @keyup.up.exact="move(Direction.Up)"
    @keyup.down.exact="move(Direction.Down)"
    @keyup.shift.down="move(Direction.Backward)"
    @keyup.shift.up="move(Direction.Forward)"
  >
    <div
      v-for="y in visibleTilesY"
      :key="`y-${y.toString()}`"
      class="flex space-x-1"
    >
      <Tile
        v-for="x in visibleTilesX"
        :key="`${x}-${y}-${position.z.toString()}`"
        :x="x"
        :y="y"
        :z="position.z"
      />
    </div>
  </div>
</template>
