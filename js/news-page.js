document.addEventListener("DOMContentLoaded", () => {
  loadAllNews();
});

async function loadAllNews() {
  const container = document.getElementById("all-news-container");
  if (!container) return;

  try {
    const { data: promotions } = await apiFetch("/api/promotions");

    // Show only active promotions, sort newest first (by id desc as a proxy if no created_at exists)
    const activePromos = promotions
      .filter((p) => p.isactive)
      .sort((a, b) => b.promotionid - a.promotionid);

    container.innerHTML = "";

    if (activePromos.length === 0) {
      container.innerHTML =
        '<div class="col-12 text-center text-muted">Наразі немає активних новин чи акцій.</div>';
      return;
    }

    activePromos.forEach((promo) => {
      const col = document.createElement("div");
      col.className = "col-lg-6 col-md-6 col-12 mb-4";

      // Format dates
      let dateStr = "";
      if (promo.startdate && promo.enddate) {
        dateStr = `З ${promo.startdate} по ${promo.enddate}`;
      } else if (promo.startdate) {
        dateStr = `З ${promo.startdate}`;
      } else if (promo.enddate) {
        dateStr = `До ${promo.enddate}`;
      } else {
        dateStr = "Постійна акція";
      }

      col.innerHTML = `
                <div class="news-thumb shadow-sm p-4 rounded h-100 d-flex flex-column" style="background: #f8f9fa;">
                    <div class="news-text-info w-100">
                        <span class="category-tag bg-danger mb-2 d-inline-block">Акція</span>
                        <h5 class="news-title mt-2">
                            <a href="news-detail.html?id=${promo.promotionid}" class="news-title-link text-dark">${promo.title}</a>
                        </h5>
                        <p class="text-muted small mb-3"><i class="bi-calendar me-1"></i> ${dateStr}</p>
                        <p class="mb-4" style="flex-grow: 1;">${promo.description.length > 100 ? promo.description.substring(0, 100) + "..." : promo.description}</p>
                        <a href="news-detail.html?id=${promo.promotionid}" class="custom-btn btn btn-danger mt-auto align-self-start">Читати далі</a>
                    </div>
                </div>
            `;
      container.appendChild(col);
    });
  } catch (error) {
    console.error("Error loading news:", error);
    container.innerHTML =
      '<div class="col-12 text-center text-danger">Помилка завантаження новин.</div>';
  }
}
