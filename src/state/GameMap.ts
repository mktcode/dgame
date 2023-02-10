import { ref } from "vue";

export function GameMapState() {
  const gameMap = ref<HTMLElement | null>(null);
  
  return {
    gameMap,
  };
}