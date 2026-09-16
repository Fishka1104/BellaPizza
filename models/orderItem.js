// models/orderItem.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const OrderItem = sequelize.define(
  "OrderItem",
  {
    orderitemid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    orderid: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    menuitemid: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, 
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, 
      },
    },
  },
  {
    tableName: "orderitems",
    timestamps: false,
  }
);
