// controllers/menuItemsController.js
import { MenuItem } from "../models/menuItem.js";
import { MenuItemReview } from "../models/menuItemReview.js";
import { User } from "../models/user.js";

// GET /api/menuitems — всі позиції меню
export const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.findAll();
    res.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Error fetching menu items" });
  }
};

// GET /api/menuitems/:id — одна позиція
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: "Error fetching menu item" });
  }
};

// POST /api/menuitems — створити позицію меню
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, imageurl, availability } =
      req.body;

    const newItem = await MenuItem.create({
      name,
      description,
      category,
      price,
      imageurl,
      availability,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(400).json({ message: "Error creating menu item" });
  }
};

// PUT /api/menuitems/:id — оновити позицію меню
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, imageurl, availability } =
      req.body;

    const item = await MenuItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await item.update({
      name: name ?? item.name,
      description: description ?? item.description,
      category: category ?? item.category,
      price: price ?? item.price,
      imageurl: imageurl ?? item.imageurl,
      availability:
        availability === undefined ? item.availability : availability,
    });

    res.json(item);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Error updating menu item" });
  }
};

// DELETE /api/menuitems/:id — видалити позицію меню
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MenuItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await item.destroy();
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Error deleting menu item" });
  }
};

// GET /api/menuitems/:id/reviews
export const getMenuItemReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await MenuItemReview.findAll({
      where: { menuitemid: id },
      include: [
        {
          model: User,
          attributes: ["name"], // get the reviewer's name
        },
      ],
      order: [["createdat", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// POST /api/menuitems/:id/reviews
export const addMenuItemReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user.userid; // from verifyToken
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const item = await MenuItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // create review
    const newReview = await MenuItemReview.create({
      menuitemid: id,
      userid,
      rating,
      comment,
    });

    // recalculate average rating and count
    const allReviews = await MenuItemReview.findAll({ where: { menuitemid: id } });
    const count = allReviews.length;
    const sum = allReviews.reduce((acc, rev) => acc + Number(rev.rating), 0);
    const avg = count > 0 ? (sum / count).toFixed(2) : 0;

    await item.update({
      rating: avg,
      reviewscount: count,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review" });
  }
};
