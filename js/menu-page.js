// js/menu-page.js

document.addEventListener("DOMContentLoaded", () => {
  loadMenuPage();
});

async function loadMenuPage() {
  try {
    const { data: items } = await apiFetch(`/api/menuitems`);

    const drinks = items.filter(
      (i) => (i.category || "").toLowerCase() === "drink" && i.availability,
    );
    const desserts = items.filter(
      (i) => (i.category || "").toLowerCase() === "dessert" && i.availability,
    );
    const pizza = items.filter(
      (i) => (i.category || "").toLowerCase() === "pizza" && i.availability,
    );

    renderSection("menu-drinks", drinks);
    renderSection("menu-desserts", desserts);
    renderSection("menu-pizza", pizza);
  } catch (error) {
    console.error("Error loading menu page:", error);
    ["menu-drinks", "menu-desserts", "menu-pizza"].forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;
      container.innerHTML = `
        <div class="col-12 text-center text-danger">
          Не вдалося завантажити меню. Спробуйте пізніше.
        </div>
      `;
    });
  }
}

function renderSection(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="col-12 text-center text-muted">
        Наразі немає позицій у цій категорії.
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  items.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 col-12";

    const imgSrc =
      item.imageurl && item.imageurl !== ""
        ? item.imageurl
        : "images/placeholder.jpg"; // можеш додати свій плейсхолдер

    const price =
      typeof item.price === "string" || typeof item.price === "number"
        ? Number(item.price).toFixed(2)
        : item.price;

    const ratingValue = Number(item.rating) || 0;
    const reviewsCount = Number(item.reviewscount) || 0;
    const starsHtml = buildStarsHtml(ratingValue);

    col.innerHTML = `
      <div class="menu-thumb">
        <img src="${imgSrc}" class="img-fluid menu-image" alt="${item.name}" style="height: 250px; object-fit: cover; width: 100%; cursor: pointer;" onclick='window.openReviewModal(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
        <div class="menu-info d-flex flex-wrap align-items-center">
          <h4 class="mb-0">${item.name}</h4>

          <span class="price-tag bg-white shadow-lg ms-4">
            <small>₴</small>${price}
          </span>

          <div class="d-flex flex-wrap align-items-center w-100 mt-2">
            <h6 class="reviews-text mb-0 me-3">${ratingValue.toFixed(1)}/5</h6>

            <div class="reviews-stars">
              ${starsHtml}
            </div>

            <p class="reviews-text mb-0 ms-4">${reviewsCount} Відгуків</p>
          </div>
            <button class="btn btn-outline-danger mt-3 w-100 add-to-cart-btn" data-item='${JSON.stringify(item).replace(/'/g, "&apos;")}'>В кошик</button>
        </div>
      </div>
    `;

    container.appendChild(col);
  });

  // Add to cart listener
  if (!container.dataset.cartBound) {
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart-btn")) {
        const item = JSON.parse(e.target.dataset.item);
        if (typeof cart !== "undefined") cart.addItem(item);
      }
    });
    container.dataset.cartBound = true;
  }
}

function buildStarsHtml(rating) {
  let html = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.3;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      html += '<i class="bi-star-fill reviews-icon"></i>';
    } else if (i === fullStars + 1 && hasHalfStar) {
      html += '<i class="bi-star-half reviews-icon"></i>';
    } else {
      html += '<i class="bi-star reviews-icon"></i>';
    }
  }
  return html;
}
