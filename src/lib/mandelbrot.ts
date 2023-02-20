const MAX_ITERATIONS = 500;

export function isInMandelbrotSet(x0: number, y0: number) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const xtemp = x * x - y * y + x0;
    const ytemp = 2 * x * y + y0;
    x = xtemp;
    y = ytemp;
    if (x * x + y * y > 4) {
      return i;
    }
  }
  return -1;
}

export function getRainbowColor(iterCount: number) {
  if (iterCount === -1) {
    return "#000";
  } else {
    const hue = iterCount / MAX_ITERATIONS * 360;
    return `hsl(${hue}, 100%, 50%)`;
  }
}

export async function* approachValue(
  start: number,
  target: number,
  steps: number,
  duration: number,
  easing: ((t: number) => number) = t => t
): AsyncGenerator<number> {
  const stepDuration = duration / steps;
  let currentValue = start;

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const normalizedT = easing(t);
    const stepValue = (target - start) * normalizedT + start - currentValue;

    await new Promise((resolve) => setTimeout(resolve, stepDuration));
    currentValue += stepValue;
    yield currentValue;
  }

  yield target;
}