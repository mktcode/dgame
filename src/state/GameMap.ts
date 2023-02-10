import { ref } from "vue";

const position = ref({ x: 0, y: 0, z: 0 });
const selectedTile = ref({ x: 0, y: 0, z: 0 });

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

function moveForward() {
  position.value.z += 1;
}

function moveBackward() {
  position.value.z -= 1;
}

export function GameMapState() {


  return {
    position,
    selectedTile,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    moveForward,
    moveBackward,
  };
}
