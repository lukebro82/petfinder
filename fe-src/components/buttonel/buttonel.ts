class ButtonEl extends HTMLElement {
  shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.innerHTML = `
      .root{
            width: 270px;
            height: 50px;
            border-style: none; 
            border-radius: 5px;          
            background-color:rgba(90, 143, 236, 1);
            font-size: 18px;
            font-family: "Work Sans", sans-serif;
            color: white;
           }`;

    this.shadow.appendChild(style);
    this.render();
  }

  render() {
    const buttonEl = document.createElement("button");
    buttonEl.textContent = this.textContent;
    buttonEl.className = "root";

    const color = this.getAttribute("button-color");
    if (color) {
      buttonEl.style.backgroundColor = color;
    }

    buttonEl.addEventListener("click", (event) => {
      event.preventDefault(); // Evitar el comportamiento predeterminado de un clic en un botón
      const form = this.closest("form"); // Buscar el formulario más cercano al botón
      if (form) {
        form.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true })
        ); // Disparar manualmente el evento de envío del formulario
      }
    });
    this.shadow.appendChild(buttonEl);
  }
}

customElements.define("el-button", ButtonEl);
