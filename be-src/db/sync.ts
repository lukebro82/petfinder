import "../devenv";
import { sequelize } from ".";
import { Auth, User, Pet } from "../models/models";

Auth.sequelize.sync({ force: true }).then((res) => {
  console.log(res);
});
