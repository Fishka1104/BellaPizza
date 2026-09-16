// js/cabinet.js
let currentUserId = null;
let editProfileModal = null;

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Щоб відкрити кабінет, спочатку увійдіть у систему.");
    window.location.href = "login.html";
    return;
  }

  console.log("cabinet.js: token знайдено");

  const modalEl = document.getElementById("editProfileModal");
  if (modalEl) {
    editProfileModal = new bootstrap.Modal(modalEl);
  }

  initLogout();
  initProfile(token).then(() => {
    // після того як знаємо userId — вантажимо замовлення
    loadOrders();
  });
  loadDiscounts();
  initEditProfileHandlers();
});

// Вихід з акаунту
function initLogout() {
  const btn = document.getElementById("logout-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    window.location.href = "login.html";
  });
}

// 1. Ініціалізація профілю
async function initProfile(token) {
  try {
    // 1.1. Отримуємо дані з токена
    const { data: me } = await apiFetch(`/api/auth/me`);
    console.log("/api/auth/me:", me);
    currentUserId = me.userid;

    // 1.2. Тягнемо повного користувача з БД
    const { data: user } = await apiFetch(`/api/users/${currentUserId}`);
    console.log("User from /api/users/:id:", user);

    // Підставляємо в аватарку
    document.getElementById("profile-name").textContent =
      user.name || "Користувач";
    document.getElementById("profile-email").textContent = user.email || "";

    // Підставляємо в форму “Особисті дані”
    document.getElementById("personal-name").value = user.name || "";
    document.getElementById("personal-email").value = user.email || "";
    document.getElementById("personal-phone").value = user.phone || "";
    document.getElementById("personal-address").value = user.address || "";
  } catch (error) {
    console.error("initProfile error:", error);
  }
}

// 2. Історія замовлень користувача
async function loadOrders() {
  const list = document.getElementById("orders-list");
  if (!list || !currentUserId) return;

  list.innerHTML = `<li class="list-group-item">Завантаження замовлень...</li>`;

  try {
    const { data: allOrders } = await apiFetch(`/api/orders`);

    const myOrders = allOrders
      .filter((o) => o.userid === currentUserId)
      .sort((a, b) => new Date(b.orderdate) - new Date(a.orderdate));

    list.innerHTML = "";

    if (!myOrders.length) {
      list.innerHTML = `<li class="list-group-item text-muted">У вас ще немає замовлень.</li>`;
      return;
    }

    // Якщо адреса в профілі порожня — спробуємо взяти з останнього замовлення
    const addrInput = document.getElementById("personal-address");
    if (addrInput && !addrInput.value && myOrders[0].deliveryaddress) {
      addrInput.value = myOrders[0].deliveryaddress;
      }

    myOrders.forEach((order) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";

      const date = order.orderdate
        ? new Date(order.orderdate).toLocaleString("uk-UA")
        : "";

      const amount = Number(order.totalamount || 0).toFixed(2);

      let statusClass = "badge bg-secondary";
      if (order.status === "Completed") statusClass = "badge status-completed";
      else if (order.status === "Delivering")
        statusClass = "badge status-delivery";
      else if (order.status === "Preparing")
        statusClass = "badge status-preparing";

      li.innerHTML = `
        <div>
          <div><strong>Замовлення #${order.orderid}</strong></div>
          <small class="text-muted">${date}</small><br>
          <small>Сума: ${amount} грн</small>
        </div>
        <span class="${statusClass}">${order.status}</span>
      `;

      list.appendChild(li);
    });
  } catch (error) {
    console.error("loadOrders error:", error);
    list.innerHTML = `<li class="list-group-item text-danger">Не вдалося завантажити історію замовлень.</li>`;
  }
}

