// ---------- GALLERY: reveal pictures when they scroll into view ----------
const galleryImages = document.querySelectorAll(".gallery-grid img");

const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");        // starts the animation
      galleryObserver.unobserve(entry.target); // only plays once
    }
  });
}, { threshold: 0.15 });

galleryImages.forEach((img, i) => {
  img.classList.add("reveal");
  img.style.setProperty("--delay", (i % 3) * 0.12 + "s"); // staggered: 0s, 0.12s, 0.24s
  galleryObserver.observe(img);
});