<script setup lang="ts">
import ModalOverlay from "./ModalOverlay.vue";
import { WelcomeModalState } from "../state/WelcomeModal";

const { isOpen } = WelcomeModalState();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <ModalOverlay :is-open="isOpen" @close="isOpen = false">
    <template #title>
      <h3 class="mb-2 text-lg font-medium leading-6 text-gray-900">
        Welcome to the game!
      </h3>
    </template>
    <template #body>
      <p class="text-sm text-gray-500">
        This is an open source sci-fi browser game. You can play it for free but you can also earn and spend cryptocurrency and NFTs.
      </p>
      <p class="text-sm text-gray-500 mt-5">
        Use arrow keys to navigate through space on the X and Y axis. Use Shift+Up and Shift+Down to move along the Z axis.
      </p>
    </template>
    <template #footer>
      <button
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        @click="isOpen = false"
      >
        Get started
      </button>
    </template>
  </ModalOverlay>
</template>
