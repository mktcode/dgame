<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { formatEther } from "ethers";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCamera } from "@mdi/js";
import { pin, upload } from '@snapshot-labs/pineapple';
import { GameMapState } from "../state/GameMap";
import { contractStorage } from "../state/Indexer";
import { useWeb3Account } from "../state/useWeb3Account";
import { playAudio } from "@/lib/audio";
import { useDGameContract } from "@/state/useDGameContract";
import DeployBase from "./DeployBase.vue";
import { type TileInfo, getTokenLevelPrice } from "@/lib/game";
import Mandelbrot from "./Mandelbrot.vue";

const { accountAddress, connect, shortenAddress } = useWeb3Account();
const { selectedCoordinate, position } = GameMapState();

const selectedTileInfo = ref<TileInfo | null>(null);
const existingTokenId = ref<bigint | null>(null);

const isOwner = computed(() => selectedTileInfo.value?.owner === accountAddress.value)

watch(
  selectedCoordinate,
  (newValue, oldValue) => {
    if (oldValue) {
      contractStorage
        .get("coords")
        .get(oldValue.x.toString())
        .get(oldValue.y.toString())
        .get(oldValue.z.toString())
        .off();
    }

    selectedTileInfo.value = null;

    if (!newValue) {
      return;
    }

    const coords = {
      x: newValue.x.toString(),
      y: newValue.y.toString(),
      z: newValue.z.toString(),
    };

    contractStorage
      .get("coords")
      .get(coords.x)
      .get(coords.y)
      .get(coords.z)
      .on((tokenId) => {
        existingTokenId.value = tokenId ? BigInt(tokenId) : null;

        if (typeof tokenId !== "string" || tokenId === "0") {
          selectedTileInfo.value = null;
          return;
        }

        contractStorage
          .get("tokens")
          .get(tokenId.toString())
          .once((data) => {
            if (data && data.level.length > 0) {
              data.level = BigInt(data.level);
            }
            selectedTileInfo.value = data;
          });
      });
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
    formData.append('file', file);
    uploadedFile = await upload(formData);
  }

  const nftMetadata = {
    name: "Base 1",
    description: "A player's base",
    image: 'ipfs://ipfs/' + uploadedFile ? uploadedFile.cid : selectedTileInfo.value.image,
  };
  const receipt = await pin(nftMetadata);

  try {
    playAudio("requesting-permission");

    const tx = await dgameContract.levelUp(existingTokenId.value.toString(), 'ipfs://ipfs/' + receipt.cid, {
      value: getTokenLevelPrice(selectedTileInfo.value.level),
    });

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
  <div class="grow overflow-y-auto bg-slate-900">
    <div class="flex flex-col text-xl font-bold text-sky-100 mb-3">
      <div class="flex items-center">
        <span class="text-sky-900 mr-2">x</span>
        <input type="text" v-model="selectedCoordinate.x" @change="position = selectedCoordinate" class="bg-transparent text-sky-100 focus:bg-sky-900 w-full rounded px-2" />
      </div>
      <div class="flex items-center">
        <span class="text-sky-900 mr-2">y</span>
        <input type="text" v-model="selectedCoordinate.y" @change="position = selectedCoordinate" class="bg-transparent text-sky-100 focus:bg-sky-900 w-full rounded px-2" />
      </div>
      <div class="flex items-center">
        <span class="text-sky-900 mr-2">z</span>
        <input type="text" v-model="selectedCoordinate.z" @change="position = selectedCoordinate" class="bg-transparent text-sky-100 focus:bg-sky-900 w-full rounded px-2" />
      </div>
    </div>
    <Transition name="fade-fast" mode="out-in">
      <div v-if="selectedTileInfo">
        <template v-if="isOwner">
          <img v-if="imageUrl" :src="imageUrl" :alt="selectedTileInfo.name" />
          <div v-else @click="imageInput?.click()" class="cursor-pointer relative">
            <div class="flex items-center justify-center absolute inset-0 opacity-0 hover:opacity-20 transition-opacity">
              <svg-icon type="mdi" :path="mdiCamera" class="w-24 h-24" />
            </div>
            <img
              :src="selectedTileInfo.image"
              :alt="selectedTileInfo.name"
            />
          </div>
        </template>
        <template v-else>
          <img
            :src="selectedTileInfo.image"
            :alt="selectedTileInfo.name"
          />
        </template>

        <input type="file" ref="imageInput" @change="loadImage" accept="image/*" class="hidden" />
        
        <button
          v-if="isOwner"
          class="w-full"
          @click="levelUp"
        >
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
    <Mandelbrot />
  </div>
</template>
