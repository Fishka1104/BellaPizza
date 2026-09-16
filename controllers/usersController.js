// controllers/usersController.js
import { User } from "../models/user.js";

// GET /api/users — отримати всіх користувачів
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// GET /api/users/:id — отримати користувача за ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// POST /api/users — створити користувача
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Error creating user" });
  }
};

// PUT /api/users/:id — оновити користувача
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone, address } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({
      name: name ?? user.name,
      email: email ?? user.email,
      password: password ?? user.password,
      phone: phone ?? user.phone,
      address: address ?? user.address,
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// DELETE /api/users/:id — видалити користувача
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
