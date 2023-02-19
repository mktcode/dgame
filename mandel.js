const canvas = document.getElementById("canvas");
canvas.width = 80;
canvas.height = 60;

const ctx = canvas.getContext("2d");
const xmin = -1;
const xmax = 1;
const ymin = -1;
const ymax = 1;
const maxIterations = 1000;

let zoom = 1;
let xOffset = 0;
let yOffset = 0;

function isInMandelbrotSet(x0, y0) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < maxIterations; i++) {
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

function getRainbowColor(iterCount) {
  if (iterCount === -1) {
    return "#000";
  } else {
    const hue = 50 + iterCount / maxIterations * 360;
    return `hsl(${hue}, 100%, 50%)`;
  }
}

function drawMandelbrotSet() {
  const xRange = (xmax - xmin) / zoom;
  const yRange = (ymax - ymin) / zoom;
  const centerX = (xmax + xmin) / 2 + xOffset / canvas.width * xRange;
  const centerY = (ymax + ymin) / 2 + yOffset / canvas.height * yRange;
  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      const x = ((centerX * zoom) + (i / canvas.width - 0.5) * xRange);
      const y = ((centerY * zoom) + (j / canvas.height - 0.5) * yRange);
      const iterCount = isInMandelbrotSet(x, y);
      ctx.fillStyle = getRainbowColor(iterCount);
      if (i === Math.floor(canvas.width / 2) && j === Math.floor(canvas.height / 2)) {
        ctx.fillStyle = "#f00";
      }
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

drawMandelbrotSet();

let shiftIsPressed = false;

const MOVEMENT_FACTOR = 2;
const ZOOM_FACTOR = 1.1;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Shift":
      shiftIsPressed = true;
      break;
    case "ArrowLeft":
      xOffset -= MOVEMENT_FACTOR / zoom
      break;
    case "ArrowRight":
      xOffset += MOVEMENT_FACTOR / zoom
      break;
    case "ArrowUp":
      if (shiftIsPressed) {
        zoom *= ZOOM_FACTOR;
      } else {
        yOffset -= MOVEMENT_FACTOR / zoom
      }
      break;
    case "ArrowDown":
      if (shiftIsPressed) {
        zoom /= ZOOM_FACTOR;
      } else {
        yOffset += MOVEMENT_FACTOR / zoom
      }
      break;
    default:
      return;
  }
  drawMandelbrotSet();
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Shift") {
    shiftIsPressed = false;
  }
});