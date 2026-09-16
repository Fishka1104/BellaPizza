// js/order-modal.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".delivery-form");
  if (!form) return;

  form.addEventListener("submit", onOrderFormSubmit);

  fillUserDataForOrder();

  const modalEl = document.getElementById("BookingModal");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", () => {
      if (typeof cart !== "undefined") cart.renderCart();
    });
  }
});

async function fillUserDataForOrder() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const { data: me } = await apiFetch(`/api/auth/me`);
    const { data: user } = await apiFetch(`/api/users/${me.userid}`);

    if (nameInput && user.name) {
      nameInput.value = user.name;
      nameInput.readOnly = true;
    }
    if (emailInput && user.email) {
      emailInput.value = user.email;
      emailInput.readOnly = true;
    }
    if (phoneInput && user.phone) {
      phoneInput.value = user.phone;
    }
    if (addressInput && user.address) {
      addressInput.value = user.address;
    }
  } catch (error) {
    console.warn("Could not fetch user data for order modal");
  }
}

async function onOrderFormSubmit(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    showToast(
      "Щоб оформити замовлення, спочатку увійдіть у систему.",
      "warning",
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;
  const comment = document.getElementById("comment").value.trim();

  const selectedMenuItems =
    typeof cart !== "undefined"
      ? cart.items.map((i) => ({
          menuitemid: i.menuitemid,
          quantity: i.quantity,
        }))
      : [];

  if (!selectedMenuItems.length) {
    showToast("Кошик порожній.", "warning");
    return;
  }

  if (!name || !email || !address) {
    showToast("Заповніть обов'язкові поля (ім'я, email, адреса).", "warning");
    return;
  }

  const body = {
    name,
    email,
    phone,
    address,
    menuItems: selectedMenuItems,
    payment,
    comment,
  };

  try {
    const { data: respData } = await apiFetch(`/api/public/orders`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    showToast(
      `Замовлення успішно оформлено! Номер замовлення: ${respData.order.orderid}`,
      "success",
    );

    event.target.reset();
    if (typeof cart !== "undefined") cart.clear();

    const modalEl = document.getElementById("BookingModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  } catch (error) {
    if (error.message !== "Unauthorized") {
      showToast(
        error.message || "Не вдалося оформити замовлення. Спробуйте пізніше.",
        "error",
      );
    }
  }
}
