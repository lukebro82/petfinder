import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/index";

export class Pet extends Model {}
Pet.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    lastLocation: { type: DataTypes.STRING, allowNull: false },
    photoURL: { type: DataTypes.STRING, allowNull: false },
    petState: { type: DataTypes.BOOLEAN, allowNull: false },
    last_lat: { type: DataTypes.FLOAT, allowNull: true },
    last_lng: { type: DataTypes.FLOAT, allowNull: true },
  },
  { sequelize, modelName: "Pet" }
);

export interface PetUpdateData {
  name: string;
  id: string;
  photoURL: string;
  last_lat: string;
  last_lng: string;
  lastLocation: string;
  UserId: string;
}
