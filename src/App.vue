<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  randomCoordinate,
  isCoordinateLike,
  toCoordinate,
} from "@/lib/coordinates";
import { GameMapState } from "./state/GameMap";

const route = useRoute();

const { position } = GameMapState();

const storedPosition = {
  x: localStorage.getItem("x"),
  y: localStorage.getItem("y"),
  z: localStorage.getItem("z"),
};

if (isCoordinateLike(route.params)) {
  position.value = toCoordinate(route.params);
} else if (isCoordinateLike(storedPosition)) {
  position.value = toCoordinate(storedPosition);
} else {
  position.value = randomCoordinate();
}

localStorage.setItem("x", position.value.x.toString());
localStorage.setItem("y", position.value.y.toString());
localStorage.setItem("z", position.value.z.toString());
</script>

<template>
  <router-view />
</template>
