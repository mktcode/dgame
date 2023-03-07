import type { Coordinate } from "./coordinates";
import type { TileInfo } from "./game";

const INDEXER_URL = import.meta.env.VITE_DGAME_INDEXER_URL;

async function fetchFromIndexer(path: string): Promise<any> {
  return await fetch(`${INDEXER_URL}${path}`).then((res) => res.json());
}

export async function fetchTileInfo(coords: Coordinate): Promise<TileInfo | null> {
  return await fetchFromIndexer(`/coords/${coords.x}:${coords.y}:${coords.z}`);
}