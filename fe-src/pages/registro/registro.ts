import { state } from "../../state";
import { Router } from "@vaadin/router";
import Swal from "sweetalert2";

export class Registro extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <el-header></el-header>
        <div class="homepage"> 
         
         
         <h1 class="form-h1">Registrarse</h1>
         <h3 class="form-h3">Ingresá los siguientes datos para <br> realizar el registro</h3>

        <form class="form-registro">
        <label class="registro-label">NOMBRE</label>
        <input class="registro-input" name="name" type="text">
        <label class="registro-label">EMAIL</label>
        <input class="registro-input" name="email" type="email">
        <label class="registro-label">CONTRASEÑA</label>
        <input class="registro-input" name="password" type="password">
        <label class="registro-label">CONFIRMAR CONTRASEÑA</label>
        <input class="registro-input" name="passwordcheck" type="password">
             
        <el-button button-color="#5A8FEC" class="form-button" >Registrarse</el-button>
   
        </form>   
        
        <p class="text-form">Ya tenes una cuenta?  <a href="" class="form-a" >Iniciar sesión.</a></p>       
               
        </div>
  
  `;

    const form = this.querySelector(".form-registro");
    form?.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const name = e.target?.name.value;
      const email = e.target?.email.value;
      const password = e.target?.password.value;
      const passwordcheck = e.target?.passwordcheck.value;

      if (password != passwordcheck) {
        Swal.fire({
          icon: "error",
          title: "Las contraseñas no coiciden",
          confirmButtonColor: "#9CBBE9",
        });
      } else if (
        name == "" ||
        email == "" ||
        password == "" ||
        passwordcheck == ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Tienes que completar todos los campos",
          confirmButtonColor: "#9CBBE9",
        });
      } else {
        state.userSignUp(name, email, password).then((res) => {
          state
            .userLogin(email, password)
            .then((res) => {
              state.data.userEmail = email;
              state.data.token = res.token;
            })
            .then(() => {
              Router.go("/");
            });
        });
      }
    });

    const style = document.createElement("style");
    style.innerHTML = `
       .homepage {
                  padding-top: 10px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  height: 92vh;
                  gap: 40px;
                  background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%)
                 }
      .form-registro {
                  display: flex;
                  flex-direction: column;
                  gap: 20px;
                 }
     .registro-input{
                  width: 335px;
                  height: 50px;
                  border-radius: 4px;
                  border-style: none;
                 }         
     .form-h1 {
                 font-family: Poppins;
                 font-size: 36px;
                 font-weight: 700;
                 line-height: 54px;
                 text-align: center;
                 margin: 0
                 }
     .form-h3  {
                font-family: Poppins;
                font-size: 20px;
                font-weight: 400;
                line-height: 18.75px;
                text-align: center;
                margin: 0
              }
    .form-a{ 
               text-decoration: none;
               font-family: Roboto;
               font-size: 19px;
               font-weight: 400;
               line-height: 18.75px;
               margin: 0px;
               color: #5A8FEC;
              text-align: center;
            }

    .text-form{
              font-family: Roboto;
              font-size: 19px;
              font-weight: 400;
              line-height: 18.75px;
              margin: 0px;
          }
    .registro-label{
             font-family: Poppins;
             font-size: 16px;
             font-weight: 400;
             line-height: 24px;     
         }
           .form-button{
           margin: 0 auto
           } 

  `;

    this.appendChild(style);
  }
}

customElements.define("registro-home", Registro);
