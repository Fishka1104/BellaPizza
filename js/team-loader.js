document.addEventListener("DOMContentLoaded", () => {
  initTeamLoader();
});

function initTeamLoader() {
  const loadBtn = document.getElementById("load-team-btn");
  const statusContainer = document.getElementById("team-status-indicator");
  const cardsContainer = document.getElementById("team-cards-container");

  if (!loadBtn || !cardsContainer) return;

  // Ролі для членів команди BellaPizza
  const teamRoles = [
    { role: "Шеф-піцайоло", badgeClass: "bg-danger text-white", desc: "Автор фірмових рецептів тіста" },
    { role: "Су-шеф", badgeClass: "bg-warning text-dark", desc: "Контроль якості італійських продуктів" },
    { role: "Майстер дров'яної печі", badgeClass: "bg-danger text-white", desc: "Випікання при температурі 400°C" },
    { role: "Керуючий залу", badgeClass: "bg-primary text-white", desc: "Італійська гостинність та затишок" },
    { role: "Старший кур'єр", badgeClass: "bg-success text-white", desc: "Швидка доставка гарячої піци до 30 хв" }
  ];

  loadBtn.addEventListener("click", () => {
    fetchTeamMembers(loadBtn, statusContainer, cardsContainer, teamRoles);
  });
}

/**
 * Отримання даних з зовнішнього API за допомогою fetch та об'єкта Promise
 * Демонстрація концепцій: Fetch API, Promise (.then, .catch), JSON-парсинг
 */
function fetchTeamMembers(loadBtn, statusContainer, cardsContainer, teamRoles) {
  // 1. Стан очікування (Promise Pending)
  loadBtn.disabled = true;
  if (statusContainer) {
    statusContainer.classList.remove("d-none");
    statusContainer.innerHTML = `
      <div class="team-status-box text-danger d-inline-flex align-items-center gap-2">
        <div class="spinner-border spinner-border-sm text-danger" role="status">
          <span class="visually-hidden">Завантаження...</span>
        </div>
        <span class="fw-semibold">Запит до зовнішнього API (Promise: pending)...</span>
      </div>
    `;
  }

  // Зовнішній ендпоінт публічного API
  const API_URL = "https://randomuser.me/api/?results=5&inc=picture,name,email,phone,cell,location&noinfo";

  // 2. Виклик глобального методу fetch(), який повертає об'єкт Promise
  fetch(API_URL)
    .then((response) => {
      // Перевірка HTTP-статусу відповіді
      if (!response.ok) {
        throw new Error(`HTTP помилка сервера! Статус: ${response.status}`);
      }
      // Метод response.json() повертає новий Promise, який декодує тіло відповіді у формат JSON
      return response.json();
    })
    .then((jsonData) => {
      // 3. Успішне завершення Promise (Promise Resolved / Fulfilled)
      console.log("Отримані дані з randomuser.me (формат JSON):", jsonData);

      if (!jsonData || !Array.isArray(jsonData.results) || jsonData.results.length === 0) {
        throw new Error("Некоректна структура даних JSON або порожній масив результатів.");
      }

      // Відображення статусу успіху
      if (statusContainer) {
        statusContainer.innerHTML = `
          <span class="badge bg-success py-2 px-3 fs-6 status-badge-success d-inline-flex align-items-center gap-2 shadow-sm">
            <i class="bi bi-check-circle-fill"></i> Успішно! (success)
          </span>
        `;
      }

      // Оновлення тексту кнопки
      loadBtn.innerHTML = `<i class="bi bi-arrow-repeat me-2"></i>Оновити склад команди`;
      loadBtn.disabled = false;

      // 4. Рендеринг 5 карток на основі зчитаного JSON
      renderTeamCards(jsonData.results, cardsContainer, teamRoles);
    })
    .catch((error) => {
      // 5. Обробка помилок виконання (Promise Rejected)
      console.error("Помилка при завантаженні даних через fetch():", error);

      if (statusContainer) {
        statusContainer.innerHTML = `
          <span class="badge bg-danger py-2 px-3 fs-6 d-inline-flex align-items-center gap-2 shadow-sm">
            <i class="bi bi-exclamation-triangle-fill"></i> Помилка запиту: ${error.message}
          </span>
        `;
      }

      cardsContainer.innerHTML = `
        <div class="col-12 text-center py-4">
          <div class="alert alert-warning d-inline-block text-start p-4 shadow-sm" role="alert">
            <h5 class="alert-heading text-danger"><i class="bi bi-wifi-off me-2"></i>Не вдалося зв'язатися з зовнішнім сервером API</h5>
            <p class="mb-2">Перевірте підключення до мережі Інтернет або спробуйте пізніше.</p>
            <hr>
            <p class="mb-0 text-muted small">Деталі помилки: <code>${error.message}</code></p>
          </div>
        </div>
      `;

      loadBtn.disabled = false;
      loadBtn.innerHTML = `<i class="bi bi-arrow-clockwise me-2"></i>Спробувати знову`;
    });
}

