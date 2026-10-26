// 3D tilt: the card leans toward the pointer (mouse or finger)
document.querySelectorAll(".stat-card").forEach((card) => {
  const maxTilt = 14;                       // degrees: higher = stronger tilt

  card.addEventListener("pointermove", (e) => {
    const box = card.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width  - 0.5;   // -0.5 (left) to 0.5 (right)
    const y = (e.clientY - box.top)  / box.height - 0.5;   // -0.5 (top) to 0.5 (bottom)
    card.style.setProperty("--ry", `${x * maxTilt * 2}deg`);    // left/right lean
    card.style.setProperty("--rx", `${-y * maxTilt * 2}deg`);   // up/down lean
  });

  // Back to flat when the pointer leaves or the touch ends
  ["pointerleave", "pointerup", "pointercancel"].forEach((evt) => {
    card.addEventListener(evt, () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
});

// ---------- IMAGE LIGHTBOX WITH GALLERY (builds its own popup) ----------
const lightbox = document.createElement("div");
lightbox.className = "image-modal";
lightbox.innerHTML = `
  <button class="image-close" aria-label="Close">✕</button>
  <button class="nav-btn prev" aria-label="Previous image">‹</button>
  <img alt="" />
  <button class="nav-btn next" aria-label="Next image">›</button>
  <div class="img-counter"></div>`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector("img");
const counter = lightbox.querySelector(".img-counter");
const navBtns = lightbox.querySelectorAll(".nav-btn");

let images = [];
let index = 0;

function showImage(i) {
  index = (i + images.length) % images.length;     // loops around at both ends
  lightboxImg.src = images[index];
  counter.textContent = images.length > 1 ? `${index + 1} / ${images.length}` : "";
}

function openLightbox(list, alt, start = 0) {
  images = list;
  lightboxImg.alt = alt;
  navBtns.forEach((b) => (b.style.display = images.length > 1 ? "grid" : "none"));
  showImage(start);
  lightbox.classList.add("open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightboxImg.removeAttribute("src");
}

// Click a card picture: open it (with its whole gallery if it has one)
document.addEventListener("click", (e) => {
  const img = e.target.closest(".project-grid .card:not(.video-card) .thumb img");
  if (!img) return;
  const list = img.dataset.gallery
    ? img.dataset.gallery.split(",").map((s) => s.trim())
    : [img.dataset.full || img.currentSrc || img.src];
  openLightbox(list, img.alt);
});

// Buttons, background click, keyboard
lightbox.querySelector(".prev").addEventListener("click", () => showImage(index - 1));
lightbox.querySelector(".next").addEventListener("click", () => showImage(index + 1));
lightbox.querySelector(".image-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showImage(index - 1);
  if (e.key === "ArrowRight") showImage(index + 1);
});

// Swipe left/right on phones
let touchX = 0;
lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; });
lightbox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showImage(dx < 0 ? index + 1 : index - 1);
});