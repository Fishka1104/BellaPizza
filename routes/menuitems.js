// routes/menuitems.js
import express from "express";
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemReviews,
  addMenuItemReview,
} from "../controllers/menuItemsController.js";

import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Публічні
router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);

// Тільки Admin
router.post("/", verifyToken, requireRole("Admin"), createMenuItem);
router.put("/:id", verifyToken, requireRole("Admin"), updateMenuItem);
router.delete("/:id", verifyToken, requireRole("Admin"), deleteMenuItem);

// Reviews
router.get("/:id/reviews", getMenuItemReviews);
router.post("/:id/reviews", verifyToken, addMenuItemReview);

export default router;
