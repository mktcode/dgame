<script setup lang="ts">
import { ref } from "vue";
import { formatEther } from "ethers";
import { playAudio } from "@/lib/audio";
import { GameMapState } from "@/state/GameMap";
import { useDGameContract } from "@/state/useDGameContract";
import { useWeb3Account, IS_ETHEREUM_ENABLED } from "@/state/useWeb3Account";
import { Direction, getMintPriceForAccount } from "@/lib/game";
import { INITIAL_ZOOM, MandelbrotState } from "@/state/MandelbrotState";
import GIF from "gif.js";

const { selectedCoordinate } = GameMapState();
const { canvas, currentZoom, move, drawMandelbrotSet } = MandelbrotState();
const { connect, accountBalance } = useWeb3Account();

const isMinting = ref(false);
const imageUrl = ref<string | null>(null);

async function mintNft() {
  if (!canvas.value) return;

  console.log("mintNft")
  playAudio("button");

  const { account } = await connect();
  const { dgameContract } = await useDGameContract(account);

  const targetZoom = currentZoom.value;

  currentZoom.value = 0.001;
  drawMandelbrotSet();

  const gif = new GIF({
    workers: 2,
    quality: 3,
    // repeat: -1,
  });

  while (currentZoom.value < targetZoom) {
    move(Direction.Forward);
    drawMandelbrotSet();
    gif.addFrame(canvas.value, { delay: 80, copy: true });
    imageUrl.value = canvas.value.toDataURL("image/png", 1.0);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  gif.on('finished', function(blob) {
    window.open(URL.createObjectURL(blob));
  });
  
  gif.render();

  return;

  const coords = {
    x: selectedCoordinate.value.x.toString(),
    y: selectedCoordinate.value.y.toString(),
    z: selectedCoordinate.value.z.toString(),
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
</script>

<template>
  <div>
    <div
      v-if="IS_ETHEREUM_ENABLED"
      class="aspect-square overflow-hidden rounded-xl border-8 border-slate-800 bg-sky-900 bg-cover"
      :style="{
        backgroundImage: `url(${imageUrl || 'artwork/base2.jpeg'})`,
        imageRendering: 'pixelated',
      }"
    >
      <div
        class="flex h-full grow cursor-pointer items-center justify-center text-center text-2xl font-bold text-white"
      >
        <div v-if="isMinting">deploying...</div>
        <div v-else @click="mintNft">
          Deploy Baaaase<br />
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
</template>
