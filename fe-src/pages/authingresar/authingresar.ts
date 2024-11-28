import { Router } from "@vaadin/router";
import { state } from "../../state";
import Swal from "sweetalert2";

const ingrearLogo = require("../../images/ingresar.svg");

export class Authingresar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <el-header></el-header>
        <div class="homepage"> 
         
         <img class="ingresar-logo" src=${ingrearLogo} alt="">
         <h1 class="form-h1">Ingresar</h1>
         <h3 class="form-h3">Ingresá tu email para continuar.</h3>

        <form class="form-ingresar">
        <label class="form-label">EMAIL</label>
        <input class="ingresar-input" name="email" type="email">
        <label class="form-label">CONTRASEÑA</label>
        <input class="ingresar-input" name="password" type="password">
             
        <a class="form-a" href="">Olvidé mi contraseña</a>

        <el-button button-color="#5A8FEC" class="form-button" >Acceder</el-button>
   
        </form>   
        
        <p class="text-form">Aún no tenes cuenta? <a href="" class="form-a" id="registro" >Registrate.</a></p>       
               
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
                  gap: 40px;
                  background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%)
                 }
      .form-ingresar {
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                 }
     .ingresar-input{
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
    .form-label{
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

    const formIngresar = document.querySelector(".form-ingresar");
    formIngresar?.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      state.userLogin(email, password).then((res) => {
        if (res.error) {
          Swal.fire({
            icon: "error",
            title: "El mail o la contraseña no coiciden",
            confirmButtonColor: "#9CBBE9",
          });
        } else {
          state.data.userEmail = email;
          state.data.token = res.token;
          Router.go("/");
        }
      });
    });

    const resgitrateLink = document.getElementById("registro");
    resgitrateLink?.addEventListener("click", () => {
      Router.go("/registro");
    });
  }
}

customElements.define("auth-ingresar", Authingresar);
