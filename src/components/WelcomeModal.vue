<script setup lang="ts">
import ModalOverlay from "./ModalOverlay.vue";
import { WelcomeModalState } from "../state/WelcomeModal";
import { GameMapState } from "@/state/GameMap";
import { playAudio } from "@/lib/audio";

const { isOpen } = WelcomeModalState();
const { gameMap } = GameMapState();

defineEmits<{
  (e: "close"): void;
}>();

function close() {
  isOpen.value = false;
  gameMap.value?.focus();

  playAudio("intro", 0.1);
  playAudio("ambient", 0.1, true);
  setTimeout(() => playAudio("welcome"), 1000);
}
</script>

<template>
  <ModalOverlay :is-open="isOpen" @close="close">
    <template #title> Welcome commander! </template>
    <template #body>
      <p class="text-gray-500">
        This is an open source, sci-fi browser game with NFTs.
      </p>
      <p class="mt-5 text-xl text-gray-500">
        Use <strong>arrow keys</strong> to navigate through space on the
        <strong>X and Y</strong> axis. <strong>Hold shift</strong> and use up
        and down arrow keys to move along the <strong>Z axis</strong>.
      </p>
    </template>
    <template #footer>
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-800 px-4 py-2 text-sm font-medium text-white hover:bg-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-900 focus-visible:ring-offset-2"
        @click="close"
      >
        Get started
      </button>
    </template>
  </ModalOverlay>
</template>
