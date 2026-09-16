// models/userRole.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const UserRole = sequelize.define(
  "UserRole",
  {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    roleid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "userroles",
    timestamps: false,
  }
);
