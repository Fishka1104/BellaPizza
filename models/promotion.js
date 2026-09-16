// models/promotion.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Promotion = sequelize.define(
  "Promotion",
  {
    promotionid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    enddate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    imageurl: { type: DataTypes.STRING, allowNull: true }, likes: { type: DataTypes.INTEGER, defaultValue: 0 }, isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
    },
  },
  {
    tableName: "promotions",
    timestamps: false,
  }
);
