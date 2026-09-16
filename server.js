import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import "./models/associations.js";

import usersRoutes from "./routes/users.js";
import menuItemsRoutes from "./routes/menuitems.js";
import ordersRoutes from "./routes/orders.js";
import orderItemsRoutes from "./routes/orderitems.js";
import promotionsRoutes from "./routes/promotions.js";
import publicOrdersRoutes from "./routes/publicOrders.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/menuitems", menuItemsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/orderitems", orderItemsRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/public/orders", publicOrdersRoutes);

import uploadRoutes from "./routes/upload.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
