// models/menuItemReview.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const MenuItemReview = sequelize.define(
  "MenuItemReview",
  {
    reviewid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    menuitemid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "menu_item_reviews",
    timestamps: false,
  },
);
