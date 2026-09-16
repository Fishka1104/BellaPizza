// models/order.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Order = sequelize.define(
  "Order",
  {
    orderid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    totalamount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,

      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(
        "New",
        "Preparing",
        "Delivering",
        "Completed",
        "Cancelled",
      ),
      allowNull: false,
      defaultValue: "New",
    },
    paymentmethod: {
      type: DataTypes.ENUM("Cash", "Card", "Online"),
      allowNull: false,
    },
    deliveryaddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  },
);
