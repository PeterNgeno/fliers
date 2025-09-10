const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");

const imageUpload = document.getElementById("imageUpload");
const saveBtn = document.getElementById("saveBtn");
const downloadBtn = document.getElementById("downloadBtn");

let templateImg = new Image();
let uploadedImgs = [];

// ---------------- TEMPLATE CONFIG ----------------
const templateConfig = [
  // A. MWAHE
  { key: "A", x: 200, y: 150, font: "bold 156px Rogbold-3IIGM", color: "black" },

  // B. ALTAR
  { key: "B", x: 200, y: 280, font: "bold 47px Arial", color: "goldenrod" },

  // C. Welcomes you to:
  { key: "C", x: 200, y: 360, font: "30px Arial", color: "red" },

  // D. VENUE: Mwahe
  { key: "D", x: 200, y: 420, font: "30px Arial", color: "white" },

  // E. TIME 7:00AM
  { key: "E", x: 200, y: 480, font: "19px Arial", color: "white", bg: "red" },

  // F. Contact info:
  { key: "F", x: 200, y: 550, font: "20px Arial", color: "yellow" },

  // G. Snr Pst Julius Kirui
  { key: "G", x: 200, y: 600, font: "17px Arial", color: "yellow" },

  // H. Phone
  { key: "H", x: 200, y: 650, font: "20px Arial", color: "yellow" }
];

// ---------------- DRAW POSTER ----------------
function drawPoster() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (templateImg.complete && templateImg.src) {
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
  }

  templateConfig.forEach(conf => {
    const input = document.getElementById(`${conf.key}Input`);
    if (input && input.value.trim() !== "") {
      fitText(input.value, conf.font, conf.x, conf.y, conf.color, 1200, conf.bg);
    }
  });

  uploadedImgs.forEach(imgObj => {
    if (imgObj.img.complete) {
      ctx.drawImage(imgObj.img, imgObj.x, imgObj.y, imgObj.w, imgObj.h);
    }
  });
}

// ---------------- FIT TEXT ----------------
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
        uploadedImgs.push({ img, x: 800, y: 100, w: 400, h: 500 });
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
  loadTemplate("images/template1.jpg"); // optional background

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

  drawPoster();
};

// ---------------- DOWNLOAD ----------------
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
