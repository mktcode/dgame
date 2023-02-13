<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { indexer } from "../state/Gun";
import { GameMapState, type TileInfo } from "../state/GameMap";

const props = defineProps<{
  x: bigint;
  y: bigint;
  z: bigint;
}>();

const { selectedTile } = GameMapState();

const tileInfo = ref<TileInfo | null>(null);

onMounted(() => {
  indexer
    .get("coords")
    .get(props.x.toString())
    .get(props.y.toString())
    .get(props.z.toString())
    .on((tokenId) => {
      if (typeof tokenId !== "string") {
        tileInfo.value = null;
        return;
      }
      indexer
        .get("tokens")
        .get(tokenId.toString())
        .once((data) => {
          tileInfo.value = data;
        });
    });
});

onUnmounted(() => {
  indexer
    .get("coords")
    .get(props.x.toString())
    .get(props.y.toString())
    .get(props.z.toString())
    .off();
});
</script>

<template>
  <div
    class="relative flex aspect-square w-40 min-w-[6rem] cursor-pointer border-sky-900 items-center justify-center overflow-hidden rounded-lg bg-sky-900 text-sm transition-all"
    :class="{ 'bg-opacity-10 hover:bg-opacity-20': !tileInfo, 'border-2': selectedTile && selectedTile.x === x && selectedTile.y === y && selectedTile.z === z }"
    @click="selectedTile = { x, y, z }"
  >
    <Transition>
      <img v-if="tileInfo && tileInfo.image" :src="tileInfo.image" alt="Tile" />
    </Transition>
  </div>
</template>
