// js/api.js

function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";
    toastContainer.style.zIndex = "1055";
    document.body.appendChild(toastContainer);
  }

  const bgClass =
    type === "success"
      ? "bg-success text-white"
      : type === "error"
        ? "bg-danger text-white"
        : type === "warning"
          ? "bg-warning"
          : "bg-info text-white";

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center border-0 ${bgClass}`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

  toastContainer.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.remove();
  });
}

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE}${endpoint}`;
    const response = await fetch(url, config);

    if (response.status === 401) {
      showToast("Сесія завершена. Увійдіть ще раз.", "error");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      throw new Error("Unauthorized");
    }

    // Try parsing JSON, fallback to empty object if it fails (e.g. DELETE requests)
    let data = {};
    try {
      data = await response.json();
    } catch (e) {}

    if (!response.ok) {
      throw new Error(data.message || `Помилка сервера: ${response.status}`);
    }

    return { response, data };
  } catch (error) {
    if (error.message !== "Unauthorized") {
      console.error("API Error:", error);
    }
    throw error;
  }
}
