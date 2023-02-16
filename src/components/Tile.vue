<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { indexer } from "../state/Indexer";
import { GameMapState, type TileInfo } from "../state/GameMap";
import { playAudio } from "@/lib/audio";

const props = defineProps<{
  x: bigint;
  y: bigint;
  z: bigint;
}>();

const { selectedTile } = GameMapState();

const tileInfo = ref<TileInfo | null>(null);
const isSelected = computed(() => {
  if (!selectedTile.value) {
    return false;
  }
  return (
    selectedTile.value.x === props.x &&
    selectedTile.value.y === props.y &&
    selectedTile.value.z === props.z
  );
})

onMounted(() => {
  indexer.storage
    .get("coords")
    .get(props.x.toString())
    .get(props.y.toString())
    .get(props.z.toString())
    .on((tokenId) => {
      if (typeof tokenId !== "string") {
        tileInfo.value = null;
        return;
      }
      indexer.storage
        .get("tokens")
        .get(tokenId.toString())
        .once((data) => {
          tileInfo.value = data;
        });
    });
});

onUnmounted(() => {
  indexer.storage
    .get("coords")
    .get(props.x.toString())
    .get(props.y.toString())
    .get(props.z.toString())
    .off();
});

function clickTile() {
  playAudio("button");
  
  selectedTile.value = { x: props.x, y: props.y, z: props.z };
}
</script>

<template>
  <div
    class="relative flex aspect-square w-40 min-w-[6rem] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-sky-900 bg-sky-900 text-sm transition-all"
    :class="{
      'bg-opacity-10 hover:bg-opacity-20': !tileInfo,
      'border-4': isSelected
    }"
    @click="clickTile"
  >
    <Transition>
      <img v-if="tileInfo && tileInfo.image" :src="tileInfo.image" alt="Tile" />
    </Transition>
  </div>
</template>
