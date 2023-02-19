export const BIGINT_REGEX = /^-?\d+$/;

export type BigIntLike = bigint | string | number;

export function isBigIntLike(x: unknown): x is BigIntLike {
  if (typeof x === "bigint" || typeof x === "number") return true;
  if (typeof x !== "string") return false;

  try {
    return typeof BigInt(x) === "bigint";
  } catch (e) {
    return false;
  }
}

export interface CoordinateLike {
  x: BigIntLike;
  y: BigIntLike;
  z: BigIntLike;
}

export function isCoordinateLike(coordinate: unknown): coordinate is CoordinateLike {
  return (
    typeof coordinate === "object" &&
    coordinate !== null &&
    "x" in coordinate &&
    "y" in coordinate &&
    "z" in coordinate &&
    isBigIntLike(coordinate.x) &&
    isBigIntLike(coordinate.y) &&
    isBigIntLike(coordinate.z)
  );
}

export interface Coordinate {
  x: bigint;
  y: bigint;
  z: bigint;
}

export function isCoordinate(coordinate: unknown): coordinate is Coordinate {
  if (!isCoordinateLike(coordinate)) return false;

  try {
    return (
      typeof BigInt(coordinate.x) === "bigint" &&
      typeof BigInt(coordinate.y) === "bigint" &&
      typeof BigInt(coordinate.z) === "bigint"
    );
  } catch (e) {
    return false;
  }
}

export function toCoordinate(coordinate: CoordinateLike): Coordinate {
  return {
    x: BigInt(coordinate.x),
    y: BigInt(coordinate.y),
    z: BigInt(coordinate.z),
  };
}

function getNumberBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomCoordinate(): { x: bigint, y: bigint, z: bigint } {
  return {
    x: BigInt(getNumberBetween(-1000000000, 1000000000)),
    y: BigInt(getNumberBetween(-1000000000, 1000000000)),
    z: BigInt(getNumberBetween(-1000000000, 1000000000)),
  }
}

export function jsonStringifyBigInts(obj: any): string {
  return JSON.stringify(obj, (_, value) => typeof value === 'bigint' ? value.toString() : value);
}

export function jsonParseBigInts(str: string): any {
  return JSON.parse(str, (_, value) => isBigIntLike(value) ? BigInt(value) : value);
}