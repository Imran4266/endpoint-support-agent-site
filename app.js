const header = document.querySelector(".site-header");

const updateHeaderState = () => {
  if (!header) return;
  header.dataset.elevated = window.scrollY > 12 ? "true" : "false";
};

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();
