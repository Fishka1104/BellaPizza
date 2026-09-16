// js/admin-users.js

document.addEventListener("DOMContentLoaded", () => {
  const usersTab = document.querySelector('a[href="#users-management"]');
  if (usersTab) {
    usersTab.addEventListener("shown.bs.tab", loadAdminUsers);
  }
});

async function loadAdminUsers() {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;

  try {
    const { data: users } = await apiFetch(`/api/admin/users`);
    tbody.innerHTML = "";

    if (!users.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Немає користувачів.</td></tr>`;
      return;
    }

    users.forEach((u) => {
      const tr = document.createElement("tr");

      const roles = u.Roles ? u.Roles.map((r) => r.rolename) : [];
      const isAdmin = roles.includes("Admin");
      const roleBadge = isAdmin
        ? '<span class="badge bg-danger">Admin</span>'
        : '<span class="badge bg-primary">User</span>';

      const actionBtn = isAdmin
        ? `<button class="btn btn-sm btn-outline-warning admin-role-btn" data-id="${u.userid}" data-role="User">Зробити клієнтом</button>`
        : `<button class="btn btn-sm btn-outline-success admin-role-btn" data-id="${u.userid}" data-role="Admin">Зробити адміном</button>`;

      tr.innerHTML = `
        <td>${u.userid}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.phone || "-"}</td>
        <td>${roleBadge}</td>
        <td>${actionBtn}</td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".admin-role-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;
        const newRole = e.currentTarget.dataset.role;
        if (
          confirm(
            `Ви впевнені, що хочете змінити роль цього користувача на ${newRole}?`,
          )
        ) {
          try {
            await apiFetch(`/api/admin/users/${id}/role`, {
              method: "PUT",
              body: JSON.stringify({ roleName: newRole }),
            });
            showToast("Роль оновлено.", "success");
            loadAdminUsers();
          } catch (err) {
            showToast("Не вдалося змінити роль.", "error");
          }
        }
      });
    });
  } catch (error) {
    console.error("Error loading users:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Помилка завантаження.</td></tr>`;
  }
}
