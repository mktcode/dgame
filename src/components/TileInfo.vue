<script setup lang="ts">
import { ref, watch } from "vue";
import { Contract, ethers } from "ethers";
import { GameMapState, type TileInfo } from "../state/GameMap";
import DGAME_ABI from "../contracts/DGame.json";
import { indexer } from "../state/Gun";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contract = new Contract(
  import.meta.env.VITE_DGAME_CONTRACT_ADDRESS,
  DGAME_ABI,
  signer
);

const { selectedTile } = GameMapState();

const selectedTileInfo = ref<TileInfo | null>(null);

const existingTokenId = ref<bigint | null>(null);
const mintPrice = ref<bigint | null>(null);
const levelPrice = ref<bigint | null>(null);
const isOwner = ref(false);

async function getMintPriceForAccount() {
  if (window.ethereum == null) {
    console.log("MetaMask not installed.");
    return;
  }

  const accounts = await provider.send("eth_requestAccounts", []);
  mintPrice.value = await contract.getMintPrice(accounts[0]);
}

async function getLevelPriceForToken() {
  if (existingTokenId.value === null) return null;

  if (window.ethereum == null) {
    console.log("MetaMask not installed.");
    return;
  }

  levelPrice.value = await contract.getTokenLevelPrice(existingTokenId.value.toString());
}

async function getIsOwner() {
  if (existingTokenId.value === null) {
    isOwner.value = false;
    return;
  };

  if (window.ethereum == null) {
    console.log("MetaMask not installed.");
    isOwner.value = false;
    return;
  }

  const accounts = await provider.send("eth_requestAccounts", []);
  const tokenOwner = await contract.ownerOf(existingTokenId.value.toString());
  isOwner.value = tokenOwner.toLowerCase() === accounts[0].toLowerCase();
}

watch(selectedTile, () => {
  if (!selectedTile.value) return null;

  getMintPriceForAccount();

  const coords = {
    x: selectedTile.value.x.toString(),
    y: selectedTile.value.y.toString(),
    z: selectedTile.value.z.toString(),
  };

  indexer.get('coords').get(coords.x).get(coords.y).get(coords.z).once((tokenId) => {
    existingTokenId.value = tokenId ? BigInt(tokenId) : null;

    getIsOwner();
    getLevelPriceForToken();

    if (tokenId === undefined) {
      selectedTileInfo.value = null;
      return;
    }
    
    indexer.get('tokens').get(tokenId.toString()).once((data) => {
      selectedTileInfo.value = data;
    });
  });
}, { immediate: true });

async function mintNft() {
  if (!selectedTile.value) return;
  if (!mintPrice.value) return;

  if (window.ethereum == null) {
    console.log("MetaMask not installed.");
    return;
  }

  await provider.send("eth_requestAccounts", []);

  const coords = {
    x: selectedTile.value.x.toString(),
    y: selectedTile.value.y.toString(),
    z: selectedTile.value.z.toString(),
  };

  contract.on("Transfer", (_from, to, tokenId, event) => {
    console.log(`Minted NFT ${tokenId} to ${to}`);

    event.removeListener();

    indexer.get('tokens').get(tokenId.toString()).get("level").put(1n);
    indexer.get('tokens').get(tokenId.toString()).get("type").put("base");
    indexer.get('tokens').get(tokenId.toString()).get("name").put("Base");
    indexer.get('tokens').get(tokenId.toString()).get("description").put("A player's base");
    indexer.get('tokens').get(tokenId.toString()).get("image").put("artwork/base.jpeg");
    indexer.get('coords').get(coords.x).get(coords.y).get(coords.z).put(tokenId.toString());
  });

  const tx = await contract.safeMint(coords.x, coords.y, coords.z, {
    value: mintPrice.value,
  });
  await tx.wait();
}

async function levelUp() {
  if (!selectedTile.value) return;
  if (!selectedTileInfo.value) return;
  if (!levelPrice.value) return;
  if (existingTokenId.value === null) return;

  if (window.ethereum == null) {
    console.log("MetaMask not installed.");
    return;
  }

  await provider.send("eth_requestAccounts", []);

  const tx = await contract.levelUp(existingTokenId.value.toString(), {
    value: levelPrice.value,
  });
  await tx.wait();
  indexer.get('tokens').get(existingTokenId.value.toString()).get("level").put(selectedTileInfo.value.level + 1n);
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
      <button v-if="isOwner && levelPrice" class="w-full" @click="levelUp">
        Level up for {{ ethers.utils.formatEther(levelPrice) }} ETH
      </button>
      <div class="px-3 pt-1 text-lg font-bold text-slate-400">
        {{ selectedTileInfo.name }} (Lvl {{ selectedTileInfo.level }})
      </div>
      <p class="px-3 text-slate-500">{{ selectedTileInfo.description }}</p>
    </div>
    <div v-else>
      <div
        class="flex aspect-square w-full items-center justify-center bg-slate-900 text-center text-3xl font-bold text-white text-opacity-30"
      >
        ?
      </div>
      <button v-if="mintPrice" class="w-full" @click="mintNft">
        Mint for {{ ethers.utils.formatEther(mintPrice) }} ETH
      </button>
    </div>
  </div>
</template>
