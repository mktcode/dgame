import { ref } from "vue";

export function GameMapState() {
  const position = ref({ x: 0, y: 0 });

  function moveLeft() {
    position.value.x -= 1;
  }

  function moveRight() {
    position.value.x += 1;
  }

  function moveUp() {
    position.value.y -= 1;
  }

  function moveDown() {
    position.value.y += 1;
  }

  return {
    position,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
  };
}
