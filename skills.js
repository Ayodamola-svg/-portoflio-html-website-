// Skills: bars fill, bubbles slide, numbers count up (runs on its own)
(function () {
  function countUp(el, delay) {
    const target = +el.dataset.target;
    const duration = 1800;
    setTimeout(() => {
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const row = entry.target;
      row.classList.add("play");                                        // starts the bar and bubble
      row.querySelectorAll(".skill-count").forEach((el) => countUp(el, 300));
      io.unobserve(row);                                                // plays once
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".skill-row").forEach((row) => io.observe(row));
})();