import { computed, ref } from "vue";
import type { Coordinate } from "@/lib/coordinates";
import { Direction } from "@/lib/game";

const gameMap = ref<HTMLElement | null>(null);
const position = ref<Coordinate>({ x: 0n, y: 0n, z: 0n });
const selectedCoordinate = ref<Coordinate>({ x: 1n, y: 1n, z: 0n });
const backgroundPositionX = ref(0)
const backgroundPositionY = ref(0)
const backgroundSize = ref(100)
const backgroundStyles = computed(() => ({
  backgroundImage: `url(artwork/spaces/space1.jpeg)`,
  backgroundPositionX: backgroundPositionX.value + "%",
  backgroundPositionY: backgroundPositionY.value + "%",
  backgroundSize: backgroundSize.value + "%",
}));

let movingIsBlocked = false;
function move(direction: Direction) {
  if (movingIsBlocked) return;
  movingIsBlocked = true;

  switch (direction) {
    case Direction.Left:
      moveLeft();
      backgroundPositionX.value -= 1
      break;
    case Direction.Right:
      moveRight();
      backgroundPositionX.value += 1
      break;
    case Direction.Up:
      moveUp();
      backgroundPositionY.value -= 1
      break;
    case Direction.Down:
      moveDown();
      backgroundPositionY.value += 1
      break;
    case Direction.Forward:
      moveForward();
      backgroundSize.value += 1
      break;
    case Direction.Backward:
      moveBackward();
      backgroundSize.value -= 1
      break;
  }

  localStorage.setItem("x", position.value.x.toString());
  localStorage.setItem("y", position.value.y.toString());
  localStorage.setItem("z", position.value.z.toString());

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
    backgroundStyles,
  };
}