/**
 * Побудова HTML-розмітки карток із вилученням обов'язкових полів:
 * 1. picture (фото)
 * 2. name (ім'я та прізвище)
 * 3. cell (мобільний номер)
 * 4. city (місто)
 * 5. country (країна)
 * 6. postcode (поштовий індекс)
 * 7. email (електронна адреса)
 * 8. phone (стаціонарний телефон)
 * 9. coordinates (координати: широта/довгота)
 */
function renderTeamCards(users, container, roles) {
  container.innerHTML = "";

  users.forEach((user, index) => {
    const roleInfo = roles[index] || {
      role: "Спеціаліст ресторану",
      badgeClass: "bg-secondary text-white",
      desc: "Команда BellaPizza"
    };

    const fullName = `${user.name.title ? user.name.title + " " : ""}${user.name.first} ${user.name.last}`;
    const avatarUrl = user.picture?.large || "images/author/default-avatar.png";
    const city = user.location?.city || "Не вказано";
    const country = user.location?.country || "Не вказано";
    const postcode = user.location?.postcode || "—";
    const coordinates = user.location?.coordinates
      ? `${parseFloat(user.location.coordinates.latitude).toFixed(2)}, ${parseFloat(user.location.coordinates.longitude).toFixed(2)}`
      : "—";
    const email = user.email || "—";
    const phone = user.phone || "—";
    const cell = user.cell || "—";

    const col = document.createElement("div");
    col.className = "col-xl-4 col-lg-6 col-md-6 col-12 d-flex";

    col.innerHTML = `
      <div class="team-card w-100 shadow-sm">
        <div class="team-avatar-wrap">
          <img src="${avatarUrl}" alt="${fullName}" class="team-avatar" loading="lazy">
          <span class="team-badge-role ${roleInfo.badgeClass}">${roleInfo.role}</span>
        </div>

        <div class="team-card-body">
          <h4 class="team-card-name">${fullName}</h4>
          <div class="team-card-specialty">${roleInfo.desc}</div>

          <ul class="team-info-list">
            <li class="team-info-item" title="Мобільний телефон">
              <i class="bi bi-phone"></i>
              <div><span class="team-info-label">Мобільний:</span> ${cell}</div>
            </li>
            <li class="team-info-item" title="Контактний телефон">
              <i class="bi bi-telephone"></i>
              <div><span class="team-info-label">Телефон:</span> ${phone}</div>
            </li>
            <li class="team-info-item" title="Електронна пошта">
              <i class="bi bi-envelope"></i>
              <div><span class="team-info-label">Email:</span> <a href="mailto:${email}" class="text-decoration-none text-muted">${email}</a></div>
            </li>
            <li class="team-info-item" title="Місто та країна проживання">
              <i class="bi bi-geo-alt"></i>
              <div><span class="team-info-label">Локація:</span> ${city}, ${country}</div>
            </li>
            <li class="team-info-item" title="Поштовий індекс">
              <i class="bi bi-mailbox"></i>
              <div><span class="team-info-label">Індекс:</span> ${postcode}</div>
            </li>
            <li class="team-info-item" title="Географічні координати">
              <i class="bi bi-compass"></i>
              <div><span class="team-info-label">Координати:</span> ${coordinates}</div>
            </li>
          </ul>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

