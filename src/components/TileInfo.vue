<script setup lang="ts">
import { ref, watch } from "vue";
import { formatEther } from "ethers";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClose, mdiRefresh } from "@mdi/js";
import { GameMapState, type TileInfo } from "../state/GameMap";
import { indexer } from "../state/Gun";
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

watch(
  selectedTile,
  (newValue, oldValue) => {
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
    }

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

  playAudio("button");

  const { account, accountAddress } = await connect();
  const { dgameContract } = await useDGameContract(account);

  const coords = {
    x: selectedTile.value.x.toString(),
    y: selectedTile.value.y.toString(),
    z: selectedTile.value.z.toString(),
  };

  dgameContract.on("Transfer", async (_from, to, tokenId, event) => {
    console.log(`Minted NFT ${tokenId} to ${to}`);

    event.removeListener();

    const ownerBalance = await dgameContract.balanceOf(accountAddress);

    indexer.get("balances").get(accountAddress).put(ownerBalance.toString());
    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("owner")
      .put(accountAddress);
    indexer.get("tokens").get(tokenId.toString()).get("level").put("0");
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

async function levelUp() {
  if (!selectedTile.value) return;
  if (!selectedTileInfo.value) return;
  if (existingTokenId.value === null) return;

  playAudio("button");

  const { account } = await connect();
  const { dgameContract } = await useDGameContract(account);

  try {
    playAudio("requesting-permission");

    const tx = await dgameContract.levelUp(existingTokenId.value.toString(), {
      value: getTokenLevelPrice(selectedTileInfo.value.level),
    });

    playAudio("upgrading-base");

    await tx.wait();

    playAudio("upgrade-complete-effect");
    setTimeout(() => {
      playAudio("upgrade-complete");
    }, 250);

    const newTokenLevel = await dgameContract.tokenLevels(
      existingTokenId.value.toString()
    );

    indexer
      .get("tokens")
      .get(existingTokenId.value.toString())
      .get("level")
      .put(newTokenLevel.toString());
  } catch {
    playAudio("canceled");
  }
}

const isUpdatingFromChain = ref(false);

async function updateFromChain() {
  if (!selectedTile.value) return;

  isUpdatingFromChain.value = true;

  const { account } = await connect();
  const { dgameContract } = await useDGameContract(account);

  const coords = {
    x: selectedTile.value.x.toString(),
    y: selectedTile.value.y.toString(),
    z: selectedTile.value.z.toString(),
  };

  const tokenId = await dgameContract.tokenIdsByCoordinate(
    coords.x,
    coords.y,
    coords.z
  );

  if (tokenId === 0n) {
    selectedTileInfo.value = null;
    indexer.get("coords").get(coords.x).get(coords.y).get(coords.z).put(null);
  } else {
    const tileInfo: TileInfo = {
      owner: (await dgameContract.ownerOf(tokenId)).toLowerCase(),
      level: await dgameContract.tokenLevels(tokenId),
      type: "base",
      name: "Base",
      description: "A player's base.",
      image: "artwork/base2.jpeg",
    };

    selectedTileInfo.value = tileInfo;

    indexer
      .get("tokens")
      .get(tokenId.toString())
      .get("owner")
      .put(tileInfo.owner);
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

    isUpdatingFromChain.value = false;
  }
}
</script>

<template>
  <div class="grow overflow-y-auto bg-slate-900">
    <div v-if="selectedTile">
      <div class="flex items-center justify-between">
        <div class="mr-auto p-1 text-lg font-bold text-slate-300">
          {{ selectedTile.x }}/{{ selectedTile.y }}/{{ selectedTile.z }}
        </div>
        <button v-if="IS_ETHEREUM_ENABLED" @click="updateFromChain">
          <svg-icon
            type="mdi"
            :path="mdiRefresh"
            :class="{ 'animate-spin': isUpdatingFromChain }"
          ></svg-icon>
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
          <button
            v-if="selectedTileInfo.owner === accountAddress"
            class="w-full"
            @click="levelUp"
          >
            Level up for
            {{ formatEther(getTokenLevelPrice(selectedTileInfo.level)) }} ETH
          </button>
          <div class="px-3 pt-1 text-lg font-bold text-slate-400">
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
