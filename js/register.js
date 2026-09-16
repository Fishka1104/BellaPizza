// js/register.js
console.log("✅ register.js підключено");

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌐 DOM завантажено");

  const form = document.getElementById("register-form");
  if (!form) {
    console.error("❌ Не знайдено форму #register-form");
    return;
  }

  console.log("✅ Форма знайдена, навішуємо submit handler");
  form.addEventListener("submit", onRegisterSubmit);
});

async function onRegisterSubmit(e) {
  e.preventDefault();
  console.log("➡️ Сабміт форми реєстрації");

  const nameEl = document.getElementById("reg-name");
  const emailEl = document.getElementById("reg-email");
  const passwordEl = document.getElementById("reg-password");

  console.log("🔍 Елементи:", { nameEl, emailEl, passwordEl });

  if (!nameEl || !emailEl || !passwordEl) {
    alert("Проблема з HTML: не знайдено один з інпутів. Перевір id полів.");
    return;
  }

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  if (!name || !email || !password) {
    showToast("Заповніть усі обовʼязкові поля.", "warning");
    return;
  }

  const body = { name, email, password };

  try {
    await apiFetch(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    showToast(
      "Акаунт створено! Перенаправляємо на сторінку входу...",
      "success",
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    showToast(error.message || "Помилка з'єднання з сервером", "error");
  }
}
