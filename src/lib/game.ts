import { parseEther } from "ethers";

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

export function getTokenLevelPrice(level: bigint) {
  return LEVEL_BASE_PRICE * 2n ** level;
}

export function getMintPriceForAccount(balance: bigint) {
  return COORD_BASE_PRICE * 2n ** balance;
}