import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Userdata extends HTMLElement {
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
         
         <h1 class="h1-datos">Mis datos</h1>
       
         <div class="div-botones">  
             <el-button button-color="#5A8FEC" class="datos-button" >Modificar datos personales</el-button>
             <el-button button-color="#5A8FEC" class="passmail-button" >Modificar contraseña</el-button>
        </div>
     
            <div> ${
              state.data.token !== ""
                ? `<div class="cerrar-email"><h3>${state.data.userEmail}</h3> 
                <a class="cerrar-sesion">CERRAR SESIÓN</a>
                </div> `
                : ``
            } </div>
            </div>
                             
        </div>
  
  `;

    const style = document.createElement("style");
    style.innerHTML = `
       .homepage {
                  padding-top: 10px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 92vh;
                  gap: 150px;
                  background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%)
                 }
     .h1-datos{
       padding-top: 8px;
       font-weight: 800;
       font-size: 38px;
                 }

    .cerrar-sesion {
       font-weight: 400;
       font-size: 22px;
       color: #3B97D3;
        
                 }

    .cerrar-sesion:hover {
       cursor: pointer;
                }

       .cerrar-email{
        display: flex;
       flex-direction: column;
       align-items: center;
       gap:20px;
       }
       .div-botones{
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 30px;
       }
   
  `;

    this.appendChild(style);

    const datosButton = document.querySelector(".datos-button");
    datosButton?.addEventListener("click", () => {
      Router.go("/user-datapersonal");
    });

    const passButton = document.querySelector(".passmail-button");
    passButton?.addEventListener("click", () => {
      Router.go("/user-datapass");
    });

    const logOut = document.querySelector(".cerrar-sesion");

    logOut?.addEventListener("click", () => {
      state.logout();
      state.data.token = "";
      state.data.userEmail = "";
      state.data.userId = "";
      state.data.misPets = [];
      state.data.petCerca = [];
      state.data.miPetEdit.id = "";
      state.data.miPetEdit.location = "";
      state.data.miPetEdit.name = "";
      state.data.miPetEdit.lat = "";
      state.data.miPetEdit.lng = "";
      state.data.miPetEdit.photo = "";

      Router.go("/");

      setTimeout(() => {
        location.reload();
      }, 100);
    });
  }
}

customElements.define("user-data", Userdata);
