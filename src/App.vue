<script setup lang="ts">
import WelcomeModal from "./components/WelcomeModal.vue";
import GameMap from "./components/GameMap.vue";
import TileInfo from "./components/TileInfo.vue";
import { GameMapState } from "./state/GameMap";
import { IS_ETHEREUM_ENABLED, useWeb3Account } from "./state/useWeb3Account";

const { position, selectedTile } = GameMapState();
const { accountAddress, connect, shortenAddress } = useWeb3Account();;
</script>

<template>
  <div class="flex h-screen">
    <GameMap />
    <div
      class="flex overflow-hidden flex-none flex-col w-full absolute inset-0 sm:relative sm:w-72"
      :class="{
        'hidden sm:flex': !selectedTile,
      }"
    >
      <button v-if="!accountAddress && IS_ETHEREUM_ENABLED" @click="connect">
        Connect Wallet
      </button>
      <TileInfo />
      <div v-if="accountAddress" class="py-1 text-center text-sky-600 bg-sky-900">
        {{ shortenAddress(accountAddress) }}
      </div>
      <div class="py-1 text-center text-sky-600 bg-sky-900">
        x: {{ position.x.toString() }} y: {{ position.y.toString() }} z:
        {{ position.z.toString() }}
      </div>
    </div>
  </div>
  <WelcomeModal />
</template>
