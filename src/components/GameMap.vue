<script setup lang="ts">
import { computed, ref } from "vue";
import Tile from "@/components/Tile.vue";
import { GameMapState } from "@/state/GameMap";
import { Direction } from "@/lib/game";

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

const backgroundStyles = ref({
  backgroundImage: `url(artwork/spaces/space1.jpeg)`,
  backgroundPositionX: position.value.x % (position.value.x + 1n) + "%",
  backgroundPositionY: position.value.y % (position.value.y + 1n) + "%",
  backgroundSize: "100%",
});
</script>

<template>
  <div
    ref="gameMap"
    class="grow relative overflow-hidden border-4 border-sky-900 border-opacity-10 transition-all hover:border-opacity-30 focus:border-opacity-100 rounded-3xl"
    tabindex="1"
    @keyup.left="move(Direction.Left)"
    @keyup.right="move(Direction.Right)"
    @keyup.up.exact="move(Direction.Up)"
    @keyup.down.exact="move(Direction.Down)"
    @keyup.shift.down="move(Direction.Backward)"
    @keyup.shift.up="move(Direction.Forward)"
  >
    <div
      class="absolute overflow-hidden bg-contain bg-blend-multiply bg-slate-900 space-y-2 p-2"
      :style="backgroundStyles"
    >
      <div
        v-for="y in visibleTilesY"
        :key="`y-${y.toString()}`"
        class="flex space-x-2"
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
  </div>
</template>
