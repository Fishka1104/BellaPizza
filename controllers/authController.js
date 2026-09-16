// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Role } from "../models/role.js";
import { UserRole } from "../models/userRole.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

// Допоміжна функція: створити JWT
const signToken = (user, roles) => {
  const payload = {
    userid: user.userid,
    email: user.email,
    roles: roles.map((r) => r.rolename),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Чи такий email вже існує?
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    // Знайти роль "Client" і записати в userroles
    const clientRole = await Role.findOne({ where: { rolename: "Client" } });

    if (clientRole) {
      await UserRole.create({
        userid: user.userid,
        roleid: clientRole.roleid,
      });
    }

    const roles = clientRole ? [clientRole] : [];
    const token = signToken(user, roles);

    return res.status(201).json({
      token,
      user: {
        userid: user.userid,
        name: user.name,
        email: user.email,
        roles: roles.map((r) => r.rolename),
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Registration error" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Завдяки associations у User з’явився метод getRoles()
    const roles = await user.getRoles();
    const token = signToken(user, roles);

    return res.json({
      token,
      user: {
        userid: user.userid,
        name: user.name,
        email: user.email,
        roles: roles.map((r) => r.rolename),
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Login error" });
  }
};

// GET /api/auth/me
export const getProfile = async (req, res) => {
  try {
    // req.user ми кладемо в middleware verifyToken
    return res.json({
      userid: req.user.userid,
      email: req.user.email,
      roles: req.user.roles,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Profile error" });
  }
};
