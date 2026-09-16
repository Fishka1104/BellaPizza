// js/custom.js

document.addEventListener("DOMContentLoaded", () => {
  // Закриття мобільного меню при кліці на посилання
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const collapseEl = document.querySelector(".navbar-collapse");
      if (collapseEl && collapseEl.classList.contains("show")) {
        if (typeof bootstrap !== "undefined") {
          const bsCollapse =
            bootstrap.Collapse.getInstance(collapseEl) ||
            new bootstrap.Collapse(collapseEl);
          bsCollapse.hide();
        }
      }
    });
  });
});
