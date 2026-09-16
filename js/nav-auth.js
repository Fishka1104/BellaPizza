// js/nav-auth.js

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("login-link");
  if (!loginLink) return;

  const token = localStorage.getItem("token");
  const rolesRaw = localStorage.getItem("roles");

  if (!token) {
    // Користувач не авторизований — залишаємо "Увійти"
    loginLink.textContent = "Увійти";
    loginLink.href = "login.html";
    return;
  }

  let roles = [];
  try {
    roles = JSON.parse(rolesRaw) || [];
  } catch {
    roles = [];
  }

  // Якщо в ролях є "Admin" — ведемо в адмінку
  if (roles.includes("Admin")) {
    loginLink.textContent = "Адмін-панель";
    loginLink.href = "admin.html";
  } else {
    // Інакше — звичайний кабінет
    loginLink.textContent = "Кабінет";
    loginLink.href = "cabinet.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
    // 🔹 Підсвічування активного пункту меню
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Спеціальна обробка для login/cabinet/admin
        if (link.id === 'login-link') {
            if (currentPath === 'login.html' || currentPath === 'cabinet.html' || currentPath === 'admin.html') {
                link.classList.add('active');
            }
        } else if (href === currentPath) {
            link.classList.add('active');
        }
    });
});
