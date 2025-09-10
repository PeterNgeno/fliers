const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");

// Preload background image
const bg = new Image();
bg.src = "background.jpg"; // replace with your background file name
let bgLoaded = false;
bg.onload = () => {
  bgLoaded = true;
  drawPoster({});
};

// Template config (user editable fields)
const templateConfig = [
  { key: "event", x: 500, y: 500, font: "bold 100px Impact", color: "white" },
  { key: "eventKind", x: 800, y: 600, font: "italic 60px Brush Script MT", color: "red" },
  { key: "locationLabel", x: 200, y: 700, font: "bold 25px Arial", color: "red" },
  { key: "location", x: 200, y: 740, font: "25px Arial", color: "blue" },
  { key: "date", x: 650, y: 700, font: "bold 25px Arial", color: "navy" },
  { key: "time", x: 650, y: 740, font: "25px Arial", color: "navy" },
  { key: "contactLabel", x: 1150, y: 700, font: "bold 25px Arial", color: "red" },
  { key: "contacts", x: 1150, y: 740, font: "25px Arial", color: "navy" }
];

function drawPoster(values) {
  if (!bgLoaded) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // --- Static default texts ---
  ctx.font = "bold 156px Rogbold-3IIGM";
  ctx.fillStyle = "yellow";
  ctx.fillText("MWAHE", 5, 160);

  ctx.font = "bold 47px Rogbold-3IIGM";
  ctx.fillStyle = "orange";
  ctx.fillText("ALTAR", 5, 220);

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Welcomes you to:", 5, 270);

  // --- User texts ---
  templateConfig.forEach(cfg => {
    if (values[cfg.key]) {
      ctx.font = cfg.font;
      ctx.fillStyle = cfg.color;
      ctx.fillText(values[cfg.key], cfg.x, cfg.y);
    }
  });
}

// Generate button
document.getElementById("generateBtn").addEventListener("click", () => {
  const form = document.getElementById("posterForm");
  const formData = new FormData(form);
  const values = {};
  formData.forEach((v, k) => values[k] = v);
  drawPoster(values);
});

// Download button
document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
