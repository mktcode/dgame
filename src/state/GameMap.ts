import { parseEther } from "ethers";
import { ref } from "vue";

export interface TileInfo {
  owner: string;
  level: bigint;
  type: string;
  name: string;
  description: string;
  image: string;
}

export enum Direction {
  Left = "left",
  Right = "right",
  Up = "up",
  Down = "down",
  Forward = "forward",
  Backward = "backward",
}

export const COORD_BASE_PRICE = parseEther("0.0001");
export const LEVEL_BASE_PRICE = parseEther("0.0001");

function getTokenLevelPrice(level: bigint) {
  return LEVEL_BASE_PRICE * 2n ** level;
}

function getMintPriceForAccount(balance: bigint) {
  return COORD_BASE_PRICE * 2n ** balance;
}

const gameMap = ref<HTMLElement | null>(null);
const position = ref({ x: 0n, y: 0n, z: 0n });
const selectedTile = ref<{ x: bigint; y: bigint; z: bigint } | null>(null);

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
    selectedTile,
    move,
    getTokenLevelPrice,
    getMintPriceForAccount,
  };
}
