import { User } from "../models/user.js";
import { Role } from "../models/role.js";
import { Order } from "../models/order.js";
import { MenuItem } from "../models/menuItem.js";
import { MenuItemReview } from "../models/menuItemReview.js";

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalMenuItems = await MenuItem.count();

    // Total income from completed orders
    const completedOrders = await Order.findAll({
      where: { status: "Completed" }, // assuming Completed means paid
    });

    let totalIncome = 0;
    completedOrders.forEach((o) => {
      totalIncome += Number(o.totalamount);
    });

    // Active orders (Pending, Processing)
    const activeOrdersCount = await Order.count({
      where: { status: ["New", "Preparing", "Delivering"] },
    });

    res.json({
      totalUsers,
      totalMenuItems,
      totalIncome: totalIncome.toFixed(2),
      activeOrdersCount,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/users
export const getUsersList = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["passwordhash"] },
      include: [Role],
      order: [["createdat", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body; // "Admin" or "User"

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const role = await Role.findOne({ where: { rolename: roleName } });
    if (!role) return res.status(400).json({ message: "Invalid role" });

    // Set role
    await user.setRoles([role]); // Many-to-many helper

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await MenuItemReview.findAll({
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: MenuItem, attributes: ["name"] },
      ],
      order: [["createdat", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await MenuItemReview.findByPk(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const menuitemId = review.menuitemid;
    await review.destroy();

    // Recalculate average rating for the item
    const allReviews = await MenuItemReview.findAll({
      where: { menuitemid: menuitemId },
    });
    const count = allReviews.length;
    const sum = allReviews.reduce((acc, rev) => acc + Number(rev.rating), 0);
    const avg = count > 0 ? (sum / count).toFixed(2) : 0;

    const item = await MenuItem.findByPk(menuitemId);
    if (item) {
      await item.update({ rating: avg, reviewscount: count });
    }

    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
