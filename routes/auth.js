import express from "express";
import { body, validationResult } from "express-validator";
import { register, login, getProfile } from "../controllers/authController.js";
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

router.post("/register", [
    body("email").isEmail().withMessage("Некоректний формат email"),
    body("password").isLength({ min: 6 }).withMessage("Пароль має містити мінімум 6 символів"),
    body("name").notEmpty().withMessage("Ім'я є обов'язковим")
], handleValidation, register);

router.post("/login", [
    body("email").isEmail().withMessage("Некоректний формат email"),
    body("password").notEmpty().withMessage("Введіть пароль")
], handleValidation, login);

router.get("/me", verifyToken, getProfile);

export default router;
