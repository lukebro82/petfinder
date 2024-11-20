import { Router } from "@vaadin/router";
import { state } from "../../state";
import Swal from "sweetalert2";

export class Userdatapass extends HTMLElement {
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
         
         <h1 class="h1-datos">Contraseña</h1>
       
   
         <form class="datos-form">
              
              <label class="datos-label">CONTRASEÑA</label> 
              <input class="datos-input" name="pass1" type="password">
              <label class="datos-label">CONFIRMAR CONTRASEÑA</label> 
              <input class="datos-input" name="pass2" type="password">

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
      if (e.target["pass1"].value == e.target["pass2"].value) {
        state
          .newPassword(state.data.userEmail, e.target["pass1"].value)
          .then(() => {
            Router.go("/user-data");
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Las contraseñas no coiciden",
          confirmButtonColor: "#9CBBE9",
        });
      }
    });

    const cancelarButton = document.querySelector(".volver-button");
    cancelarButton?.addEventListener("click", () => {
      Router.go("/user-data");
    });
  }
}

customElements.define("user-datapass", Userdatapass);
