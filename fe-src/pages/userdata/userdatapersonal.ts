import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Userdatapersonal extends HTMLElement {
  connectedCallback() {
    if (state.data.token == "") {
      Router.go("/auth-ingresar");
    } else {
      this.render();
    }
  }

  render() {
    this.innerHTML = `
        <el-header></el-header>
        <div class="homepage"> 
         
         <h1 class="h1-datos">Datos <br> personales</h1>
       
   
         <form class="datos-form">
              
              <label class="datos-label">NOMBRE</label> 
              <input class="datos-input" name="name" type="text" value="">
              <label class="datos-label">LOCALIDAD</label> 
              <input class="datos-input" name="location" type="text">

              <el-button button-color="#5A8FEC" class="guardar">Guardar</el-button>
         </form>
              <el-button button-color="#5A8FEC" class="volver-button">Volver</el-button>     
        </div>
  
  `;

    const style = document.createElement("style");
    style.innerHTML = `
       .homepage {
                  padding-top: 10px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  height: 92vh;
                  gap: 45px;
                  background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%)
                 }
        .datos-form{ 
                display: flex;
                flex-direction: column;
                gap:20px;
                }       
        .h1-datos{
                padding: 8px;
                font-weight: 800;
                font-size: 38px; 
                text-align: center;
                line-height: 1.5;
                 }
        .datos-input{ 
                width: 335px;
                height: 50px;
                border-radius: 4px;
                border-style: none;
        }
       .datos-label{
                font-family: Poppins;
                font-size: 16px;
                font-weight: 400;
                line-height: 24px;  
        }
       .guardar{
       margin: 0 auto;
       }
   
  `;

    this.appendChild(style);

    const datosForm = document.querySelector(".datos-form");
    datosForm?.addEventListener("submit", (e: any) => {
      const name = e.target["name"].value;
      const location = e.target["location"].value;
      state.patchUser(name, location).then(() => {
        Router.go("/user-data");
      });
    });

    const cancelarButton = document.querySelector(".volver-button");
    cancelarButton?.addEventListener("click", () => {
      Router.go("/user-data");
    });
  }
}

customElements.define("user-datapersonal", Userdatapersonal);
