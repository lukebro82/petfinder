import { User, Auth } from "../models/models";
import * as crypto from "crypto";
//@ts-ignore
import * as jwt from "jsonWebToken";

const secretWord = process.env.SECRET;

function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function createAuth(email, password) {
  const passwordHasheado = await getSHA256ofString(password);
  try {
    let auth = await Auth.findOne({ where: { email } });
    if (auth) {
      throw new Error("Ya existe el email");
    }
    auth = await Auth.create({
      email,
      password: passwordHasheado,
    });
    return auth;
  } catch (error) {
    throw error;
  }
}

export async function createUser(name: string, location: string, auth_id) {
  try {
    let user = await User.create({ name, location, AuthId: auth_id });
    return user;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("error al crear el usuario");
    }
    throw error.message;
  }
}

export async function createToken(email: string, password: string) {
  const passwordHaseado = await getSHA256ofString(password);

  try {
    const userAuth: any = await Auth.findOne({
      where: { email, password: passwordHaseado },
      include: { model: User, attributes: ["id"] },
    });

    if (userAuth) {
      const userId = userAuth.User.id;
      const token = jwt.sign({ id: userId }, secretWord);
      return token;
    }
    if (!userAuth) {
      throw new Error("Mail o contraseña invalida");
    }
  } catch (error) {
    throw error;
  }
}

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const data = jwt.verify(token, secretWord);
    req._user = data;
    next();
  } catch (error) {
    res.status(401).json({ error: "no autorizado" });
  }
}

export async function patchAuth(id, email, password) {
  try {
    const userAuthId: any = (await User.findByPk(id)).get("AuthId");

    const auth = await Auth.findByPk(userAuthId);
    const passwordHasheado = await getSHA256ofString(password);

    await auth.update(
      {
        email,
        password: passwordHasheado,
      },
      { where: { id: id } }
    );

    return auth;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("cannot patch Auth");
    }
    throw error.message;
  }
}

export async function getMail(authId) {
  const authMail = (await Auth.findByPk(authId)).get("email");

  return authMail;
}
