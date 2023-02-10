<script setup lang="ts">
import { GameMapState } from "../state/GameMap";

const { selectedTile } = GameMapState();
</script>

<template>
  <div class="text-center text-sm">
    Tile {{ selectedTile.x }}/{{ selectedTile.y }}/{{ selectedTile.z }}
  </div>
</template>
