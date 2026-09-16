import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PromotionComment = sequelize.define(
  "PromotionComment",
  {
    commentid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    promotionid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "promotion_comments",
    timestamps: false,
  },
);
