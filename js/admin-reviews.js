// js/admin-reviews.js

document.addEventListener("DOMContentLoaded", () => {
  const reviewsTab = document.querySelector('a[href="#reviews-management"]');
  if (reviewsTab) {
    reviewsTab.addEventListener("shown.bs.tab", loadAdminReviews);
  }
});

async function loadAdminReviews() {
  const tbody = document.getElementById("reviews-table-body");
  if (!tbody) return;

  try {
    const { data: reviews } = await apiFetch(`/api/admin/reviews`);
    tbody.innerHTML = "";

    if (!reviews.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Немає відгуків.</td></tr>`;
      return;
    }

    reviews.forEach((r) => {
      const tr = document.createElement("tr");
      const date = new Date(r.createdat).toLocaleString("uk-UA");
      const userName = r.User ? r.User.name : "Видалений користувач";
      const itemName = r.MenuItem ? r.MenuItem.name : "Видалена страва";

      let stars = "";
      for (let i = 1; i <= 5; i++) {
        stars += i <= r.rating ? "★" : "☆";
      }

      tr.innerHTML = `
        <td>${r.reviewid}</td>
        <td>${userName}</td>
        <td>${itemName}</td>
        <td class="text-warning">${stars}</td>
        <td>${r.comment || "<i>Без коментаря</i>"}</td>
        <td>${date}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger admin-delete-review-btn" data-id="${r.reviewid}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".admin-delete-review-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm("Ви впевнені, що хочете видалити цей відгук?")) {
          try {
            await apiFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
            showToast("Відгук видалено.", "success");
            loadAdminReviews();
          } catch (err) {
            showToast("Не вдалося видалити відгук.", "error");
          }
        }
      });
    });
  } catch (error) {
    console.error("Error loading reviews:", error);
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Помилка завантаження.</td></tr>`;
  }
}
