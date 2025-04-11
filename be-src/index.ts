import "./devenv";
import * as express from "express";
import * as path from "path";
import {
  createUser,
  createAuth,
  createToken,
  authMiddleware,
  patchAuth,
} from "./controllers/authcontroller";
import {
  createPet,
  cloudinaryPetPhoto,
  createAlgolia,
  searchAlgolia,
  searchPetByUserId,
  searchAlgoliaPet,
  searchCloudinaryPet,
  deletePet,
  patchPet,
} from "./controllers/petcontroller";
import { patchUser } from "./controllers/usercontroller";

import * as cors from "cors";
import { sendMail } from "./controllers/emailcontroller";
import { PetUpdateData } from "./models/pet";

const app = express();
const port = 3000;
app.use(express.json({ limit: "50mb" }));
// app.use(cors());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// crear usuario nuevo signup
app.post("/auth", async (req, res) => {
  const { name, location, email, password } = req.body;

  try {
    const newAuth = await createAuth(email, password);
    const userNew = await createUser(name, location, newAuth.get("id"));

    res.status(201).json({ message: "Usuario creado con exito" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//signin
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await createToken(email, password);

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// create pet report
app.post("/pet", authMiddleware, async (req, res) => {
  const { name, photo, last_lat, last_lng, lastLocation } = req.body;
  const UserId = req._user.id;

  try {
    const photoURL = await cloudinaryPetPhoto(photo);

    const petCreated = await createPet(
      name,
      lastLocation,
      photoURL,
      last_lng,
      last_lat,
      UserId
    );

    const idPet = petCreated.get("id");
    const resAlgolia = await createAlgolia(idPet, last_lat, last_lng);

    res.status(200).json({ message: "mascota creada" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar pet cerca
app.get("/pets/cerca", async (req, res) => {
  const { last_lat, last_lng } = req.query;

  try {
    const respuesta = await searchAlgolia(last_lat, last_lng);

    res.status(200).json({ message: respuesta });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Busca pet propios
app.get("/pets/mios", authMiddleware, async (req, res) => {
  const UserId = req._user.id;

  try {
    const respuesta = await searchPetByUserId(UserId);
    res.status(200).json({ message: respuesta });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.get("/pet", authMiddleware, async (req, res) => {
//   const { id } = req.query;
//   const respuesta = await searchPetById(id);
//   res.status(200).json({ message: respuesta });
//   try {
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Borrar una mascota
app.delete("/pet", authMiddleware, async (req, res) => {
  const { id, photoURL } = req.body;

  const petAlgolia = await searchAlgoliaPet(id);
  const clodyData = await searchCloudinaryPet(photoURL);

  try {
    const respuesta = await deletePet(id, clodyData, petAlgolia.objectID);
    res.status(200).json({ message: respuesta });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Modificar una mascota
app.patch("/pet", authMiddleware, async (req, res) => {
  const { id, name, photo, lat, lng, location } = req.body;
  const UserId = req._user.id;

  const photoURL = await cloudinaryPetPhoto(photo);

  const pet: PetUpdateData = {
    id,
    name,
    photoURL: photoURL,
    last_lat: lat,
    last_lng: lng,
    lastLocation: location,
    UserId,
  };

  try {
    const respuesta = await patchPet(pet);

    res.status(200).json({ message: respuesta });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/user", authMiddleware, async (req, res) => {
  const UserId = req._user.id;
  const { name, location } = req.body;

  try {
    const respuesta = await patchUser(UserId, name, location);
    res.status(200).json({ message: respuesta });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/auth", authMiddleware, async (req, res) => {
  const UserId = req._user.id;
  const { email, password } = req.body;

  try {
    const respuesta = await patchAuth(UserId, email, password);
    res.status(200).json({ message: respuesta });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/mail", async (req, res) => {
  const { petid, message, from, tel } = req.body;

  try {
    await sendMail(petid, message, from, tel);

    res.status(200).json({ message: "Email mandado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// app.post("/test", async (req, res) => {
//   const { id, photoURL } = req.body;

//   const petAlgolia = await searchAlgoliaPet(id);
//   const clodyData = await searchCloudinaryPet(photoURL);

//   res.status(200).json({ publicId: clodyData, objectID: petAlgolia.objectID });
// });

const staticDirPath = path.resolve(__dirname, "../fe-dist");
// console.log(staticDirPath);

app.use(express.static(staticDirPath));

app.get("*", (req, res) => {
  res.sendFile(staticDirPath + "/index.html");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
