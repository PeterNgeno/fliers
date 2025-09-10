const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let background = null;
let images = []; // store uploaded images with positions & sizes

// Default placeholders and styles
const placeholders = [
  { key: "region", text: "KERINGET REGION", x: 550, y: 60, maxWidth: 600, font: "30px Arial", color: "white" },
  { key: "title1", text: "MWAHE", x: 550, y: 120, maxWidth: 600, font: "bold 156px Rogbold-3IIGM, Arial", color: "yellow" },
  { key: "title2", text: "ALTAR", x: 550, y: 220, maxWidth: 600, font: "bold 47px Arial", color: "orange" },
  { key: "invitation", text: "WELCOMES YOU TO:", x: 550, y: 270, maxWidth: 600, font: "30px Arial", color: "white" },
  { key: "event", text: "SUNDAY", x: 550, y: 380, maxWidth: 600, font: "bold 150px Arial", color: "white" },
  { key: "eventKind", text: "SERVICE", x: 700, y: 460, maxWidth: 600, font: "italic 70px Brush Script MT, cursive", color: "red" },
  { key: "location", text: "Adjacent to mwaii township", x: 60, y: 570, maxWidth: 400, font: "20px Arial", color: "blue" },
  { key: "date", text: "10TH AUGUST", x: 400, y: 570, maxWidth: 200, font: "20px Arial", color: "blue" },
  { key: "year", text: "2025", x: 400, y: 600, maxWidth: 200, font: "20px Arial", color: "blue" },
  { key: "time", text: "7AM EAT", x: 400, y: 630, maxWidth: 200, font: "20px Arial", color: "blue" },
  { key: "others", text: "CONTACT INFO:", x: 650, y: 570, maxWidth: 400, font: "20px Arial", color: "red" },
  { key: "speaker", text: "Snr pst Julius Kirui", x: 650, y: 600, maxWidth: 400, font: "20px Arial", color: "navy" },
  { key: "contacts", text: "07XXXXXXXX", x: 650, y: 630, maxWidth: 400, font: "20px Arial", color: "navy" }
];

// Store text values
let textValues = {};
placeholders.forEach(ph => textValues[ph.key] = ph.text);

// --- Draw banner ---
function drawBanner() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background
  if (background) ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // draw texts
  placeholders.forEach(ph => {
    drawFittedText(textValues[ph.key], ph.x, ph.y, ph.maxWidth, ph.font, ph.color);
  });

  // draw images
  images.forEach(img => {
    ctx.drawImage(img.image, img.x, img.y, img.width, img.height);
  });
}

// --- Draw fitted text ---
function drawFittedText(text, x, y, maxWidth, font, color) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;

  let size = parseInt(font.match(/\d+/)[0]); // extract size from font string
  ctx.font = font;

  while (ctx.measureText(text).width > maxWidth && size > 10) {
    size -= 2;
    ctx.font = font.replace(/\d+px/, size + "px");
  }

  ctx.fillText(text, x, y);
  ctx.restore();
}

// --- Background upload ---
document.getElementById("bgUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    background = img;
    drawBanner();
  };
  img.src = URL.createObjectURL(file);
});

// --- Add new photo/logo ---
document.getElementById("photoUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    images.push({ image: img, x: 100, y: 100, width: 150, height: 150 });
    drawBanner();
  };
  img.src = URL.createObjectURL(file);
});

// --- Make images draggable ---
let dragging = null;
canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  images.forEach(img => {
    if (mouseX > img.x && mouseX < img.x + img.width && mouseY > img.y && mouseY < img.y + img.height) {
      dragging = { img, offsetX: mouseX - img.x, offsetY: mouseY - img.y };
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    dragging.img.x = e.offsetX - dragging.offsetX;
    dragging.img.y = e.offsetY - dragging.offsetY;
    drawBanner();
  }
});

canvas.addEventListener("mouseup", () => dragging = null);

// --- Download final banner ---
function downloadBanner() {
  const link = document.createElement("a");
  link.download = "banner.png";
  link.href = canvas.toDataURL();
  link.click();
}

// --- Generate text inputs dynamically ---
function generateControls() {
  const controlsDiv = document.getElementById("textControls");
  controlsDiv.innerHTML = "";

  placeholders.forEach(ph => {
    const label = document.createElement("label");
    label.textContent = ph.key.toUpperCase();

    const input = document.createElement("input");
    input.type = "text";
    input.value = ph.text;

    input.addEventListener("input", (e) => {
      textValues[ph.key] = e.target.value;
      drawBanner();
    });

    controlsDiv.appendChild(label);
    controlsDiv.appendChild(input);
  });
}

// Init
generateControls();
drawBanner();
