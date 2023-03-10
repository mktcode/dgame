<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { formatEther } from "ethers";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCamera } from "@mdi/js";
import { pin, upload } from "@snapshot-labs/pineapple";
import { GameMapState } from "../state/GameMap";
import { useWeb3Account } from "../state/useWeb3Account";
import { playAudio } from "@/lib/audio";
import { useDGameContract } from "@/state/useDGameContract";
import DeployBase from "./DeployBase.vue";
import { type TileInfo, getTokenLevelPrice } from "@/lib/game";
import Mandelbrot from "./Mandelbrot.vue";
import { fetchTileInfo } from "@/lib/indexer";

const { accountAddress, connect, shortenAddress } = useWeb3Account();
const { selectedCoordinate } = GameMapState();

const selectedTileInfo = ref<TileInfo | null>(null);
const existingTokenId = ref<bigint | null>(null);

const isOwner = computed(
  () => selectedTileInfo.value?.owner === accountAddress.value
);

watch(
  selectedCoordinate,
  async (newValue, oldValue) => {
    if (!newValue) {
      selectedTileInfo.value = null;
      return;
    }

    selectedTileInfo.value = await fetchTileInfo(newValue);
  },
  { immediate: true }
);

const imageInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref<string | null>(null);

async function levelUp() {
  if (!selectedCoordinate.value) return;
  if (!selectedTileInfo.value) return;
  if (existingTokenId.value === null) return;

  playAudio("button");

  const { account } = await connect();
  const { dgameContract } = await useDGameContract(account);

  const file = imageInput.value?.files?.[0];
  let uploadedFile = null;
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    uploadedFile = await upload(formData);
  }

  const nftMetadata = {
    name: "Base 1",
    description: "A player's base",
    image:
      "ipfs://ipfs/" + uploadedFile
        ? uploadedFile.cid
        : selectedTileInfo.value.image,
  };
  const receipt = await pin(nftMetadata);

  try {
    playAudio("requesting-permission");

    const tx = await dgameContract.levelUp(
      existingTokenId.value.toString(),
      "ipfs://ipfs/" + receipt.cid,
      {
        value: getTokenLevelPrice(selectedTileInfo.value.level),
      }
    );

    playAudio("upgrading-base");

    await tx.wait();

    playAudio("upgrade-complete-effect");
    setTimeout(() => {
      playAudio("upgrade-complete");
    }, 250);
  } catch {
    playAudio("canceled");
  }
}

const loadImage = () => {
  const file = imageInput.value?.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      imageUrl.value = reader.result as string;
    };
  } else {
    imageUrl.value = null;
  }
};
</script>

<template>
  <div class="grow overflow-y-auto">
    <Mandelbrot />
    <Transition name="fade-fast" mode="out-in">
      <div v-if="selectedTileInfo">
        <template v-if="isOwner">
          <img v-if="imageUrl" :src="imageUrl" :alt="selectedTileInfo.name" />
          <div
            v-else
            @click="imageInput?.click()"
            class="relative cursor-pointer"
          >
            <div
              class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-20"
            >
              <svg-icon type="mdi" :path="mdiCamera" class="h-24 w-24" />
            </div>
            <img :src="selectedTileInfo.image" :alt="selectedTileInfo.name" />
          </div>
        </template>
        <template v-else>
          <img :src="selectedTileInfo.image" :alt="selectedTileInfo.name" />
        </template>

        <input
          type="file"
          ref="imageInput"
          @change="loadImage"
          accept="image/*"
          class="hidden"
        />

        <button v-if="isOwner" class="w-full" @click="levelUp">
          Level up for
          {{ formatEther(getTokenLevelPrice(selectedTileInfo.level)) }} ETH
        </button>
        <div class="flex px-3 pt-1 text-lg font-bold text-slate-400">
          {{ selectedTileInfo.name }} (Lvl {{ selectedTileInfo.level }})
        </div>
        <p class="px-3 text-slate-500">{{ selectedTileInfo.description }}</p>
        <p class="mt-3 truncate px-3 text-slate-500">
          Owner: {{ shortenAddress(selectedTileInfo.owner) }}
        </p>
      </div>
      <DeployBase v-else />
    </Transition>
  </div>
</template>
