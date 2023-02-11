<script setup lang="ts">
import { Contract, ethers } from "ethers";
import { GameMapState } from "../state/GameMap";
import DGAME_ABI from "../contracts/DGame.json";

const { selectedTile, selectedTileInfo } = GameMapState();

async function mintNft() {
  if (!selectedTile.value) return;

  let signer = null;
  let provider;
  if (window.ethereum == null) {
    console.log("MetaMask not installed.");
    return;
  }
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();

  const contract = new Contract(import.meta.env.VITE_DGAME_CONTRACT_ADDRESS, DGAME_ABI, signer);

  const tx = await contract.safeMint(selectedTile.value.x, selectedTile.value.y, selectedTile.value.z);
  await tx.wait();
}
</script>

<template>
  <div class="grow overflow-y-auto bg-sky-900">
    <div class="flex items-center justify-between">
      <div v-if="selectedTile" class="p-1 text-lg font-bold text-slate-300">
        {{ selectedTile.x }}/{{ selectedTile.y }}/{{ selectedTile.z }}
      </div>
      <button @click="selectedTile = null">x</button>
    </div>
    <div v-if="selectedTileInfo">
      <img
        :src="selectedTileInfo.image"
        :alt="selectedTileInfo.name"
        class="rounded"
      />
      <div class="px-3 pt-1 text-lg font-bold text-slate-400">
        {{ selectedTileInfo.name }}
      </div>
      <p class="px-3 text-slate-500">{{ selectedTileInfo.description }}</p>
    </div>
    <div v-else>
      <div
        class="flex aspect-square w-full items-center justify-center bg-slate-900 text-center text-3xl font-bold text-white text-opacity-30"
      >
        ?
      </div>
      <button class="w-full" @click="mintNft">Explore</button>
    </div>
  </div>
</template>
