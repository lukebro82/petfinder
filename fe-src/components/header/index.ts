import { Router } from "@vaadin/router";
import { state } from "../../state.ts";

const menuHeader = require(`./../../images/menu.svg`);
const mapsLogo = require(`./../../images/image8.svg`);
const xIcon = require(`./../../images/xicon.svg`);

class HeaderEl extends HTMLElement {
  shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.innerHTML = `
    .root{
          height: 8vh;
          background-color: #26302E; 
          margin: 0 auto;
          display: flex;
          flex-direction: row;
          justify-content: space-between; 
          align-items: center;
          padding: 0 10px;   
    }

    .burger-menu{
         display: none;
    }

    .burger-menu-open{
         background-color: #26302E; 
         position: absolute;
         z-index: 5;
         left: 0;
         right: 0;
         top: 0;
         bottom: 0;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         font-size: 32px;
         gap: 38px;
         color: white;
         text-align: center;

    }
    
    .burger-link{
        text-decoration: none;
    }
    .burger-link:hover{
        cursor: pointer;
    }

    .burger{
        width: 35px;
        height: 35px;
    }

    .xicon {
         position: absolute;
         right: 0;
         top: 0;
         z-index: 2;
         margin: 15px 15px;
         width: 30px;
         height: 30px;
     }

    .cerrar-sesion {
        font-size: 22px;
        color: aqua;
    }
    
     .cerrar-sesion:hover {
        cursor: pointer;
    }
     
                      `;

    this.shadow.appendChild(style);
    this.render();
  }

  render() {
    const headerEl = document.createElement("div");

    headerEl.className = "root";
    headerEl.innerHTML = `
    <img class="mapslogo" src=${mapsLogo} alt="">
    
    <div class="burger-menu">
       <img class="xicon" src=${xIcon} alt="">
       <a class="burger-link" id="mis-datos">Mis datos</a>
       <a class="burger-link" id="mis-mascotas">Mis mascotas<br>reportadas</a>
       <a class="burger-link" id="reportar-mascota">Reportar mascotas</a>

       <div> ${
         state.data.token !== ""
           ? `<h5>${state.data.userEmail}</h5> <a class="cerrar-sesion">CERRAR SESIÓN</a> `
           : ``
       } </div>
    </div>

    <img class="burger" src=${menuHeader} alt="">
    `;
    this.shadow.appendChild(headerEl);

    const mapsLogoImg = this.shadow.querySelector(".mapslogo");
    const burger = this.shadow.querySelector(".burger");
    const burgerMenu = this.shadow.querySelector(".burger-menu");
    const xIconButton = this.shadow.querySelector(".xicon");
    const reportarMascota = this.shadow.getElementById("reportar-mascota");
    const misMascotas = this.shadow.getElementById("mis-mascotas");
    const logOut = this.shadow.querySelector(".cerrar-sesion");
    const misDatos = this.shadow.getElementById("mis-datos");

    misDatos?.addEventListener("click", () => {
      Router.go("/user-data");
      burgerMenu?.classList.replace("burger-menu-open", "burger-menu");
    });

    mapsLogoImg?.addEventListener("click", () => {
      Router.go("/");
    });
    burger?.addEventListener("click", () => {
      burgerMenu?.classList.replace("burger-menu", "burger-menu-open");
    });
    xIconButton?.addEventListener("click", () => {
      burgerMenu?.classList.replace("burger-menu-open", "burger-menu");
    });
    logOut?.addEventListener("click", () => {
      state.logout();

      Router.go("/");
      location.reload();
      // setTimeout(() => {

      // }, 100);
    });

    misMascotas?.addEventListener("click", () => {
      if (state.data.token == "") {
        Router.go("/auth-ingresar");
        burgerMenu?.classList.replace("burger-menu-open", "burger-menu");
      } else {
        Router.go("/mascotas-reportadas");
        burgerMenu?.classList.replace("burger-menu-open", "burger-menu");
      }
    });
    reportarMascota?.addEventListener("click", () => {
      if (state.data.token == "") {
        Router.go("/auth-ingresar");
        burgerMenu?.classList.replace("burger-menu-open", "burger-menu");
      } else {
        Router.go("/reporte-mascota");
        burgerMenu?.classList.replace("burger-menu-open", "burger-menu");
      }
    });
  }
}

customElements.define("el-header", HeaderEl);
