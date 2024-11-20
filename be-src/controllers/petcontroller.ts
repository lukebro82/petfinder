import { Pet } from "../models/models";
import { cloudinary } from "../lib/cloudinary";
import { extractPublicId } from "cloudinary-build-url";
import { index } from "../lib/algolia";
import { Op, where } from "sequelize";

export async function createPet(
  name,
  lastLocation,
  photoURL,
  last_lng,
  last_lat,
  UserId
) {
  try {
    const petCreated = await Pet.create({
      name,
      lastLocation,
      photoURL,
      petState: true,
      last_lng,
      last_lat,
      UserId,
    });
    return petCreated;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("cannot create pet");
    }
    throw error.message;
  }
}

export async function cloudinaryPetPhoto(updateData) {
  if (updateData) {
    const imagen = await cloudinary.uploader.upload(updateData, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });

    return imagen.secure_url;
  }
}

export async function createAlgolia(id, lat, lng) {
  const petAlgolia = index.saveObject({
    objectID: id,

    _geoloc: {
      lat: lat,
      lng: lng,
    },
  });

  return petAlgolia;
}

export async function searchAlgolia(lat, lng) {
  const results = await index.search("", {
    aroundLatLng: `${lat}, ${lng}`,
    aroundRadius: 1500,
  });

  const arrayResults = results.hits;

  const mapResults = arrayResults.map((e) => {
    return e.objectID;
  });

  const resultados = await Pet.findAll({
    where: { id: { [Op.in]: mapResults } },
  });

  return resultados;
}

export async function searchPetByUserId(id) {
  const results = await Pet.findAll({ where: { UserId: id } });

  return results;
}

export async function searchPetById(id) {
  const results = await Pet.findByPk(id);

  return results;
}

export async function searchAlgoliaPet(objectID) {
  const results = await index.getObject(objectID);

  return results;
}

export async function searchCloudinaryPet(photoURL) {
  const publicId = extractPublicId(photoURL);
  return publicId;
}

export async function deletePet(id, cloudyData, objectID) {
  try {
    // Buscar la mascota en la db
    const petDb = await Pet.findByPk(id);

    // Eliminar en Cloudinary
    const cludyPhotoResult = await cloudinary.api.delete_resources(cloudyData);

    // Eliminar  en Algolia
    const algoliaResult = await index.deleteObject(objectID);

    // Si se encontró la mascota, eliminarla
    if (petDb) {
      await petDb.destroy();
      console.log(`Mascota con ID ${id} eliminada exitosamente.`);
    } else {
      console.log(`No se encontró la mascota con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al eliminar la mascota:", error);
  }
}

export async function patchPet(pet) {
  const petDb = await Pet.findByPk(pet.id);
  const petAlgolia = await searchAlgoliaPet(pet.id);

  try {
    await petDb.update(
      {
        name: pet.name,
        lastLocation: pet.lastLocation,
        photoURL: pet.photoURL,
        last_lng: pet.last_lng,
        last_lat: pet.last_lat,
      },
      { where: { id: pet.UserId } }
    );

    await index.partialUpdateObject({
      objectID: petAlgolia.objectID,
      _geoloc: { lat: pet.last_lat, lng: pet.last_lng },
    });

    return petDb;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("cannot create pet");
    }
    throw error.message;
  }
}
