// js/index-page.js

document.addEventListener("DOMContentLoaded", () => {
  loadSpecialMenu();
  loadPromotions();
});

async function loadSpecialMenu() {
  const container = document.getElementById("special-menu-container");
  const loading = document.getElementById("special-menu-loading");
  if (!container) return;

  try {
    const { data: items } = await apiFetch(`/api/menuitems`);

    let totalReviews = 0;
    let sumRatings = 0;
    items.forEach((i) => {
      const c = Number(i.reviewscount) || 0;
      const r = Number(i.rating) || 0;
      totalReviews += c;
      sumRatings += r * c;
    });

    const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

    const heroCount = document.getElementById("hero-reviews-count");
    const heroText = document.getElementById("hero-rating-text");
    const heroStars = document.getElementById("hero-rating-stars");

    if (heroCount)
      heroCount.textContent = totalReviews > 0 ? totalReviews + "+" : "0";
    if (heroText) heroText.textContent = avgRating.toFixed(1) + "/5";
    if (heroStars && typeof buildIndexStarsHtml === "function") {
      heroStars.innerHTML = buildIndexStarsHtml(avgRating);
    }

    // Фільтруємо тільки доступні і беремо перші 6 для головної сторінки
    // Щоб було цікавіше, можна було б додати сортування по рейтингу
    const specialItems = items.filter((i) => i.availability).slice(0, 6);

    if (loading) loading.remove();

    if (!specialItems.length) {
      const msg = document.createElement("div");
      msg.className = "col-12 text-center text-muted";
      msg.textContent = "Наразі немає спеціальних пропозицій.";
      container.appendChild(msg);
      return;
    }

    specialItems.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 col-12 mb-4";

      const imgSrc =
        item.imageurl && item.imageurl !== ""
          ? item.imageurl
          : "images/placeholder.jpg"; // плейсхолдер якщо немає зображення

      const price = Number(item.price).toFixed(2);
      const ratingValue = Number(item.rating) || 0;
      const reviewsCount = Number(item.reviewscount) || 0;

      const starsHtml = buildIndexStarsHtml(ratingValue);

      // Категорія українською для бейджа
      let categoryTag = "Популярне";
      if (item.category === "Pizza") categoryTag = "Піца";
      else if (item.category === "Drink") categoryTag = "Напої";
      else if (item.category === "Dessert") categoryTag = "Десерти";

      col.innerHTML = `
        <div class="menu-thumb h-100">
          <div class="menu-image-wrap" style="cursor: pointer;" onclick='window.openReviewModal(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
              <img src="${imgSrc}" class="img-fluid menu-image" alt="${item.name}" style="height: 250px; object-fit: cover; width: 100%;">
              <span class="menu-tag bg-warning">${categoryTag}</span>
          </div>

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
  } catch (error) {
    console.error("Error loading special menu page:", error);
    if (loading) {
      loading.textContent = "Не вдалося завантажити меню. Спробуйте пізніше.";
      loading.className = "col-12 text-center text-danger";
    }
  }
}

function buildIndexStarsHtml(rating) {
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

async function loadPromotions() {
  const container = document.getElementById("index-news-container");
  if (!container) return;

  try {
    const { data: promotions } = await apiFetch("/api/promotions");

    // Sort and take top 3 active
    const activePromos = promotions
      .filter((p) => p.isactive)
      .sort((a, b) => b.promotionid - a.promotionid)
      .slice(0, 3);

    container.innerHTML = "";

    if (activePromos.length === 0) {
      container.innerHTML =
        '<div class="col-12 text-center text-muted">Наразі немає активних новин чи акцій.</div>';
      return;
    }

    activePromos.forEach((promo) => {
      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 col-12 mb-4";

      let dateStr = "Постійна акція";
      if (promo.startdate && promo.enddate)
        dateStr = `З ${promo.startdate} по ${promo.enddate}`;
      else if (promo.startdate) dateStr = `З ${promo.startdate}`;
      else if (promo.enddate) dateStr = `До ${promo.enddate}`;

      col.innerHTML = `
            <div class="news-thumb shadow-sm p-4 rounded h-100 d-flex flex-column" style="background: #f8f9fa;">
                <span class="category-tag bg-danger mb-2 d-inline-block" style="width: max-content;">Акція</span>
                <h5 class="news-title mt-2">
                    <a href="news-detail.html?id=${promo.promotionid}" class="news-title-link text-dark">${promo.title}</a>
                </h5>
                  <p class="text-muted small mb-3"><i class="bi-calendar me-1"></i> ${dateStr}</p>
                  <div class="mt-auto">
                      <a href="news-detail.html?id=${promo.promotionid}" class="custom-btn btn btn-danger" style="width: max-content;">Читати далі <i class="bi-arrow-right"></i></a>
                  </div>
              </div>
        `;
      container.appendChild(col);
    });
  } catch (error) {
    console.error("Error loading promotions:", error);
    container.innerHTML =
      '<div class="col-12 text-center text-danger">Помилка завантаження новин.</div>';
  }
}
