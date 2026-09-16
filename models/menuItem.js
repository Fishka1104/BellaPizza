// models/menuItem.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const MenuItem = sequelize.define(
  "MenuItem",
  {
    menuitemid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    imageurl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      defaultValue: 4.5,
    },
    reviewscount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10,
    },
  },
  {
    tableName: "menuitems",
    timestamps: false,
  },
);
