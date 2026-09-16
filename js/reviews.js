// js/reviews.js

let currentReviewItemId = null;
let selectedRating = 0;

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("ReviewModal");
  if (!modalEl) return;

  const reviewModal = new bootstrap.Modal(modalEl);

  // Expose function globally to be called from menu-page.js / index-page.js
  window.openReviewModal = async (item) => {
    currentReviewItemId = item.menuitemid;

    // Fill basic info
    document.getElementById("review-item-name").textContent = item.name;
    document.getElementById("review-item-img").src =
      item.imageurl || "images/placeholder.jpg";

    const ratingValue = Number(item.rating) || 0;
    const reviewsCount = Number(item.reviewscount) || 0;
    document.getElementById("review-item-rating").textContent =
      ratingValue.toFixed(1) + "/5";
    document.getElementById("review-item-stars").innerHTML =
      typeof buildStarsHtml === "function"
        ? buildStarsHtml(ratingValue)
        : buildIndexStarsHtml(ratingValue);
    document.getElementById("review-item-count").textContent = reviewsCount;

    // Reset form
    selectedRating = 0;
    document.getElementById("review-rating-val").value = "0";
    document.getElementById("review-comment-val").value = "";
    updateStarUI(0);

    // Check auth
    const token = localStorage.getItem("token");
    if (token) {
      document.getElementById("review-auth-warning").classList.add("d-none");
      document.getElementById("add-review-form").classList.remove("d-none");
    } else {
      document.getElementById("review-auth-warning").classList.remove("d-none");
      document.getElementById("add-review-form").classList.add("d-none");
    }

    // Open modal
    reviewModal.show();

    // Load reviews
    await fetchItemReviews(currentReviewItemId);
  };

  // Star hover/click logic
  const stars = document.querySelectorAll(".star-rate");
  stars.forEach((star) => {
    star.addEventListener("mouseover", (e) => {
      const val = parseInt(e.target.dataset.val);
      updateStarUI(val);
    });
    star.addEventListener("mouseout", () => {
      updateStarUI(selectedRating);
    });
    star.addEventListener("click", (e) => {
      selectedRating = parseInt(e.target.dataset.val);
      document.getElementById("review-rating-val").value = selectedRating;
      updateStarUI(selectedRating);
    });
  });

  // Form submit logic
  const form = document.getElementById("add-review-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (selectedRating === 0) {
      showToast(
        "Будь ласка, оберіть кількість зірочок (від 1 до 5).",
        "warning",
      );
      return;
    }

    const comment = document.getElementById("review-comment-val").value.trim();
    const submitBtn = document.getElementById("submit-review-btn");
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Відправка...';

    try {
      const res = await apiFetch(
        `/api/menuitems/${currentReviewItemId}/reviews`,
        {
          method: "POST",
          body: JSON.stringify({ rating: selectedRating, comment }),
        },
      );

      showToast("Дякуємо за ваш відгук!", "success");
      form.reset();
      selectedRating = 0;
      updateStarUI(0);

      // Reload reviews
      await fetchItemReviews(currentReviewItemId);

      // Note: In a real app, we would also update the item in the DOM or reload the menu
    } catch (err) {
      showToast(err.message || "Помилка відправки відгуку.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Надіслати відгук";
    }
  });
});

function updateStarUI(val) {
  const stars = document.querySelectorAll(".star-rate");
  stars.forEach((star) => {
    const sVal = parseInt(star.dataset.val);
    if (sVal <= val) {
      star.classList.replace("bi-star", "bi-star-fill");
    } else {
      star.classList.replace("bi-star-fill", "bi-star");
    }
  });
}

async function fetchItemReviews(itemId) {
  const container = document.getElementById("reviews-list-container");
  container.innerHTML =
    '<div class="text-center mt-3"><span class="spinner-border spinner-border-sm text-danger"></span> Завантаження...</div>';

  try {
    const { data: reviews } = await apiFetch(
      `/api/menuitems/${itemId}/reviews`,
    );

    if (!reviews || reviews.length === 0) {
      container.innerHTML =
        '<p class="text-muted text-center mt-4 mb-4">Ще немає відгуків. Будьте першим!</p>';
      return;
    }

    let html = "";
    reviews.forEach((r) => {
      const date = new Date(r.createdat).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const name = r.User ? r.User.name : "Невідомий";
      let stars = "";
      for (let i = 1; i <= 5; i++) {
        stars +=
          i <= r.rating
            ? '<i class="bi-star-fill text-warning"></i>'
            : '<i class="bi-star text-warning"></i>';
      }

      html += `
        <div class="card mb-3 border-0 bg-light">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <strong class="mb-0"><i class="bi-person-circle me-2"></i>${name}</strong>
              <small class="text-muted">${date}</small>
            </div>
            <div class="mb-2" style="font-size: 0.9rem;">${stars}</div>
            <p class="mb-0 text-dark" style="font-size: 0.95rem;">${r.comment || "<i>Без коментаря</i>"}</p>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML =
      '<p class="text-danger text-center mt-3">Не вдалося завантажити відгуки.</p>';
  }
}
