// js/admin-orders.js

let lastOrders = [];

document.addEventListener("DOMContentLoaded", () => {
  const ordersTab = document.querySelector('a[href="#order-management"]');
  if (ordersTab) {
    ordersTab.addEventListener("shown.bs.tab", loadOrders);
    if (ordersTab.classList.contains("active")) {
      loadOrders();
    }
  } else {
    loadOrders();
  }
});

function getStatusColor(status) {
  switch(status) {
    case "New": return "bg-primary text-white";
    case "Preparing": return "bg-warning text-dark";
    case "Delivering": return "bg-info text-dark";
    case "Completed": return "bg-success text-white";
    case "Completed": return "bg-success text-white";
    case "Cancelled": return "bg-danger text-white";
    default: return "bg-secondary text-white";
  }
}

async function loadOrders() {
  const tbody = document.getElementById("orders-table-body");
  if (!tbody) return;

  try {
    const { data: orders } = await apiFetch(`/api/orders`);
    // Sort from newest to oldest
    lastOrders = orders.sort((a, b) => b.orderid - a.orderid);

    tbody.innerHTML = "";

    if (!lastOrders.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Немає замовлень.</td></tr>`;
      return;
    }

    lastOrders.forEach((order) => {
      const tr = document.createElement("tr");

      const date = order.orderdate ? new Date(order.orderdate).toLocaleString("uk-UA") : "-";
      const amount = order.totalamount ? `${order.totalamount} грн` : "-";

      const paymentMap = {
        Cash: "Готівка",
        Card: "Картка",
        Online: "Онлайн-оплата",
      };

      const paymentText = paymentMap[order.paymentmethod] || order.paymentmethod || "-";
      
      const selectColorClass = getStatusColor(order.status);

      tr.innerHTML = `
        <td>${order.orderid}</td>
        <td>${order.userid}</td>
        <td>${date}</td>
        <td>${amount}</td>
        <td>
          <select class="form-select form-select-sm order-status-select ${selectColorClass}" data-id="${order.orderid}">
            <option value="New" ${order.status === "New" ? "selected" : ""}>Нове</option>
            <option value="Preparing" ${order.status === "Preparing" ? "selected" : ""}>Готується</option>
            <option value="Delivering" ${order.status === "Delivering" ? "selected" : ""}>Доставляється</option>
            <option value="Completed" ${order.status === "Completed" ? "selected" : ""}>Виконано</option>
            <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Скасовано</option>
          </select>
        </td>
        <td>${paymentText}</td>
        <td>${order.deliveryaddress ?? "-"}</td>
      `;

      tbody.appendChild(tr);
    });

    attachStatusHandlers();

  } catch (error) {
    console.error("Error loading orders:", error);
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Не вдалося завантажити замовлення.</td></tr>`;
  }
}

function attachStatusHandlers() {
  const selects = document.querySelectorAll(".order-status-select");

  selects.forEach((selectEl) => {
    selectEl.addEventListener("change", async () => {
      const orderId = selectEl.dataset.id;
      const newStatus = selectEl.value;
      const order = lastOrders.find((o) => o.orderid == orderId);
      const oldStatus = order ? order.status : null;

      try {
        await apiFetch(`/api/orders/${orderId}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) });
        
        if (order) order.status = newStatus;
        
        // Update color
        selectEl.className = `form-select form-select-sm order-status-select ${getStatusColor(newStatus)}`;
        showToast("Статус замовлення оновлено", "success");

      } catch (error) {
        console.error("Error updating order status:", error);
        showToast("Не вдалося оновити статус замовлення.", "error");
        if (oldStatus) {
          selectEl.value = oldStatus;
          selectEl.className = `form-select form-select-sm order-status-select ${getStatusColor(oldStatus)}`;
        }
      }
    });
  });
}
