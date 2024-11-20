import { User } from "../models/models";

export async function patchUser(id, name, location) {
  try {
    const newUserData = await User.findByPk(id);

    await newUserData.update(
      {
        name,
        location,
      },
      { where: { id: id } }
    );
    return newUserData;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("cannot patch User");
    }
    throw error.message;
  }
}

export async function getUserAuth(userId) {
  const userData = await User.findByPk(userId);
  const userEmail = userData.get("AuthId");
  return userEmail;
}
