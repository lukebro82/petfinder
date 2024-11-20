import { Router } from "@vaadin/router";
import { state } from "../../state";

const noPetLogo = require("../../images/nopet.svg");

export class Mascotasreportadas extends HTMLElement {
  async connectedCallback() {
    await state.petsMios();

    this.render();
  }

  render() {
    const mascotas = state.data.misPets;
    this.innerHTML = `
      <el-header></el-header>
      <div class="homepage"> 

       <h1 class="homemascotas-h1">Mascotas reportadas</h1>


       ${
         mascotas.length == 0
           ? `<h2 class="homemascotas-h1">No tenes mascotas reportadas</h2>
              <img src="${noPetLogo}">
              <el-button class="reporte-button" button-color="#5A8FEC" >Publicar reporte</el-button>
           `
           : `${mascotas
               .map((e: any) => {
                 return `<card-el name="${e.name}" location="${e.lastLocation}" photo="${e.photoURL}" texto="Editar" color="#5A8FEC" id="${e.id}"> </card-el>`;
               })
               .join("")} `
       }


             
      </div>

`;

    const style = document.createElement("style");
    style.innerHTML = `
     .homepage {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 92vh;
                text-align: center;
                gap: 40px;
                background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
               }
      .homemascotas-h1{
       padding-top: 8px;
       font-weight: 800;
       font-size: 28px;
      }
`;

    this.appendChild(style);

    const reportButton = document.querySelector(".reporte-button");
    reportButton?.addEventListener("click", () => {
      Router.go("/reporte-mascota");
    });

    mascotas.forEach((e: any) => {
      const card = document.getElementById(e.id);

      if (card) {
        card.addEventListener("click", () => {
          state.data.miPetEdit.lat = e.last_lat;
          state.data.miPetEdit.lng = e.last_lng;
          state.data.miPetEdit.location = e.lastLocation;
          state.data.miPetEdit.photo = e.photo;
          state.data.miPetEdit.id = e.id;
          state.data.miPetEdit.name = e.name;

          Router.go("/editar-mascota");
        });
      }
    });
  }
}

customElements.define("mascotas-reportadas", Mascotasreportadas);
