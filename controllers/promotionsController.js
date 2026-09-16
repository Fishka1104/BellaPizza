import { Promotion } from "../models/promotion.js";
import { PromotionComment } from "../models/promotionComment.js";
import { User } from "../models/user.js";

// GET /api/promotions — отримати всі акції
export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.json(promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    res.status(500).json({ message: "Error fetching promotions" });
  }
};

// GET /api/promotions/:id — отримати одну акцію
export const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByPk(id);

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json(promotion);
  } catch (error) {
    console.error("Error fetching promotion:", error);
    res.status(500).json({ message: "Error fetching promotion" });
  }
};

// POST /api/promotions — створення акції
export const createPromotion = async (req, res) => {
  try {
    const { title, description, startdate, enddate, isactive, imageurl } =
      req.body;

    const newPromotion = await Promotion.create({
      title,
      description,
      startdate,
      enddate,
      isactive,
      imageurl,
    });

    res.status(201).json(newPromotion);
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(400).json({ message: "Error creating promotion" });
  }
};

// PUT /api/promotions/:id — оновлення акції
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startdate, enddate, isactive, imageurl } =
      req.body;

    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    await promotion.update({
      title: title ?? promotion.title,
      description: description ?? promotion.description,
      startdate: startdate ?? promotion.startdate,
      enddate: enddate ?? promotion.enddate,
      isactive: typeof isactive === "boolean" ? isactive : promotion.isactive,
      imageurl: imageurl ?? promotion.imageurl,
    });

    res.json(promotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    res.status(500).json({ message: "Error updating promotion" });
  }
};

// DELETE /api/promotions/:id — видалення
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    await promotion.destroy();
    res.json({ message: "Promotion deleted" });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    res.status(500).json({ message: "Error deleting promotion" });
  }
};

export const likePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByPk(id);
    if (!promotion) return res.status(404).json({ message: "Not found" });

    promotion.likes = (promotion.likes || 0) + 1;
    await promotion.save();
    res.json({ likes: promotion.likes });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await PromotionComment.findAll({
      where: { promotionid: id },
      include: [{ model: User, attributes: ["name"] }],
      order: [["createdat", "DESC"]],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userid = req.user.userid;

    const comment = await PromotionComment.create({
      promotionid: id,
      userid,
      text,
    });

    const fullComment = await PromotionComment.findByPk(comment.commentid, {
      include: [{ model: User, attributes: ["name"] }],
    });

    res.status(201).json(fullComment);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
