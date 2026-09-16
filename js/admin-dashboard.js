// js/admin-dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  // We only load stats if the dashboard tab is visible
  const dashTab = document.querySelector('a[href="#dashboard-management"]');
  if (dashTab) {
    dashTab.addEventListener("shown.bs.tab", loadDashboardStats);
    // Load initially if it's active
    if (dashTab.classList.contains("active")) {
      loadDashboardStats();
    }
  }
});

async function loadDashboardStats() {
  try {
    const { data: stats } = await apiFetch("/api/admin/stats");
    document.getElementById("stat-income").textContent = stats.totalIncome;
    document.getElementById("stat-orders").textContent =
      stats.activeOrdersCount;
    document.getElementById("stat-users").textContent = stats.totalUsers;
    document.getElementById("stat-menu").textContent = stats.totalMenuItems;
  } catch (err) {
    console.error("Error loading dashboard stats:", err);
  }
}