// 3. Всі акції для вкладки “Ваші знижки”
async function loadDiscounts() {
  const container = document.getElementById("discounts-list");
  if (!container) return;

  container.innerHTML = `<p class="text-muted">Завантаження акцій...</p>`;

  try {
    const { data: promotions } = await apiFetch(`/api/promotions`);

    if (!promotions.length) {
      container.innerHTML = `<p class="text-muted">Наразі немає активних акцій.</p>`;
      return;
    }

    container.innerHTML = "";

    promotions.forEach((promo) => {
      const activeBadge = promo.isactive
        ? `<span class="badge bg-success ms-2">Активна</span>`
        : `<span class="badge bg-secondary ms-2">Неактивна</span>`;

      const start = promo.startdate || "";
      const end = promo.enddate || "";
      let period = "";
      if (start && end) period = `${start} — ${end}`;
      else if (start) period = `з ${start}`;
      else if (end) period = `до ${end}`;

      const div = document.createElement("div");
      div.className = "alert alert-success";
      div.innerHTML = `
        <h5 class="alert-heading">${promo.title}${activeBadge}</h5>
        ${promo.description ? `<p>${promo.description}</p>` : ""}
        ${period ? `<p class="mb-0"><small class="text-muted">${period}</small></p>` : ""}
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("loadDiscounts error:", error);
    container.innerHTML = `<p class="text-danger">Не вдалося завантажити акції.</p>`;
  }
}

// 4. Модалка редагування профілю
function initEditProfileHandlers() {
  const btnEdit = document.getElementById("edit-profile-btn");
  const btnSave = document.getElementById("save-profile-btn");
  if (!btnEdit || !btnSave) return;

  btnEdit.addEventListener("click", () => {
    // підставляємо поточні дані в модалку
    document.getElementById("edit-name").value =
      document.getElementById("personal-name").value || "";
    document.getElementById("edit-email").value =
      document.getElementById("personal-email").value || "";
    document.getElementById("edit-phone").value =
      document.getElementById("personal-phone").value || "";
    document.getElementById("edit-address").value =
      document.getElementById("personal-address").value || "";

    document.getElementById("old-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("new-password-confirm").value = "";

    if (editProfileModal) editProfileModal.show();
  });

  btnSave.addEventListener("click", onSaveProfile);
}

async function onSaveProfile() {
  const token = localStorage.getItem("token");
  if (!token || !currentUserId) {
    showToast("Сесія недійсна. Увійдіть ще раз.", "warning");
    window.location.href = "login.html";
    return;
  }

  const name = document.getElementById("edit-name").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();
  const address = document.getElementById("edit-address").value.trim();

  const oldPass = document.getElementById("old-password").value;
  const newPass = document.getElementById("new-password").value;
  const newPass2 = document.getElementById("new-password-confirm").value;

  if (!name || !email) {
    showToast("Ім'я та email є обов'язковими.", "warning");
    return;
  }

  const phoneRegex = /^\+380\d{9}$/;
  if (phone && !phoneRegex.test(phone)) {
    showToast("Номер телефону має бути у форматі +380XXXXXXXXX", "warning");
    return;
  }

  if (newPass || newPass2 || oldPass) {
    if (!oldPass || !newPass || !newPass2) {
      showToast(
        "Для зміни пароля заповніть усі три поля: старий, новий та підтвердження.",
        "warning",
      );
      return;
    }
    if (newPass !== newPass2) {
      showToast("Нові паролі не співпадають.", "warning");
      return;
    }
  }

  try {
    await apiFetch(`/api/users/${currentUserId}`, {
      method: "PUT",
      body: JSON.stringify({ name, email, phone, address }),
    });

    if (oldPass && newPass && newPass2) {
      await apiFetch(`/api/auth/change-password`, {
        method: "POST",
        body: JSON.stringify({
          oldPassword: oldPass,
          newPassword: newPass,
        }),
      });
    }

    document.getElementById("personal-name").value = name;
    document.getElementById("personal-email").value = email;
    document.getElementById("personal-phone").value = phone;
    document.getElementById("personal-address").value = address;

    document.getElementById("profile-name").textContent = name;
    document.getElementById("profile-email").textContent = email;

    showToast("Дані профілю успішно оновлено.", "success");
    if (editProfileModal) editProfileModal.hide();
  } catch (error) {
    if (error.message !== "Unauthorized") {
      showToast(
        error.message || "Сталася помилка при збереженні даних.",
        "error",
      );
    }
  }
}
