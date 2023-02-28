<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { contractStorage } from "../state/Indexer";
import { GameMapState } from "../state/GameMap";
import { playAudio } from "@/lib/audio";
import type { TileInfo } from "@/lib/game";

const props = defineProps<{
  x: bigint;
  y: bigint;
  z: bigint;
}>();

const { selectedCoordinate } = GameMapState();

const tileInfo = ref<TileInfo | null>(null);
const isSelected = computed(() => {
  if (!selectedCoordinate.value) {
    return false;
  }
  return (
    selectedCoordinate.value.x === props.x &&
    selectedCoordinate.value.y === props.y &&
    selectedCoordinate.value.z === props.z
  );
});

onMounted(() => {
  contractStorage
    .get("coords")
    .get(props.x.toString())
    .get(props.y.toString())
    .get(props.z.toString())
    .on((tokenId) => {
      if (typeof tokenId !== "string") {
        tileInfo.value = null;
        return;
      }
      contractStorage
        .get("tokens")
        .get(tokenId.toString())
        .once((data) => {
          tileInfo.value = data;
        });
    });
});

onUnmounted(() => {
  contractStorage
    .get("coords")
    .get(props.x.toString())
    .get(props.y.toString())
    .get(props.z.toString())
    .off();
});

function clickTile() {
  playAudio("button");

  selectedCoordinate.value = { x: props.x, y: props.y, z: props.z };
}
</script>

<template>
  <div class="relative flex aspect-square w-40 min-w-[6rem]" @click="clickTile">
    <div
      class="absolute inset-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-4 border-sky-900 bg-sky-900 text-sm transition-all"
      :class="{
        'bg-opacity-10 hover:bg-opacity-20': !tileInfo,
        'border-opacity-50': isSelected,
        'border-opacity-0': !isSelected,
      }"
    >
      <Transition>
        <img
          v-if="tileInfo && tileInfo.image"
          :src="tileInfo.image"
          alt="Tile"
        />
      </Transition>
    </div>
  </div>
</template>
