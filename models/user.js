// models/user.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define(
  "User",
  {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    
     address: 
     { type: DataTypes.TEXT, allowNull: true },
    
  },
  {
    tableName: "users",   
    timestamps: false,    
  }
);
