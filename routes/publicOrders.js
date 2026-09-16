import express from "express";
import { body, validationResult } from "express-validator";
import { createPublicOrder } from "../controllers/publicOrdersController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const msgs = errors.array().map(e => e.msg).join(", ");
        return res.status(400).json({ message: msgs });
    }
    next();
};

router.post("/", verifyToken, [
    body("address").notEmpty().withMessage("Адреса доставки є обов'язковою"),
    body("payment").isIn(["Cash", "Card", "Online"]).withMessage("Невірний спосіб оплати"),
    body("menuItems").isArray({ min: 1 }).withMessage("Оберіть хоча б одну страву")
], handleValidation, createPublicOrder);

export default router;
