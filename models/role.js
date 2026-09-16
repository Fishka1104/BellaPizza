// models/role.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Role = sequelize.define(
  "Role",
  {
    roleid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rolename: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);
