<script setup lang="ts">
import { ref } from "vue";
import { watchDebounced } from '@vueuse/core'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiLoading } from '@mdi/js'
import { indexer } from "../state/Gun";
import { GameMapState, type TileInfo } from "../state/GameMap";

const props = defineProps<{
  x: bigint;
  y: bigint;
  z: bigint;
}>();

const { selectedTile } = GameMapState();

const tileInfo = ref<TileInfo | undefined>(undefined);
const loading = ref(false);

watchDebounced(
  [
    () => props.x,
    () => props.y,
    () => props.z
  ],
  () => {
    loading.value = true;
    indexer.get('coords')
      .get(props.x.toString())
      .get(props.y.toString())
      .get(props.z.toString())
      .once((tokenId) => {
        if (tokenId === undefined) {
          tileInfo.value = undefined;
          loading.value = false;
          return
        };
        indexer.get('tokens').get(tokenId.toString()).once((data) => {
          tileInfo.value = data;
          loading.value = false;
        });
      });
  },
  { debounce: 500, maxWait: 10000, immediate: true },
);
</script>

<template>
  <div
    class="flex aspect-square w-28 min-w-[3.5rem] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-sky-900 text-sm relative transition-all"
    :class="{ 'opacity-10 hover:opacity-20': !tileInfo }"
    @click="selectedTile = { x, y, z }"
  >
    <img v-if="tileInfo && tileInfo.image" :src="tileInfo.image" alt="Tile" />
    <div v-if="loading" class="absolute inset-0 text-white font-bold flex items-center justify-center">
      <svg-icon type="mdi" :path="mdiLoading" class="animate-spin"></svg-icon>
    </div>
  </div>
</template>
