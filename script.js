const templateConfig = [
  {
    key: "event", // e.g. SUNDAY
    x: 500,
    y: 500,
    font: "bold 100px Impact",
    color: "white"
  },
  {
    key: "eventKind", // e.g. Service
    x: 800,
    y: 600,
    font: "italic 60px Brush Script MT",
    color: "red"
  },
  {
    key: "locationLabel",
    x: 200,
    y: 700,
    font: "bold 25px Arial",
    color: "red"
  },
  {
    key: "location",
    x: 200,
    y: 740,
    font: "25px Arial",
    color: "blue"
  },
  {
    key: "date",
    x: 650,
    y: 700,
    font: "bold 25px Arial",
    color: "navy"
  },
  {
    key: "time",
    x: 650,
    y: 740,
    font: "25px Arial",
    color: "navy"
  },
  {
    key: "contactLabel",
    x: 1150,
    y: 700,
    font: "bold 25px Arial",
    color: "red"
  },
  {
    key: "contacts",
    x: 1150,
    y: 740,
    font: "25px Arial",
    color: "navy"
  }
];

function drawPoster(values) {
  const canvas = document.getElementById("posterCanvas");
  const ctx = canvas.getContext("2d");

  const bg = new Image();
  bg.src = "background.jpg"; // place your background image in project folder

  bg.onload = function () {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // --- STATIC DEFAULT TEXTS ---
    ctx.font = "bold 156px Rogbold-3IIGM";
    ctx.fillStyle = "yellow";
    ctx.fillText("MWAHE", 5, 160);

    ctx.font = "bold 47px Rogbold-3IIGM";
    ctx.fillStyle = "orange";
    ctx.fillText("ALTAR", 5, 220);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Welcomes you to:", 5, 270);

    // --- USER INPUT TEXTS ---
    templateConfig.forEach(cfg => {
      if (values[cfg.key]) {
        ctx.font = cfg.font;
        ctx.fillStyle = cfg.color;
        ctx.fillText(values[cfg.key], cfg.x, cfg.y);
      }
    });
  };
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const form = document.getElementById("posterForm");
  const formData = new FormData(form);
  const values = {};
  formData.forEach((v, k) => values[k] = v);
  drawPoster(values);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const canvas = document.getElementById("posterCanvas");
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL();
  link.click();
});
