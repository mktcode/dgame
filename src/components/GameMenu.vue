<script setup lang="ts">
import TileInfo from "@/components/TileInfo.vue";
import { GameMapState } from "@/state/GameMap";
import { IS_ETHEREUM_ENABLED, useWeb3Account } from "@/state/useWeb3Account";

const { selectedCoordinate } = GameMapState();
const { accountAddress, connect, shortenAddress } = useWeb3Account();
</script>

<template>
  <div
    class="absolute inset-0 flex w-full flex-none flex-col overflow-hidden sm:relative sm:w-72"
    :class="{
      'hidden sm:flex': !selectedCoordinate,
    }"
  >
    <TileInfo />

    <div class="mt-3">
      <div v-if="accountAddress" class="py-1 text-center text-sky-900">
        {{ shortenAddress(accountAddress) }}
      </div>
      <button
        v-if="!accountAddress && IS_ETHEREUM_ENABLED"
        @click="connect"
        class="flex w-full flex-col text-xl"
      >
        Connect Wallet
        <span class="text-sm text-sky-600">with goerli testnet</span>
      </button>
    </div>
  </div>
</template>
