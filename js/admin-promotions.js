// js/admin-promotions.js

let currentPromoId = null;
let promoModal = null;
let lastPromotions = [];

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("promoModal");
  promoModal = new bootstrap.Modal(modalEl);

  const addPromoBtn = document.getElementById("add-promo-btn");
  const savePromoBtn = document.getElementById("promo-save-btn");

  addPromoBtn.addEventListener("click", onAddPromoClick);
  savePromoBtn.addEventListener("click", onSavePromoClick);

  loadPromotions();
});

// Завантаження списку акцій
async function loadPromotions() {
  const tbody = document.getElementById("promotions-table-body");
  if (!tbody) return;

  try {
    const { data: promotions } = await apiFetch(`/api/promotions`);
    lastPromotions = promotions;

    tbody.innerHTML = "";

    if (!promotions.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">
            Немає акцій або новин.
          </td>
        </tr>
      `;
      return;
    }

    promotions.forEach((promo) => {
      const tr = document.createElement("tr");

      const start = promo.startdate ? promo.startdate : "";
      const end = promo.enddate ? promo.enddate : "";
      let periodText = "-";

      if (start && end) {
        periodText = `${start} — ${end}`;
      } else if (start && !end) {
        periodText = `з ${start}`;
      } else if (!start && end) {
        periodText = `до ${end}`;
      }

      const isActiveText = promo.isactive ? "Активна" : "Неактивна";
      const isActiveClass = promo.isactive ? "badge bg-success" : "badge bg-secondary";

      tr.innerHTML = `
        <td>${promo.title}</td>
        <td>${promo.description ? promo.description : "-"}</td>
        <td>${periodText}</td>
        <td><span class="${isActiveClass}">${isActiveText}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-warning me-2 promo-edit-btn" data-id="${promo.promotionid}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger promo-delete-btn" data-id="${promo.promotionid}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    attachPromoHandlers();

  } catch (error) {
    console.error("Error loading promotions:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">
          Не вдалося завантажити акції. Спробуйте пізніше.
        </td>
      </tr>
    `;
  }
}

// Клік "Додати акцію / новину"
function onAddPromoClick() {
  currentPromoId = null;
  document.getElementById("promoModalTitle").textContent = "Нова акція / новина";

  document.getElementById("promo-title").value = "";
  document.getElementById("promo-desc").value = "";
  document.getElementById("promo-startdate").value = "";
  document.getElementById("promo-enddate").value = "";
  document.getElementById("promo-isactive").checked = true;

  promoModal.show();
}

// Збереження (створення/оновлення)
async function onSavePromoClick() {
  const title = document.getElementById("promo-title").value.trim();
  const description = document.getElementById("promo-desc").value.trim();
  const startdateRaw = document.getElementById("promo-startdate").value;
  const enddateRaw = document.getElementById("promo-enddate").value;
  const fileInput = document.getElementById('promo-image-file');
  let imageurl = null;
  if(fileInput.files.length>0){
    const formData=new FormData();
    formData.append('image', fileInput.files[0]);
    const res=await fetch(API_BASE+'/api/upload',{method:'POST',body:formData});
    if(res.ok){
      const data=await res.json();
      imageurl=data.imageUrl;
    }
  }

  const isactive = document.getElementById("promo-isactive").checked;

  if (!title) {
    showToast("Вкажіть заголовок акції / новини.", "warning");
    return;
  }

  const body = {
    title,
    description,
    startdate: startdateRaw || null,
    enddate: enddateRaw || null,
    isactive,
    imageurl: imageurl || undefined,
  };

  try {
    let url = `${API_BASE}/api/promotions`;
    let method = "POST";

    if (currentPromoId !== null) {
      url = `${API_BASE}/api/promotions/${currentPromoId}`;
      method = "PUT";
    }

    await apiFetch(url.replace(API_BASE, ""), {
      method,
      body: JSON.stringify(body),
    });

    promoModal.hide();
    await loadPromotions();
  } catch (error) {
    console.error("Error saving promotion:", error);
    showToast("Не вдалося зберегти акцію / новину.", "error");
  }
}

// Обробники кнопок "Редагувати" / "Видалити"
function attachPromoHandlers() {
  // Редагування
  document.querySelectorAll(".promo-edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const promo = lastPromotions.find((p) => p.promotionid == id);
      if (!promo) return;

      currentPromoId = id;
      document.getElementById("promoModalTitle").textContent = "Редагувати акцію / новину";

      document.getElementById("promo-title").value = promo.title ?? "";
      document.getElementById("promo-desc").value = promo.description ?? "";
      document.getElementById("promo-startdate").value = promo.startdate ?? "";
      document.getElementById("promo-enddate").value = promo.enddate ?? "";
      document.getElementById("promo-isactive").checked = !!promo.isactive;

      promoModal.show();
    });
  });

  // Видалення
  document.querySelectorAll(".promo-delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm("Видалити цю акцію / новину?");

      if (!confirmDelete) return;

      try {
        await apiFetch(`/api/promotions/${id}`, { method: "DELETE" });

        await loadPromotions();
      } catch (error) {
        console.error("Error deleting promotion:", error);
        showToast("Не вдалося видалити акцію / новину.", "warning");
      }
    });
  });
}
