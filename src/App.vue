<script setup lang="ts">
import ResourcesInfo from "./components/ResourcesInfo.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import GameMap from "./components/GameMap.vue";
import TileInfo from "./components/TileInfo.vue";
import { GameMapState } from "./state/GameMap";
import { useWeb3Account } from "./state/useWeb3Account";

const { position } = GameMapState();
const { accountAddress, connect } = useWeb3Account();
</script>

<template>
  <div class="flex h-screen">
    <GameMap />
    <div class="flex w-72 flex-none flex-col">
      <div v-if="accountAddress" class="py-1 text-center text-sky-700">
        Acc: {{ accountAddress }}
      </div>
      <button v-else @click="connect">
        Connect Wallet
      </button>
      <div class="py-1 text-center text-sky-700">
        x: {{ position.x.toString() }} y: {{ position.y.toString() }} z:
        {{ position.z.toString() }}
      </div>
      <ResourcesInfo />
      <TileInfo />
    </div>
  </div>
  <WelcomeModal />
</template>
