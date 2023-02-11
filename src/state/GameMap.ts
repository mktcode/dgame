import { computed, ref } from "vue";

export interface TileInfo {
  type: string;
  name: string;
  description: string;
  image: string;
}

const tilesInfo = ref<{
  [z: string]: { [y: string]: { [x: string]: TileInfo } };
}>({
  '0': {
    '0': {
      '0': {
        type: "empty",
        name: "Empty",
        description: "Empty space",
        image: "artwork/empty.jpeg",
      },
      '4': {
        type: "base",
        name: "Base",
        description: "A player's base",
        image: "artwork/base.jpeg",
      },
    },
    '4': {
      '8': {
        type: "drone",
        name: "Drone",
        description: "A drone",
        image: "artwork/drone.jpeg",
      },
    },
    '10': {
      '10': {
        type: "destroyer",
        name: "Destroyer",
        description: "A destroyer",
        image: "artwork/destroyer.jpeg",
      },
    },
  },
});

const gameMap = ref<HTMLElement | null>(null);
const position = ref({ x: 0n, y: 0n, z: 0n });
const selectedTile = ref<{ x: bigint; y: bigint; z: bigint } | null>(null);

const selectedTileInfo = computed<TileInfo | null>(() => {
  if (selectedTile.value === null) {
    return null;
  }

  return (
    tilesInfo.value[selectedTile.value.z.toString()]?.[selectedTile.value.y.toString()]?.[
      selectedTile.value.x.toString()
    ] ?? null
  );
});

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
    tilesInfo,
    position,
    selectedTile,
    selectedTileInfo,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    moveForward,
    moveBackward,
  };
}
