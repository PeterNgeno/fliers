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
const templateConfigs = {
  "images/template1.jpg": [
    { key: "region", x: 600, y: 70, font: "bold 35px Arial", color: "white" },
    { key: "title", x: 600, y: 140, font: "bold 50px Arial", color: "yellow" },
    { key: "invitation", x: 600, y: 190, font: "25px Arial", color: "white" },
    { key: "event", x: 750, y: 300, font: "bold 90px Impact", color: "white" },
    { key: "eventKind", x: 900, y: 380, font: "italic 60px Brush Script MT", color: "red" },
    { key: "location", x: 200, y: 600, font: "25px Arial", color: "blue" },
    { key: "date", x: 550, y: 600, font: "25px Arial", color: "blue" },
    { key: "year", x: 750, y: 600, font: "25px Arial", color: "blue" },
    { key: "time", x: 950, y: 600, font: "25px Arial", color: "blue" },
    { key: "others", x: 200, y: 650, font: "25px Arial", color: "red" },
    { key: "speaker", x: 600, y: 650, font: "25px Arial", color: "navy" },
    { key: "contacts", x: 1000, y: 650, font: "25px Arial", color: "navy" }
  ]
};

// ---------------- DRAW POSTER ----------------
function drawPoster() {
  // Always redraw background first
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (templateImg.complete) {
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
  }

  // Draw all texts
  templateConfigs["images/template1.jpg"].forEach(conf => {
    const input = document.getElementById(`${conf.key}Input`);
    if (input && input.value.trim() !== "") {
      fitText(input.value, conf.font, conf.x, conf.y, conf.color, 400);
    }
  });

  // Draw all uploaded images
  uploadedImgs.forEach(imgObj => {
    if (imgObj.img.complete) {
      ctx.drawImage(imgObj.img, imgObj.x, imgObj.y, imgObj.w, imgObj.h);

      // Active selection with resize handle
      if (imgObj === activeImg) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(imgObj.x, imgObj.y, imgObj.w, imgObj.h);

        ctx.fillStyle = "white";
        ctx.fillRect(
          imgObj.x + imgObj.w - resizeHandleSize,
          imgObj.y + imgObj.h - resizeHandleSize,
          resizeHandleSize,
          resizeHandleSize
        );
        ctx.strokeRect(
          imgObj.x + imgObj.w - resizeHandleSize,
          imgObj.y + imgObj.h - resizeHandleSize,
          resizeHandleSize,
          resizeHandleSize
        );
      }
    }
  });
}

// ---------------- AUTO RESIZE TEXT ----------------
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
        uploadedImgs.push({ img, x: 900, y: 100, w: 200, h: 200 });
        drawPoster();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
});

// ---------------- IMAGE MOVE/RESIZE ----------------
function insideResizeHandle(img, mx, my) {
  return mx > img.x + img.w - resizeHandleSize &&
         mx < img.x + img.w &&
         my > img.y + img.h - resizeHandleSize &&
         my < img.y + img.h;
}

canvas.addEventListener("mousedown", e => {
  const mx = e.offsetX, my = e.offsetY;
  activeImg = null;
  for (let i = uploadedImgs.length - 1; i >= 0; i--) {
    let img = uploadedImgs[i];
    if (insideResizeHandle(img, mx, my)) {
      activeImg = img;
      resizing = true;
      return;
    } else if (mx > img.x && mx < img.x + img.w && my > img.y && my < img.y + img.h) {
      activeImg = img;
      dragging = true;
      offsetX = mx - img.x;
      offsetY = my - img.y;
      return;
    }
  }
});

canvas.addEventListener("mousemove", e => {
  if (!activeImg) return;
  const mx = e.offsetX, my = e.offsetY;

  if (dragging) {
    activeImg.x = mx - offsetX;
    activeImg.y = my - offsetY;
    drawPoster();
  } else if (resizing) {
    activeImg.w = Math.max(50, mx - activeImg.x);
    activeImg.h = Math.max(50, my - activeImg.y);
    drawPoster();
  }
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
  resizing = false;
});

canvas.addEventListener("mouseout", () => {
  dragging = false;
  resizing = false;
});

// ---------------- SAVE/LOAD ----------------
saveBtn.addEventListener("click", () => {
  const data = { texts: {}, uploadedImgs: uploadedImgs.map(i => ({src: i.img.src, x: i.x, y: i.y, w: i.w, h: i.h})) };
  templateConfigs["images/template1.jpg"].forEach(conf => {
    const input = document.getElementById(`${conf.key}Input`);
    if (input) data.texts[conf.key] = input.value;
  });
  localStorage.setItem("posterData", JSON.stringify(data));
  alert("Progress saved!");
});

window.onload = () => {
  loadTemplate("images/template1.jpg");
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
  link.href = canvas.toDataURL();
  link.click();
});
