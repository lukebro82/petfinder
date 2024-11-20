import "./state.ts";
import "./router.ts";
import "./components/header/index.ts";
import "./components/buttonel/buttonel.ts";
import "./components/cards/cards.ts";
import "./pages/homepage/homepage.ts";
import "./pages/homemascotas/homemascotas.ts";
import "./pages/authingresar/authingresar.ts";
import "./pages/registro/registro.ts";
import "./pages/reportpet/reportpet.ts";
import "./pages/mascotasreportadas/mascotasreportadas.ts";
import "./pages/editarmascota/editarmascota.ts";
import "./pages/userdata/userdata.ts";
import "./pages/userdata/userdatapersonal.ts";
import "./pages/userdata/userdatapass.ts";
import { state } from "./state.ts";

function main() {
  state.init();
}

main();
