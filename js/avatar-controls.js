document.addEventListener("DOMContentLoaded", () => {
  initAvatarControls();
  initColorToggleDemo();
});

// Ініціалізація кнопок керування аватаром
function initAvatarControls() {
  const container = document.getElementById("avatar-container");
  const btnAdd = document.getElementById("btn-add-avatar");
  const btnZoomIn = document.getElementById("btn-zoom-in-avatar");
  const btnZoomOut = document.getElementById("btn-zoom-out-avatar");
  const btnDelete = document.getElementById("btn-delete-avatar");

  if (!container || !btnAdd || !btnZoomIn || !btnZoomOut || !btnDelete) return;

  // Базовий розмір аватара у пікселях
  let currentSize = 150;
  const STEP = 20;
  const MAX_SIZE = 230;
  const MIN_SIZE = 80;

  // 1. Збільшити зображення
  btnZoomIn.addEventListener("click", () => {
    const img = container.querySelector("#profile-avatar-img");
    if (!img) {
      if (typeof showToast === "function") {
        showToast("Спочатку додайте фото профілю!", "warning");
      }
      return;
    }

    if (currentSize < MAX_SIZE) {
      currentSize += STEP;
      img.style.width = `${currentSize}px`;
      img.style.height = `${currentSize}px`;
    } else {
      if (typeof showToast === "function") {
        showToast("Досягнуто максимального розміру аватара!", "info");
      }
    }
  });

  // 2. Зменшити зображення
  btnZoomOut.addEventListener("click", () => {
    const img = container.querySelector("#profile-avatar-img");
    if (!img) {
      if (typeof showToast === "function") {
        showToast("Спочатку додайте фото профілю!", "warning");
      }
      return;
    }

    if (currentSize > MIN_SIZE) {
      currentSize -= STEP;
      img.style.width = `${currentSize}px`;
      img.style.height = `${currentSize}px`;
    } else {
      if (typeof showToast === "function") {
        showToast("Досягнуто мінімального розміру аватара!", "info");
      }
    }
  });

  // 3. Видалити зображення з DOM
  btnDelete.addEventListener("click", () => {
    const img = container.querySelector("#profile-avatar-img");
    if (img) {
      // Фізичне видалення вузла елемента з DOM
      img.remove();

      // Встановлюємо візуальну заглушку відсутності фото
      container.innerHTML = `
        <div class="avatar-placeholder text-center p-3 text-muted">
          <i class="bi bi-person-x text-secondary" style="font-size: 4rem;"></i>
          <p class="small mb-0 mt-1">Фото профілю видалено</p>
        </div>
      `;

      if (typeof showToast === "function") {
        showToast("Фото видалено з DOM", "info");
      }
    } else {
      if (typeof showToast === "function") {
        showToast("Фото вже видалено!", "warning");
      }
    }
  });

  // 4. Додати зображення в DOM (створення нового вузла)
  btnAdd.addEventListener("click", () => {
    let img = container.querySelector("#profile-avatar-img");
    if (img) {
      if (typeof showToast === "function") {
        showToast("Фото вже додано до профілю!", "warning");
      }
      return;
    }

    // Створюємо елемент через document.createElement
    img = document.createElement("img");
    img.id = "profile-avatar-img";
    img.src = "images/userphoto.png";
    img.alt = "Фото профілю";
    img.className = "profile-avatar shadow-sm";
    img.style.width = `${currentSize}px`;
    img.style.height = `${currentSize}px`;
    img.style.borderRadius = "50%";
    img.style.border = "4px solid #dc3545";
    img.style.objectFit = "cover";
    img.style.transition = "width 0.3s ease, height 0.3s ease";

    // Очищаємо контейнер від заглушки та додаємо новостворений вузол
    container.innerHTML = "";
    container.appendChild(img);

    if (typeof showToast === "function") {
      showToast("Фото успішно додано до DOM", "success");
    }
  });
}

// Ініціалізація перемикання кольорів
function initColorToggleDemo() {
  // 1. Перший елемент: доступ за допомогою getElementById()
  const nameEl = document.getElementById("profile-name");
  let nameToggled = false;

  if (nameEl) {
    nameEl.addEventListener("click", () => {
      if (!nameToggled) {
        // Застосовуємо першу колірну комбінацію
        nameEl.style.backgroundColor = "#f5f544";
        nameEl.style.color = "#1f2937";
      } else {
        // Повторний клік: скидаємо стилі
        nameEl.style.backgroundColor = "";
        nameEl.style.color = "";
      }
      nameToggled = !nameToggled;
    });
  }

  // 2. Другий елемент: доступ за допомогою querySelector()
  const emailEl = document.querySelector("#profile-email");
  let emailToggled = false;

  if (emailEl) {
    emailEl.addEventListener("click", () => {
      if (!emailToggled) {
        // Застосовуємо другу колірну комбінацію
        emailEl.style.backgroundColor = "#448f8f";
        emailEl.style.color = "#ffffff";
      } else {
        // Повторний клік: скидаємо стилі
        emailEl.style.backgroundColor = "";
        emailEl.style.color = "";
      }
      emailToggled = !emailToggled;
    });
  }
}

