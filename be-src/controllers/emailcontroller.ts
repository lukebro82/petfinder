import { Resend } from "resend";
import { getMail } from "./authcontroller";
import { searchPetById } from "./petcontroller";
import { getUserAuth } from "./usercontroller";

const resend = new Resend(process.env.RESEND);

export async function sendMail(petid, message, from, tel) {
  const petEmail = await searchPetById(petid);
  const UserId = petEmail.get("UserId");
  const userAuth = await getUserAuth(UserId);

  const mail: any = await getMail(userAuth);

  await resend.emails.send({
    from: "Pet Finder App <onboarding@resend.dev>",
    to: [mail],
    subject: `Hola ${from} vio a tu mascota`,
    html: `Hola ${from} vio a tu mascota su telefeno de contacto es: ${tel} 
           te dejo este mensaje: ${message}`,
  });
}
