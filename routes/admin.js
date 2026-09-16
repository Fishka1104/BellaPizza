import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";
import {
  getAdminStats,
  getUsersList,
  updateUserRole,
  getAllReviews,
  deleteReview,
} from "../controllers/adminController.js";

const router = express.Router();

// Усі ці маршрути потребують прав Адміністратора
router.use(verifyToken, requireRole("Admin"));

router.get("/stats", getAdminStats);
router.get("/users", getUsersList);
router.put("/users/:id/role", updateUserRole);
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

export default router;
