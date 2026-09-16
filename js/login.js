// js/login.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 login.js підключено");

  const form = document.getElementById("login-form");

  if (!form) {
    console.error("❌ Форма логіну (#login-form) не знайдена!");
    return;
  }

  console.log("✅ Форма логіну знайдена, навішуємо submit handler");
  form.addEventListener("submit", onLoginSubmit);
});

async function onLoginSubmit(event) {
  event.preventDefault();
  console.log("📝 Сабміт форми логіну");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("📌 Введені дані:", {
    email,
    password: password ? "***" : "(порожньо)",
  });

  if (!email || !password) {
    showToast("Будь ласка, заповніть Email та Пароль.", "warning");
    return;
  }

  try {
    const { data } = await apiFetch(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", data.token);
    const roles = data.user?.roles || [];
    localStorage.setItem("roles", JSON.stringify(roles));

    showToast("Вхід успішний! Завантажуємо сторінку...", "success");

    setTimeout(() => {
      if (roles.includes("Admin")) {
        window.location.href = "admin.html";
      } else {
        window.location.href = "cabinet.html";
      }
    }, 1000);
  } catch (error) {
    showToast(error.message || "Не вдалося підключитися до сервера", "error");
  }
}
