const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");

// --- Template config for A → H ---
const templateConfig = [
  { key: "a", font: "bold 156px Rogbold-3IIGM", color: "black", y: 150 },
  { key: "b", font: "bold 47px Arial", color: "goldenrod", y: 250 },
  { key: "c", font: "30px Arial", color: "red", y: 330 },
  { key: "d", font: "30px Arial", color: "white", y: 410 },
  { key: "e", font: "19px Arial", color: "white", bg: "red", y: 490 },
  { key: "f", font: "20px Arial", color: "yellow", y: 560 },
  { key: "g", font: "17px Arial", color: "yellow", y: 610 },
  { key: "h", font: "20px Arial", color: "yellow", y: 660 }
];

// --- Draw function with background support ---
function fitText(text, font, x, y, color, maxWidth, bg) {
  let size = parseInt(font.match(/\d+/)[0]);
  let fontName = font.replace(/\d+px /, "");
  ctx.font = font;
  while (ctx.measureText(text).width > maxWidth && size > 10) {
    size -= 2;
    ctx.font = `bold ${size}px ${fontName}`;
  }

  const textWidth = ctx.measureText(text).width;
  const textHeight = size * 1.2;

  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(x - textWidth / 2 - 10, y - textHeight + 10, textWidth + 20, textHeight);
  }

  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

// --- Draw Poster ---
function drawPoster() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  templateConfig.forEach(conf => {
    const input = document.getElementById(`${conf.key}Input`);
    if (input && input.value.trim() !== "") {
      fitText(input.value, conf.font, canvas.width / 2, conf.y, conf.color, 1200, conf.bg);
    }
  });
}

// --- Download ---
function downloadPoster() {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL();
  link.click();
}

// --- Live update ---
document.querySelectorAll("input").forEach(inp => {
  inp.addEventListener("input", drawPoster);
});

// --- Initial draw ---
drawPoster();
