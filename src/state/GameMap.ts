import { computed, ref } from "vue";

interface TileInfo {
  type: string;
  name: string;
  description: string;
  image: string;
}

const tilesInfo = ref<{[z: number]: {[y: number]: {[x: number]: TileInfo}}}>({
  0: {
    0: {
      0: {
        type: "empty",
        name: "Empty",
        description: "Empty space",
        image: "artwork/empty.jpeg",
      },
      4: {
        type: "base",
        name: "Base",
        description: "A player's base",
        image: "artwork/base.jpeg",
      },
    },
    4: {
      8: {
        type: "drone",
        name: "Drone",
        description: "A drone",
        image: "artwork/drone.jpeg",
      },
    },
  }
});

const position = ref({ x: 0, y: 0, z: 0 });
const selectedTile = ref<{ x: number, y: number, z: number } | null>({ x: 0, y: 0, z: 0 });

const selectedTileInfo = computed<TileInfo | null>(() => {
  if (selectedTile.value === null) {
    return null;
  }
  
  return tilesInfo.value[selectedTile.value.z]?.[selectedTile.value.y]?.[selectedTile.value.x] ?? null;
});

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
