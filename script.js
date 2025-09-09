const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");

const imageUpload = document.getElementById("imageUpload");
const saveBtn = document.getElementById("saveBtn");
const downloadBtn = document.getElementById("downloadBtn");

let templateImg = new Image();
let uploadedImg = null;
let currentTemplate = null;

// Template configurations: positions + styles
const templateConfigs = {
  "images/template1.jpg": [
    { key: "title", label: "Title", x: 400, y: 100, font: "bold 40px Arial", color: "white" },
    { key: "subtitle", label: "Subtitle", x: 400, y: 200, font: "30px Arial", color: "yellow" },
    { key: "contact", label: "Contact", x: 400, y: 300, font: "25px Arial", color: "cyan" }
  ],
  "images/template2.jpg": [
    { key: "eventName", label: "Event Name", x: 200, y: 150, font: "bold 35px Georgia", color: "black" },
    { key: "date", label: "Date", x: 200, y: 250, font: "25px Verdana", color: "red" },
    { key: "venue", label: "Venue", x: 200, y: 350, font: "25px Verdana", color: "blue" }
  ]
};

// Dynamically create input fields
function createInputs(template) {
  const inputDiv = document.querySelector(".inputs");
  inputDiv.innerHTML = ""; // clear old inputs

  templateConfigs[template].forEach(conf => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <label>${conf.label}: <input type="text" id="${conf.key}Input"></label>
    `;
    inputDiv.appendChild(wrapper);

    // Attach listener
    document.getElementById(`${conf.key}Input`).addEventListener("input", drawPoster);
  });
}

// Load template
function loadTemplate(src) {
  templateImg.src = src;
  templateImg.onload = () => drawPoster();
  localStorage.setItem("selectedTemplate", src);
  currentTemplate = src;
  createInputs(src);
}

// Draw poster with positions from config
function drawPoster() {
  if (!currentTemplate) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

  templateConfigs[currentTemplate].forEach(conf => {
    const input = document.getElementById(`${conf.key}Input`);
    if (input && input.value.trim() !== "") {
      ctx.font = conf.font;
      ctx.fillStyle = conf.color;
      ctx.textAlign = "center";
      ctx.fillText(input.value, conf.x, conf.y);
    }
  });

  if (uploadedImg) {
    ctx.drawImage(uploadedImg, canvas.width - 200, canvas.height - 200, 150, 150);
  }
}

// Handle image upload
imageUpload.addEventListener("change", (e) => {
  const reader = new FileReader();
  reader.onload = function(event) {
    uploadedImg = new Image();
    uploadedImg.onload = drawPoster;
    uploadedImg.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Save progress
saveBtn.addEventListener("click", () => {
  const data = { template: currentTemplate, texts: {}, uploadedImg: uploadedImg ? uploadedImg.src : null };
  if (currentTemplate) {
    templateConfigs[currentTemplate].forEach(conf => {
      const input = document.getElementById(`${conf.key}Input`);
      if (input) data.texts[conf.key] = input.value;
    });
  }
  localStorage.setItem("posterData", JSON.stringify(data));
  alert("Progress saved!");
});

// Load saved progress
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("posterData"));
  if (saved) {
    loadTemplate(saved.template);
    setTimeout(() => {
      templateConfigs[saved.template].forEach(conf => {
        const input = document.getElementById(`${conf.key}Input`);
        if (input && saved.texts[conf.key]) input.value = saved.texts[conf.key];
      });
      if (saved.uploadedImg) {
        uploadedImg = new Image();
        uploadedImg.onload = drawPoster;
        uploadedImg.src = saved.uploadedImg;
      }
      drawPoster();
    }, 300);
  } else {
    loadTemplate("images/template1.jpg"); // default
  }
};

// Background selection
document.querySelectorAll(".bg-option").forEach(img => {
  img.addEventListener("click", () => {
    loadTemplate(img.src);
  });
});

// Download poster
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL();
  link.click();
});
