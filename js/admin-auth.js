// js/admin-auth.js
console.log("admin-auth.js підключено");

document.addEventListener("DOMContentLoaded", () => {
 
  const token = localStorage.getItem("token");
  let roles = [];

  try {
    const raw = localStorage.getItem("roles");
    roles = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Помилка парсингу roles з localStorage:", e);
  }

  const isAdmin = roles.includes("Admin");

 
  if (!token || !isAdmin) {
    alert("Спочатку авторизуйтесь як адміністратор, щоб отримати доступ до панелі.");
    window.location.href = "login.html";
    return; // далі скрипт не виконується
  }

  
  const logoutBtn = document.getElementById("admin-logout-btn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    alert("Ви вийшли з акаунта.");
    window.location.href = "login.html";
  });
});
