const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");

const titleInput = document.getElementById("titleInput");
const subtitleInput = document.getElementById("subtitleInput");
const contactInput = document.getElementById("contactInput");
const imageUpload = document.getElementById("imageUpload");

const saveBtn = document.getElementById("saveBtn");
const downloadBtn = document.getElementById("downloadBtn");

let templateImg = new Image();
let uploadedImg = null;

// Load template
function loadTemplate(src) {
  templateImg.src = src;
  templateImg.onload = () => drawPoster();
  localStorage.setItem("selectedTemplate", src);
}

// Draw poster
function drawPoster() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

  // Title
  ctx.font = "bold 40px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(titleInput.value, canvas.width / 2, 100);

  // Subtitle
  ctx.font = "30px Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText(subtitleInput.value, canvas.width / 2, 180);

  // Contact
  ctx.font = "25px Arial";
  ctx.fillStyle = "cyan";
  ctx.fillText(contactInput.value, canvas.width / 2, 250);

  // Uploaded Image
  if (uploadedImg) {
    ctx.drawImage(uploadedImg, canvas.width - 200, canvas.height - 200, 150, 150);
  }
}

// Handle text input
[titleInput, subtitleInput, contactInput].forEach(input => {
  input.addEventListener("input", drawPoster);
});

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
  const data = {
    title: titleInput.value,
    subtitle: subtitleInput.value,
    contact: contactInput.value,
    template: localStorage.getItem("selectedTemplate"),
    uploadedImg: uploadedImg ? uploadedImg.src : null
  };
  localStorage.setItem("posterData", JSON.stringify(data));
  alert("Progress saved!");
});

// Load saved progress
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("posterData"));
  if (saved) {
    titleInput.value = saved.title;
    subtitleInput.value = saved.subtitle;
    contactInput.value = saved.contact;
    if (saved.template) loadTemplate(saved.template);
    if (saved.uploadedImg) {
      uploadedImg = new Image();
      uploadedImg.onload = drawPoster;
      uploadedImg.src = saved.uploadedImg;
    }
    drawPoster();
  } else {
    loadTemplate("images/template1.jpg"); // default
  }
};

// Background selection
document.querySelectorAll(".bg-option").forEach(img => {
  img.addEventListener("click", () => {
    loadTemplate(img.src);
    drawPoster();
  });
});

// Download poster
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL();
  link.click();
});
