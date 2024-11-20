import { Router } from "@vaadin/router";
import { state } from "../../state";
import Swal from "sweetalert2";
const xIcon = require(`./../../images/xicon.svg`);

export class Homemascotas extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <el-header></el-header>
      <div class="homepage"> 

       <h1 class="homemascotas-h1">Mascotas perdidas cerca</h1>


       ${
         state.data.petCerca.length == 0
           ? `<h2 class="homemascotas-h1">No hay mascotas cerca</h2>`
           : `${state.data.petCerca
               .map((e: any) => {
                 return `<card-el name="${e.name}" location="${e.lastLocation}" photo="${e.photoURL}" texto="Reportar" id="${e.id}"> </card-el>
                 
                  <div id="div${e.id}" class="div-reportpet">   
                     <img id="xicon${e.id}" class="xicon" src=${xIcon} alt="">

                     <form id="fomr${e.id}" class="form-reportpet">
                        <label class="reportpet-label">NOMBRE</label> 
                      <input class="reportpet-input" name="name" type="text">
                    <label class="reportpet-label">TELEFONO</label> 
                      <input class="reportpet-input" name="phone" type="text">
                    <label class="reportpet-label">DONDE LO VISTE?</label>             
                      <textarea id="message" name="message" rows="4" cols="50"></textarea>

                    <el-button button-color="#00A884" class="enviar-reporte">Enviar información</el-button>  
                  
                    </form>
                 
                </div>
                                                                                 
                 `;
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
                overflow-y: auto; /* Habilita desplazamiento vertical */
                          
               }
      .homemascotas-h1{
       padding-top: 8px;   
       font-weight: 800;
       font-size: 28px;
      }

      .div-reportpet-open{
         background-color: #26302E; 
         position: absolute;
         z-index: 1;
         left: 0px;
         right: 0px;
         top: 0px;
         bottom: 0px;
         font-size: 26px;
         color: white;
         text-align: center;  
         width: 100%;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
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

     .div-reportpet{
         display: none;
    }

    .form-reportpet{
         display: flex;
         flex-direction: column;
         justify-content: center;   
         gap: 15px;
    }
`;

    this.appendChild(style);

    state.data.petCerca.forEach((e: any) => {
      const card = document.getElementById(e.id);
      const div = document.getElementById(`div${e.id}`);
      const xIconButton = document.getElementById(`xicon${e.id}`);
      const form = document.getElementById(`fomr${e.id}`);

      if (card) {
        card.addEventListener("click", () => {
          div?.classList.replace("div-reportpet", "div-reportpet-open");
        });
        xIconButton?.addEventListener("click", () => {
          div?.classList.replace("div-reportpet-open", "div-reportpet");
        });
        form?.addEventListener("submit", (event: any) => {
          const name = event.target["name"].value;
          const phone = event.target["phone"].value;
          const message = event.target["message"].value;

          state.senMail(e.id, message, name, phone).then((res) => {
            Router.go("/");
            Swal.fire("Email mandado!");
          });
        });
      }
    });
  }
}

customElements.define("home-mascotas", Homemascotas);
