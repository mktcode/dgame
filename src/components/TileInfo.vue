<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { formatEther } from "ethers";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClose, mdiCamera } from "@mdi/js";
import { pin } from '@snapshot-labs/pineapple';
import { GameMapState, type TileInfo } from "../state/GameMap";
import { indexer } from "../state/Indexer";
import { useWeb3Account, IS_ETHEREUM_ENABLED } from "../state/useWeb3Account";
import { playAudio } from "@/lib/audio";
import { useDGameContract } from "@/state/useDGameContract";

const { accountAddress, accountBalance, connect, shortenAddress } =
  useWeb3Account();
const { selectedTile, getTokenLevelPrice, getMintPriceForAccount } =
  GameMapState();

const selectedTileInfo = ref<TileInfo | null>(null);
const existingTokenId = ref<bigint | null>(null);
const isMinting = ref(false);

const isOwner = computed(() => selectedTileInfo.value?.owner === accountAddress.value)

watch(
  selectedTile,
  (newValue, oldValue) => {
    if (oldValue) {
      indexer.storage
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

    indexer.storage
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

        indexer.storage
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

async function mintNft() {
  if (!selectedTile.value) return;

  playAudio("button");

  const { account } = await connect();
  const { dgameContract } = await useDGameContract(account);

  const coords = {
    x: selectedTile.value.x.toString(),
    y: selectedTile.value.y.toString(),
    z: selectedTile.value.z.toString(),
  };

  try {
    playAudio("requesting-permission");

    const tx = await dgameContract.safeMint(coords.x, coords.y, coords.z, {
      value: getMintPriceForAccount(accountBalance.value),
    });

    isMinting.value = true;
    playAudio("deploying-base");
    await tx.wait();
    playAudio("deployment-complete-effect");
    setTimeout(() => {
      playAudio("deployment-complete");
    }, 1000);
    isMinting.value = false;
  } catch (e) {
    playAudio("canceled");
  }
}

const imageInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref<string | null>(null);

async function levelUp() {
  if (!selectedTile.value) return;
  if (!selectedTileInfo.value) return;
  if (existingTokenId.value === null) return;

  playAudio("button");

  const { account } = await connect();
  const { dgameContract } = await useDGameContract(account);

  const nftMetadata = {
    name: "Base 1",
    description: "A player's base",
    image: imageUrl.value,
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

const loadImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
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
    <div v-if="selectedTile">
      <div class="flex items-center justify-between">
        <div class="mr-auto px-2 text-lg font-bold text-slate-300">
          {{ selectedTile.x }}/{{ selectedTile.y }}/{{ selectedTile.z }}
        </div>
        <button @click="selectedTile = null">
          <svg-icon type="mdi" :path="mdiClose"></svg-icon>
        </button>
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
        <div v-else>
          <div
            v-if="IS_ETHEREUM_ENABLED"
            class="aspect-square bg-sky-900 bg-cover"
            :style="{
              backgroundImage: 'url(artwork/base2.jpeg)',
            }"
            @click="mintNft"
          >
            <div
              class="flex h-full grow animate-pulse cursor-pointer items-center justify-center bg-gray-50 bg-opacity-30 text-center text-2xl font-bold text-white"
            >
              <div v-if="isMinting">deploying...</div>
              <div v-else>
                Deploy Base<br />
                {{ formatEther(getMintPriceForAccount(accountBalance)) }} ETH
              </div>
            </div>
          </div>
          <div
            v-else
            class="aspect-square bg-sky-900 bg-cover"
            :style="{
              backgroundImage: 'url(artwork/base2.jpeg)',
            }"
          >
            <div
              class="flex h-full grow animate-pulse cursor-pointer items-center justify-center bg-red-500 bg-opacity-30 text-center text-3xl font-bold text-white"
            >
              No Ethereum detected.<br />
              Please install MetaMask.
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <div v-else class="p-3 text-center text-sky-700">select tile</div>
  </div>
</template>
