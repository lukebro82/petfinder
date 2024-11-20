import { Auth } from "./auth";
import { User } from "./user";
import { Pet } from "./pet";

Auth.hasOne(User);
User.belongsTo(Auth);
User.hasMany(Pet);
Pet.belongsTo(User);

export { User, Pet, Auth };
