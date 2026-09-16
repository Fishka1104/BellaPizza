// js/cart.js

class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("pizza_cart")) || [];
    this.initListeners();
    this.updateCartBadge();
  }

  save() {
    localStorage.setItem("pizza_cart", JSON.stringify(this.items));
    this.updateCartBadge();
    this.renderCart();
  }

  addItem(menuItem) {
    const existing = this.items.find(
      (i) => i.menuitemid === menuItem.menuitemid,
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...menuItem, quantity: 1 });
    }
    this.save();
    showToast(`"${menuItem.name}" додано до кошика!`, "success");
  }

  removeItem(id) {
    this.items = this.items.filter((i) => i.menuitemid !== id);
    this.save();
  }

  updateQuantity(id, delta) {
    const item = this.items.find((i) => i.menuitemid === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.save();
      }
    }
  }

  clear() {
    this.items = [];
    this.save();
  }

  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
  }

  updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
      const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-block" : "none";
    }
  }

  renderCart() {
    const container = document.getElementById("cart-items-container");
    const totalEl = document.getElementById("cart-total");
    if (!container) return;

    container.innerHTML = "";
    if (this.items.length === 0) {
      container.innerHTML =
        '<p class="text-muted text-center my-4">Кошик порожній 😔</p>';
      if (totalEl) totalEl.textContent = "0.00";
      const checkoutBtn = document.getElementById("cart-checkout-btn");
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    this.items.forEach((item) => {
      const div = document.createElement("div");
      div.className =
        "d-flex justify-content-between align-items-center border-bottom pb-2 mb-2";
      div.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <img src="${item.imageurl?.startsWith("http") ? item.imageurl : API_BASE + "/" + item.imageurl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">${Number(item.price).toFixed(2)} грн / шт</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary cart-minus" data-id="${item.menuitemid}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary cart-plus" data-id="${item.menuitemid}">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-2 cart-remove" data-id="${item.menuitemid}"><i class="bi bi-trash"></i></button>
                </div>
            `;
      container.appendChild(div);
    });

    if (totalEl) totalEl.textContent = this.getTotal().toFixed(2);

    const checkoutBtn = document.getElementById("cart-checkout-btn");
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  initListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".cart-minus")) {
        const id = Number(e.target.closest(".cart-minus").dataset.id);
        this.updateQuantity(id, -1);
      }
      if (e.target.closest(".cart-plus")) {
        const id = Number(e.target.closest(".cart-plus").dataset.id);
        this.updateQuantity(id, 1);
      }
      if (e.target.closest(".cart-remove")) {
        const id = Number(e.target.closest(".cart-remove").dataset.id);
        this.removeItem(id);
      }
    });
  }
}

let cart;
document.addEventListener("DOMContentLoaded", () => {
  cart = new Cart();
});
