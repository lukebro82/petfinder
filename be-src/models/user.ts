import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/index";

export class User extends Model {}
User.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "User" }
);
