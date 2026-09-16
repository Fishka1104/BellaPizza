// middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Очікуємо: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Логи, щоб бачити, що реально всередині токена
    console.log("✅ JWT payload:", payload);

    // наприклад: { userid: 5, email: "...", roles: ["Client"], iat:..., exp:... }
    req.user = payload;
    next();
  } catch (error) {
    console.error("❌ JWT verify error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Перевірка ролей (Admin і т.д.)
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden: insufficient rights" });
    }

    next();
  };
};
