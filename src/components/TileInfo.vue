<script setup lang="ts">
import { ref, watch } from "vue";
import { Contract, ethers } from "ethers";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClose, mdiRefresh } from "@mdi/js";
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
const isMinting = ref(false);
const levelPrice = ref<bigint | null>(null);
const tokenOwner = ref<string | null>(null);
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

  levelPrice.value = await contract.getTokenLevelPrice(
    existingTokenId.value.toString()
  );
}

async function getIsOwner() {
  if (existingTokenId.value === null) {
    isOwner.value = false;
    return;
  }

  if (window.ethereum == null) {
    console.log("MetaMask not installed.");
    isOwner.value = false;
    return;
  }

  const accounts = await provider.send("eth_requestAccounts", []);
  tokenOwner.value = (await contract.ownerOf(
    existingTokenId.value.toString()
  )) as string;
  isOwner.value = tokenOwner.value.toLowerCase() === accounts[0].toLowerCase();
}

watch(
  selectedTile,
  (newValue, oldValue) => {
    getMintPriceForAccount();
    
    if (oldValue) {
      indexer
      .get("coords")
      .get(oldValue.x.toString())
      .get(oldValue.y.toString())
      .get(oldValue.z.toString())
      .off();
    }
    
    selectedTileInfo.value = null;
    
    if (!newValue) {
      return;
    };

    const coords = {
      x: newValue.x.toString(),
      y: newValue.y.toString(),
      z: newValue.z.toString(),
    };

    indexer
      .get("coords")
      .get(coords.x)
      .get(coords.y)
      .get(coords.z)
      .on((tokenId) => {
        existingTokenId.value = tokenId ? BigInt(tokenId) : null;

        getIsOwner();
        getLevelPriceForToken();

        if (typeof tokenId !== "string" || tokenId === "0") {
          selectedTileInfo.value = null;
          return;
        }

        indexer
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

    indexer.get("tokens").get(tokenId.toString()).get("level").put("1");
    indexer.get("tokens").get(tokenId.toString()).get("type").put("base");
    indexer.get("tokens").get(tokenId.toString()).get("name").put("Base");
    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("description")
      .put("A player's base");
    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("image")
      .put("artwork/base2.jpeg");
    indexer
      .get("coords")
      .get(coords.x)
      .get(coords.y)
      .get(coords.z)
      .put(tokenId.toString());
  });

  const tx = await contract.safeMint(coords.x, coords.y, coords.z, {
    value: mintPrice.value,
  });

  isMinting.value = true;
  const deployingBaseAudio = new Audio("/sounds/deploying-base.mp3");
  deployingBaseAudio.play();
  await tx.wait();
  const deploymentCompleteAudio = new Audio("/sounds/deployment-complete.mp3");
  deploymentCompleteAudio.play();
  isMinting.value = false;
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
  indexer
    .get("tokens")
    .get(existingTokenId.value.toString())
    .get("level")
    .put((selectedTileInfo.value.level + 1n).toString());
}

async function updateFromChain() {
  if (!selectedTile.value) return;

  if (window.ethereum == null) {
    console.log("MetaMask not installed.");
    return;
  }

  const coords = {
    x: selectedTile.value.x.toString(),
    y: selectedTile.value.y.toString(),
    z: selectedTile.value.z.toString(),
  };

  const tokenId = await contract.tokenIdsByCoordinate(
    coords.x,
    coords.y,
    coords.z
  );

  if (tokenId.eq(0)) {
    selectedTileInfo.value = null;
    indexer.get("coords").get(coords.x).get(coords.y).get(coords.z).put(null);
  } else {
    // const tokenUri = await contract.tokenURI(tokenId);
    // const response = await fetch(tokenUri);
    // const json = await response.json();

    const tileInfo: TileInfo = {
      level: await contract.tokenLevels(tokenId),
      type: "base",
      name: "Base",
      description: "A player's base.",
      image: "artwork/base2.jpeg",
    };

    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("level")
      .put(tileInfo.level.toString());
    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("type")
      .put(tileInfo.type);
    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("name")
      .put(tileInfo.name);
    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("description")
      .put(tileInfo.description);
    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("image")
      .put(tileInfo.image);
    indexer
      .get("coords")
      .get(coords.x)
      .get(coords.y)
      .get(coords.z)
      .put(tokenId.toString());
  }
}
</script>

<template>
  <div class="grow overflow-y-auto bg-sky-900">
    <div v-if="selectedTile">
      <div class="flex items-center justify-between">
        <div class="mr-auto p-1 text-lg font-bold text-slate-300">
          {{ selectedTile.x }}/{{ selectedTile.y }}/{{ selectedTile.z }}
        </div>
        <button @click="updateFromChain">
          <svg-icon type="mdi" :path="mdiRefresh"></svg-icon>
        </button>
        <button @click="selectedTile = null">
          <svg-icon type="mdi" :path="mdiClose"></svg-icon>
        </button>
      </div>
      <Transition name="fade-fast" mode="out-in">
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
          <p class="mt-3 truncate px-3 text-slate-500">
            Owner:<br />{{ tokenOwner }}
          </p>
        </div>
        <div v-else>
          <div
            v-if="mintPrice"
            class="aspect-square bg-sky-900 bg-cover"
            :style="{
              backgroundImage: 'url(artwork/base2.jpeg)',
            }"
            @click="mintNft"
          >
            <div
              class="flex h-full grow animate-pulse cursor-pointer items-center justify-center bg-gray-50 bg-opacity-30 text-center text-2xl font-bold text-white"
            >
              <div v-if="isMinting">
                deploying...
              </div>
              <div v-else>
                Deploy Base<br />
                {{ ethers.utils.formatEther(mintPrice) }} ETH
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <div v-else class="p-3 text-center text-sky-700">select tile</div>
  </div>
</template>
