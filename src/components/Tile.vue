<script setup lang="ts">
import { ref } from 'vue';
import { indexer } from '../state/Gun';
import { GameMapState, type TileInfo } from '../state/GameMap';

const props = defineProps<{
  x: bigint;
  y: bigint;
  z: bigint;
}>();

const { selectedTile } = GameMapState();

const tileInfo = ref<TileInfo | null>(null);

indexer.get(props.x.toString()).get(props.y.toString()).get(props.z.toString()).once((data) => {
  tileInfo.value = data;
});
</script>

<template>
  <div
    class="flex aspect-square w-24 min-w-[3.5rem] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-sky-900 text-sm"
    :class="{ 'opacity-10 hover:opacity-20': !tileInfo, }"
    @click="selectedTile = { x, y, z }"
  >
    <img
      v-if="tileInfo"
      :src="tileInfo.image"
      alt="Tile"
    />
  </div>
</template>