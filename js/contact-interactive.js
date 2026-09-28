document.addEventListener("DOMContentLoaded", () => {
  initHallGrid();
  initContactFormValidation();
});

  // Інтерактивна схема залу 6x6 (Події миші)

function initHallGrid() {
  const tableBody = document.querySelector("#hall-grid-table tbody");
  const colorPicker = document.getElementById("hall-color-picker");
  const resetBtn = document.getElementById("reset-hall-btn");
  const presetBtns = document.querySelectorAll(".color-preset");

  if (!tableBody || !colorPicker) return;

  const ROWS = 6;
  const COLS = 6;
  let counter = 1;

  // Динамічна генерація 36 комірок (столиків)
  tableBody.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < COLS; c++) {
      const td = document.createElement("td");
      td.textContent = counter;
      td.dataset.tableNumber = counter;
      td.dataset.row = r;
      td.dataset.col = c;
      td.title = `Столик №${counter} (Ряд ${r + 1})`;

      // 1. Подія mouseover: зміна кольору на випадковий
      td.addEventListener("mouseover", () => {
        const randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
        td.style.backgroundColor = randomColor;
        td.style.color = getContrastColor(randomColor);
      });

      // 2. Подія click: зміна кольору на обраний з палітри
      td.addEventListener("click", () => {
        const selectedColor = colorPicker.value;
        td.style.backgroundColor = selectedColor;
        td.style.color = getContrastColor(selectedColor);
      });

      // 3. Подія dblclick: зміна кольору всього відповідного рядка таблиці
      td.addEventListener("dblclick", () => {
        const selectedColor = colorPicker.value;
        const rowCells = tr.querySelectorAll("td");
        rowCells.forEach((cell) => {
          cell.style.backgroundColor = selectedColor;
          cell.style.color = getContrastColor(selectedColor);
        });

        if (typeof showToast === "function") {
          showToast(`Ряд ${r + 1} заброньовано вибраним кольором!`, "success");
        }
      });

      tr.appendChild(td);
      counter++;
    }
    tableBody.appendChild(tr);
  }

  // Обробка кнопок швидких кольорів
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      if (color) {
        colorPicker.value = color;
      }
    });
  });

  // Кнопка скидання схеми залу
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const allCells = tableBody.querySelectorAll("td");
      allCells.forEach((cell) => {
        cell.style.backgroundColor = "";
        cell.style.color = "";
      });
      if (typeof showToast === "function") {
        showToast("Схему залу скинуто до початкового стану", "info");
      }
    });
  }
}

// Допоміжна функція для визначення контрастного кольору тексту (білий/темний)
function getContrastColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16) || 0;
  const g = parseInt(hex.substr(2, 2), 16) || 0;
  const b = parseInt(hex.substr(4, 2), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#212529" : "#ffffff";
}

   // Валідація форми за допомогою RegEx

function initContactFormValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const phoneInput = document.getElementById("contact-phone");
  const emailInput = document.getElementById("contact-email");
  const messageInput = document.getElementById("contact-message");

  // Регулярні вирази
  // ПІБ: мінімум 2 слова (ім'я та прізвище), літери українські або латинські, дефіс, апостроф
  const nameRegex = /^[А-Яа-яЇїІіЄєҐґA-Za-z' -]{2,30}(\s+[А-Яа-яЇїІіЄєҐґA-Za-z' -]{2,30})+$/;
  // Телефон: український формат (+380XXXXXXXXX, 0XXXXXXXXX, з дужками або дефісами)
  const phoneRegex = /^(\+?38)?\s?\(?0\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
  // Email: валідний поштовий домен
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Валідація окремого поля
  function validateField(input, regex, errorMessage) {
    const value = input.value.trim();
    const feedbackEl = input.nextElementSibling;

    if (!value) {
      setInvalid(input, feedbackEl, "Це поле є обов'язковим для заповнення.");
      return false;
    }

    if (regex && !regex.test(value)) {
      setInvalid(input, feedbackEl, errorMessage);
      return false;
    }

    setValid(input, feedbackEl);
    return true;
  }

  function validateMessage(input) {
    const value = input.value.trim();
    const feedbackEl = input.nextElementSibling;

    if (!value) {
      setInvalid(input, feedbackEl, "Будь ласка, введіть ваше повідомлення.");
      return false;
    }

    if (value.length < 10) {
      setInvalid(input, feedbackEl, "Повідомлення має містити щонайменше 10 символів.");
      return false;
    }

    setValid(input, feedbackEl);
    return true;
  }

  function setInvalid(input, feedbackEl, message) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    if (feedbackEl && feedbackEl.classList.contains("invalid-feedback")) {
      feedbackEl.textContent = message;
    }
  }

  function setValid(input, feedbackEl) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (feedbackEl && feedbackEl.classList.contains("invalid-feedback")) {
      feedbackEl.textContent = "";
    }
  }

  // Очищення та перевірка в реальному часі при вводі
  nameInput.addEventListener("input", () => {
    if (nameInput.classList.contains("is-invalid")) {
      validateField(nameInput, nameRegex, "Введіть повне ім'я та прізвище (тільки літери, мінімум 2 слова).");
    }
  });

  phoneInput.addEventListener("input", () => {
    if (phoneInput.classList.contains("is-invalid")) {
      validateField(phoneInput, phoneRegex, "Формат телефону: +380XXXXXXXXX або 0XXXXXXXXX.");
    }
  });

  emailInput.addEventListener("input", () => {
    if (emailInput.classList.contains("is-invalid")) {
      validateField(emailInput, emailRegex, "Введіть коректну адресу електронної пошти (наприклад: name@example.com).");
    }
  });

  messageInput.addEventListener("input", () => {
    if (messageInput.classList.contains("is-invalid")) {
      validateMessage(messageInput);
    }
  });

  // Обробка відправки форми
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNameValid = validateField(
      nameInput,
      nameRegex,
      "Введіть повне ім'я та прізвище (тільки літери, мінімум 2 слова)."
    );
    const isPhoneValid = validateField(
      phoneInput,
      phoneRegex,
      "Формат телефону: +380XXXXXXXXX або 0XXXXXXXXX."
    );
    const isEmailValid = validateField(
      emailInput,
      emailRegex,
      "Введіть коректну адресу електронної пошти (наприклад: name@example.com)."
    );
    const isMessageValid = validateMessage(messageInput);

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
      if (typeof showToast === "function") {
        showToast("Будь ласка, виправте виділені помилки у формі.", "warning");
      }
      return;
    }

    // Якщо все валідно: відображаємо введені дані в окремому модальному вікні
    const nameVal = nameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    document.getElementById("modal-res-name").textContent = nameVal;
    document.getElementById("modal-res-phone").textContent = phoneVal;
    document.getElementById("modal-res-email").textContent = emailVal;
    document.getElementById("modal-res-message").textContent = messageVal;

    const modalEl = document.getElementById("contactSuccessModal");
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }

    // Скидаємо поля та класи
    form.reset();
    [nameInput, phoneInput, emailInput, messageInput].forEach((el) => {
      el.classList.remove("is-valid");
      el.classList.remove("is-invalid");
    });
  });
}
