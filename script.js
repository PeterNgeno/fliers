const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");

const imageUpload = document.getElementById("imageUpload");
const saveBtn = document.getElementById("saveBtn");
const downloadBtn = document.getElementById("downloadBtn");

let templateImg = new Image();
let uploadedImgs = [];
let activeImg = null;
let dragging = false;
let resizing = false;
let offsetX, offsetY;
let resizeHandleSize = 15;

// ---------------- TEMPLATE CONFIG ----------------
const templateConfig = [
  { key: "region", x: 1100, y: 60, font: "bold 28px Arial", color: "white" },
  { key: "altar", x: 1100, y: 110, font: "bold 40px Arial", color: "yellow" },
  { key: "invitation", x: 1100, y: 150, font: "20px Arial", color: "white" },
  { key: "event", x: 1100, y: 300, font: "bold 100px Impact", color: "white" },
  { key: "eventKind", x: 1250, y: 380, font: "italic 60px Brush Script MT", color: "red" },
  { key: "locationLabel", x: 200, y: 600, font: "bold 25px Arial", color: "red" },
  { key: "location", x: 200, y: 640, font: "25px Arial", color: "blue" },
  { key: "date", x: 700, y: 600, font: "bold 25px Arial", color: "navy" },
  { key: "time", x: 700, y: 640, font: "25px Arial", color: "navy" },
  { key: "contactLabel", x: 1150, y: 600, font: "bold 25px Arial", color: "red" },
  { key: "contacts", x: 1150, y: 640, font: "25px Arial", color: "navy" }
];

// ---------------- DRAW POSTER ----------------
function drawPoster() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (templateImg.complete) {
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
  }

  templateConfig.forEach(conf => {
    const input = document.getElementById(`${conf.key}Input`);
    if (input && input.value.trim() !== "") {
      fitText(input.value, conf.font, conf.x, conf.y, conf.color, 500);
    }
  });

  uploadedImgs.forEach(imgObj => {
    if (imgObj.img.complete) {
      ctx.drawImage(imgObj.img, imgObj.x, imgObj.y, imgObj.w, imgObj.h);
    }
  });
}

// ---------------- FIT TEXT ----------------
function fitText(text, font, x, y, color, maxWidth) {
  let size = parseInt(font.match(/\d+/)[0]);
  let fontName = font.replace(/\d+px /, "");
  ctx.font = font;
  while (ctx.measureText(text).width > maxWidth && size > 10) {
    size -= 2;
    ctx.font = `bold ${size}px ${fontName}`;
  }
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

// ---------------- LOAD TEMPLATE ----------------
function loadTemplate(src) {
  templateImg = new Image();
  templateImg.onload = drawPoster;
  templateImg.src = src;
}

// ---------------- IMAGE UPLOAD ----------------
imageUpload.addEventListener("change", (e) => {
  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = () => {
        uploadedImgs.push({ img, x: 50, y: 100, w: 400, h: 500 });
        drawPoster();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
});

// ---------------- SAVE ----------------
saveBtn.addEventListener("click", () => {
  const data = { texts: {}, uploadedImgs: uploadedImgs.map(i => ({src: i.img.src, x: i.x, y: i.y, w: i.w, h: i.h})) };
  templateConfig.forEach(conf => {
    const input = document.getElementById(`${conf.key}Input`);
    if (input) data.texts[conf.key] = input.value;
  });
  localStorage.setItem("posterData", JSON.stringify(data));
  alert("✅ Progress saved!");
});

// ---------------- LOAD ----------------
window.onload = () => {
  loadTemplate("images/template1.jpg");

  // Listen for input changes
  templateConfig.forEach(conf => {
    const input = document.getElementById(`${conf.key}Input`);
    if (input) input.addEventListener("input", drawPoster);
  });

  const saved = JSON.parse(localStorage.getItem("posterData"));
  if (saved) {
    Object.keys(saved.texts).forEach(key => {
      const input = document.getElementById(`${key}Input`);
      if (input) input.value = saved.texts[key];
    });
    uploadedImgs = [];
    saved.uploadedImgs.forEach(d => {
      const img = new Image();
      img.onload = () => {
        uploadedImgs.push({ img, x: d.x, y: d.y, w: d.w, h: d.h });
        drawPoster();
      };
      img.src = d.src;
    });
  }
};

// ---------------- DOWNLOAD ----------------
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
