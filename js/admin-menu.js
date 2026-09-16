// js/admin-menu.js

let currentEditId = null;
let menuModal = null;
let lastItems = [];

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("menuModal");
  if (modalEl) {
    menuModal = new bootstrap.Modal(modalEl);
  }

  const addBtn = document.getElementById("add-menu-btn");
  const saveBtn = document.getElementById("menu-save-btn");

  if (addBtn) addBtn.addEventListener("click", onAddClick);
  if (saveBtn) saveBtn.addEventListener("click", onSaveClick);

  const menuTab = document.querySelector('a[href="#menu-management"]');
  if (menuTab) {
    menuTab.addEventListener("shown.bs.tab", loadMenuItems);
  }

  // Load initially if active
  if (menuTab && menuTab.classList.contains("active")) {
    loadMenuItems();
  }
});

async function loadMenuItems() {
  const tbody = document.getElementById("menu-table-body");
  if (!tbody) return;

  try {
    const { data: items } = await apiFetch(`/api/menuitems`);
    lastItems = items;

    tbody.innerHTML = "";

    if (!items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted">Меню порожнє.</td>
        </tr>
      `;
      return;
    }

    items.forEach((item) => {
      const tr = document.createElement("tr");

      const imgSrc = item.imageurl ? item.imageurl : "images/placeholder.jpg";
      const availabilityText = item.availability ? "Так" : "Ні";
      const availabilityClass = item.availability
        ? "badge bg-success"
        : "badge bg-secondary";

      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.description ? item.description : "-"}</td>
        <td>${item.category || "-"}</td>
        <td>${Number(item.price).toFixed(2)} грн</td>
        <td>
          <img src="${imgSrc}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
        </td>
        <td><span class="${availabilityClass}">${availabilityText}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-warning me-2 edit-btn" data-id="${item.menuitemid}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${item.menuitemid}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    attachRowHandlers();
  } catch (error) {
    console.error("Error loading menu items:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Не вдалося завантажити меню.
        </td>
      </tr>
    `;
  }
}

function onAddClick() {
  currentEditId = null;
  document.getElementById("menuModalTitle").textContent = "Нова страва";

  document.getElementById("menu-name").value = "";
  document.getElementById("menu-desc").value = "";
  document.getElementById("menu-category").value = "Pizza";
  document.getElementById("menu-price").value = "";
  document.getElementById("menu-imageurl").value = "";
  document.getElementById("menu-imagefile").value = "";
  document.getElementById("menu-availability").checked = true;

  menuModal.show();
}

async function onSaveClick() {
  const fileInput = document.getElementById("menu-imagefile");
  let imageurl = document.getElementById("menu-imageurl").value.trim();

  // If a file was selected, upload it first
  if (fileInput.files.length > 0) {
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const uploadData = await res.json();
      imageurl = uploadData.imageUrl;
    } catch (err) {
      showToast("Помилка завантаження картинки.", "error");
      return;
    }
  }

  const body = {
    name: document.getElementById("menu-name").value.trim(),
    description: document.getElementById("menu-desc").value.trim(),
    category: document.getElementById("menu-category").value,
    price: parseFloat(document.getElementById("menu-price").value),
    imageurl,
    availability: document.getElementById("menu-availability").checked,
  };

  if (!body.name || isNaN(body.price)) {
    showToast("Вкажіть назву та коректну ціну.", "warning");
    return;
  }

  try {
    let url = `/api/menuitems`;
    let method = "POST";

    if (currentEditId !== null) {
      url = `/api/menuitems/${currentEditId}`;
      method = "PUT";
    }

    await apiFetch(url, {
      method,
      body: JSON.stringify(body),
    });

    menuModal.hide();
    await loadMenuItems();
    showToast("Збережено успішно!", "success");
  } catch (error) {
    console.error("Error saving menu item:", error);
    showToast("Не вдалося зберегти страву.", "error");
  }
}

function attachRowHandlers() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Ви впевнені, що хочете видалити цю страву?")) return;

      try {
        await apiFetch(`/api/menuitems/${id}`, { method: "DELETE" });
        showToast("Видалено.", "success");
        await loadMenuItems();
      } catch (error) {
        console.error("Error deleting menu item:", error);
        showToast("Не вдалося видалити страву.", "warning");
      }
    });
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = lastItems.find((i) => i.menuitemid == id);
      if (!item) return;

      currentEditId = id;
      document.getElementById("menuModalTitle").textContent =
        "Редагувати страву";

      document.getElementById("menu-name").value = item.name;
      document.getElementById("menu-desc").value = item.description || "";
      document.getElementById("menu-category").value = item.category || "Pizza";
      document.getElementById("menu-price").value = Number(item.price).toFixed(
        2,
      );
      document.getElementById("menu-imageurl").value = item.imageurl || "";
      document.getElementById("menu-imagefile").value = "";
      document.getElementById("menu-availability").checked = item.availability;

      menuModal.show();
    });
  });
}
