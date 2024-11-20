import { Router } from "@vaadin/router";
import { state } from "../../state";
const mainLogo = require("./../../images/mainlogo.svg");

export class Homepage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
  <el-header></el-header>
  <div class="homepage">
      
      <img src="${mainLogo}" alt="">

      <h1 class="home-title">Pet Finder App</h1>

      <h2 class="home-subtitulo">Encontrá y reportá <br> mascotas perdidas <br> cerca de tu ubicación </h2>

      <el-button class="location-button">Dar mi ubicación actual</el-button>
      ${
        state.data.token !== ""
          ? ``
          : `<el-button class="empezar-button" button-color="rgba(0, 168, 132, 1)" >Ingresar</el-button>`
      }
      
 
  </div>
  `;

    const style = document.createElement("style");
    style.innerHTML = `
           
            .homepage {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 92vh;
                text-align: center;
                gap: 10px;
                background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%)
            }
            .home-title{
                color: #EB6372; 
                font-size: 38px;
                font-weight: 800;
                line-height: 54px;
                text-align: center;
                margin: 10 0;
            }
            .home-subtitulo{
                font-size: 26px;
                font-weight: 600;
                line-height: 36px;
                text-align: center;   
                margin: 10 0;
            }
           
        `;
    this.appendChild(style);

    const buttonLocation = document.querySelector(".location-button");

    buttonLocation?.addEventListener("click", () => {
      // Verificamos si la geolocalización está disponible
      if (navigator.geolocation) {
        // Pedimos la ubicación actual
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Si se obtiene la ubicación, la mostramos
            const latitude = position.coords.latitude; // Latitud
            const longitude = position.coords.longitude; // Longitud
            state.data.lat = latitude;
            state.data.lng = longitude;
            state.petsCerca(latitude, longitude).then((res) => {
              state.data.petCerca = res.message;

              Router.go("/home-mascotas");
            });
          },
          (error) => {
            // Manejo de errores
            console.error("Error al obtener la ubicación:", error);
          }
        );
      } else {
        console.log("La geolocalización no está soportada en este navegador.");
      }
    });

    const buttonIngresar = document.querySelector(".empezar-button");

    buttonIngresar?.addEventListener("click", () => {
      Router.go("/auth-ingresar");
    });
  }
}

customElements.define("home-page", Homepage);
