// Template configurations
const templateConfigs = {
  "images/mwahe.jpg": [
    { 
      key: "mwahe", 
      label: "MWAHE", 
      x: 5, y: 156, 
      font: "bold 156px Rogbold-3IIGM, Arial", 
      color: "black", 
      default: "MWAHE" 
    },
    { 
      key: "altar", 
      label: "ALTAR", 
      x: 5, y: 230, 
      font: "bold 47px Arial", 
      color: "black", 
      default: "ALTAR" 
    },
    { 
      key: "welcome", 
      label: "Welcomes You To:", 
      x: 5, y: 300, 
      font: "30px Arial", 
      color: "black", 
      default: "Welcomes you to:" 
    }
  ]
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let background = null;
let photo = null;
let activeTemplate = null;
let textValues = {}; // stores user-modified text

// Load template
function loadTemplate(templatePath) {
  const config = templateConfigs[templatePath];
  if (!config) return;

  // reset values
  textValues = {};
  activeTemplate = config;

  config.forEach(item => {
    textValues[item.key] = item.default;
  });

  // draw with background
  const img = new Image();
  img.onload = () => {
    background = img;
    drawBanner();
    generateControls(config);
  };
  img.src = templatePath;
}

// Draw banner
function drawBanner() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  if (background) ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Extra uploaded photo
  if (photo) ctx.drawImage(photo, 500, 200, 200, 200);

  // Texts from template
  if (activeTemplate) {
    activeTemplate.forEach(item => {
      ctx.font = item.font;
      ctx.fillStyle = item.color;
      ctx.fillText(textValues[item.key], item.x, item.y);
    });
  }
}

// Generate input controls dynamically
function generateControls(config) {
  const controlsDiv = document.getElementById("textControls");
  controlsDiv.innerHTML = "";

  config.forEach(item => {
    const label = document.createElement("label");
    label.textContent = item.label;

    const input = document.createElement("input");
    input.type = "text";
    input.value = item.default;

    input.addEventListener("input", (e) => {
      textValues[item.key] = e.target.value;
      drawBanner();
      saveToLocalStorage();
    });

    controlsDiv.appendChild(label);
    controlsDiv.appendChild(input);
  });
}

// Upload custom background
document.getElementById("bgUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    background = img;
    activeTemplate = null; // disable template for custom bg
    drawBanner();
  };
  img.src = URL.createObjectURL(file);
});

// Upload custom photo
document.getElementById("photoUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    photo = img;
    drawBanner();
  };
  img.src = URL.createObjectURL(file);
});

// Download banner
function downloadBanner() {
  const link = document.createElement("a");
  link.download = "banner.png";
  link.href = canvas.toDataURL();
  link.click();
}

// Save to local storage
function saveToLocalStorage() {
  localStorage.setItem("bannerTexts", JSON.stringify(textValues));
}

// Load from local storage
function loadFromLocalStorage() {
  const saved = localStorage.getItem("bannerTexts");
  if (saved && activeTemplate) {
    textValues = JSON.parse(saved);
    drawBanner();
  }
}

// Initialize with default template
loadTemplate("images/mwahe.jpg");
