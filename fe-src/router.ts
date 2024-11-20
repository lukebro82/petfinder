import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/home-mascotas", component: "home-mascotas" },
  { path: "/mascotas-reportadas", component: "mascotas-reportadas" },
  { path: "/editar-mascota", component: "editar-mascota" },
  { path: "/auth-ingresar", component: "auth-ingresar" },
  { path: "/registro", component: "registro-home" },
  { path: "/user-data", component: "user-data" },
  { path: "/user-datapersonal", component: "user-datapersonal" },
  { path: "/user-datapass", component: "user-datapass" },
  { path: "/reporte-mascota", component: "reporte-mascota" },
  { path: "(.*)", redirect: "/" },
]);
