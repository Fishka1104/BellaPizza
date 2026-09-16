// routes/promotions.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion, likePromotion, getComments, addComment,
} from "../controllers/promotionsController.js";

const router = express.Router();

router.get("/", getPromotions);
router.get("/:id", getPromotionById);
router.post("/", createPromotion);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

router.post("/:id/like", likePromotion);
router.get("/:id/comments", getComments);
router.post("/:id/comments", verifyToken, addComment);

export default router;
