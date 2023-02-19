import { ref } from "vue";
import { jsonStringifyBigInts, type Coordinate } from "@/lib/coordinates";
import { Direction } from "@/lib/game";

const gameMap = ref<HTMLElement | null>(null);
const position = ref<Coordinate>({ x: 0n, y: 0n, z: 0n });
const selectedCoordinate = ref<Coordinate>({ x: 1n, y: 1n, z: 0n });

let movingIsBlocked = false;
function move(direction: Direction) {
  if (movingIsBlocked) return;
  movingIsBlocked = true;

  switch (direction) {
    case Direction.Left:
      moveLeft();
      break;
    case Direction.Right:
      moveRight();
      break;
    case Direction.Up:
      moveUp();
      break;
    case Direction.Down:
      moveDown();
      break;
    case Direction.Forward:
      moveForward();
      break;
    case Direction.Backward:
      moveBackward();
      break;
  }

  localStorage.setItem("position", jsonStringifyBigInts(position.value));

  setTimeout(() => {
    movingIsBlocked = false;
  }, 500);
}

function moveLeft() {
  position.value.x -= 1n;
}

function moveRight() {
  position.value.x += 1n;
}

function moveUp() {
  position.value.y -= 1n;
}

function moveDown() {
  position.value.y += 1n;
}

function moveForward() {
  position.value.z += 1n;
}

function moveBackward() {
  position.value.z -= 1n;
}

export function GameMapState() {
  return {
    gameMap,
    position,
    selectedCoordinate,
    move,
  };
}
