class Card extends HTMLElement {
  shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.innerHTML = `
         .root {
          background-color: #26302E; 
          border-radius: 10px;
          max-width:  335px;
          max-height: 264px;    
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          }
        .div-imagen {
           width: 320px;
           height: 136px;
           padding: 7px;
          }   
       .div-inferior{
          width: 320px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          
          }
        .h1-card{
          margin: 0;
          color: white;
          font-size: 28px;
          text-align: left;
          text-wrap: balance;
          width: 180px;
          text-align: left;
          }
        .h2-card{
          margin: 0;
          color: white;
          font-size: 16px;
          text-wrap: balance;
          width: 180px;
          text-align: left;
          padding-top: 4px;
          }

        .button-card{
          width: 120px;
          height: 40px;
          background-color:#EB6372;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px          
          }

        .card-imagen{
         max-width: 320px;
         max-height: 136px;
         width: 100%; 
         height: auto; 
         object-fit: cover;
         border-radius: 4px;
        }
          
        
        
        `;
    this.shadow.appendChild(style);
    this.render();
  }

  render() {
    const cardEl = document.createElement("div");
    cardEl.className = "root";
    const name = this.getAttribute("name");
    const location = this.getAttribute("location");
    const photo = this.getAttribute("photo");
    const texto = this.getAttribute("texto");

    cardEl.innerHTML = `
        
      <div class="div-imagen">
           <img class="card-imagen" src=${photo} art="">
      </div> 
      <div class="div-inferior">
        <div class="textos-div">
             <h1 class="h1-card">${name}</h1>
             <h2 class="h2-card">${location}</h2>
        </div>
        <div class="button-div">
            <button class="button-card" >${texto}</button>
        </div>
      
      </div>
    
    
    `;
    this.shadow.appendChild(cardEl);

    const button: any = cardEl.querySelector(".button-card");
    const color = this.getAttribute("color");

    if (color && button) {
      button.style.backgroundColor = color;
    }
  }
}

customElements.define("card-el", Card);
