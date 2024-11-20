import { state } from "../../state";
import Dropzone from "dropzone";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Router } from "@vaadin/router";
import Swal from "sweetalert2";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZXplcXVpZWw5MyIsImEiOiJja3U0aTAyc2gwaGg1MnBvNmhyemJzbDc2In0.VfvIXjWgL8_dqs1ZKlQorA";

let map;

const resReport = { name: "", photo: "", lat: 0, lng: 0, location: "" };

export class Reportpet extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /*html*/ `
        <el-header></el-header>
        <div class="homepage-pet-report"> 
         
            <h1 class="form-h1">Reportar mascota</h1>
            <h3 class="form-h3">Ingresá la siguiente información para <br> realizar el reporte de la mascota</h3>

        <form class="form-name">
                 <div class="div-label-input">
                     <label class="registro-label">NOMBRE</label> 
                     <input class="registro-input" name="name" type="text">
                 </div>
               
                 <div class="div-dropzone">
                     <label class="registro-label">Cargar la Imagen</label>  
                     <img class="ropzone">
                 </div>
         </form>

                   <form class="search-form">
                        <label>Buscar por ubicación (Ciudad, Provincia)</label>
                        <input class="registro-input" name="q" type="search">
                        <el-button button-color="#00A884" type="submit" class="buscar-ubi">Buscar</el-button>
                        <label>Seleccionar un punto en el mapa</label>    
                          <div class="map" id='map' style='width: 300px; height: 200px;'></div>  
                           
                   </form>
                      

              <el-button id="button1" button-color="#00A884" class="form-button">Reportar mascota</el-button>
        
              <el-button id="button2" button-color="#4A5553" class="form-button">Cancelar</el-button>  
               
        </div>
  
  `;

    const imgDropzone = this.querySelector(".ropzone") as HTMLImageElement;
    let pictureFile;

    const myDropzone = new Dropzone(".ropzone", {
      url: "/falsa",
      autoProcessQueue: false,
    });

    myDropzone.on("thumbnail", function (file) {
      // usando este evento pueden acceder al dataURL directamente
      pictureFile = file.dataURL;
      imgDropzone.src = pictureFile;
      resReport.photo = pictureFile;
    });

    const style = document.createElement("style");
    style.innerHTML = `
       .homepage-pet-report {
                  padding-top: 10px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  height: 132vh;
                  gap: 40px;
                  background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%)
                 }
       .form-registro-pet {
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

     .ropzone {
      width: 335px;
      height: 180px;
      border-radius: 10px;
      border: 2px dashed #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
   
     }
    .search-form{ 
      display: flex;  
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;

    }

    .map{
    margin: 0 auto
    }

     .div-label-input{
      display: flex;  
      flex-direction: column;
      justify-content: center;

     }


  `;

    this.appendChild(style);

    this.initMap();
    this.buscarDir();

    const formName = this.querySelector(".form-name") as HTMLFormElement | null;
    formName?.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const nameInput = formName.elements.namedItem("name") as HTMLInputElement;
      resReport.name = nameInput.value;

      if (
        resReport.name == "" ||
        resReport.photo == "" ||
        resReport.location == ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Faltan datos",
          confirmButtonColor: "#9CBBE9",
        });
      } else {
        state.createReportPet(resReport).then((res) => {
          Router.go("/mascotas-reportadas");
        });
      }
    });

    const button1 = document.getElementById("button1");
    button1?.addEventListener("click", (e) => {
      e.preventDefault();
      if (formName) {
        formName.requestSubmit();
      }
    });

    const button2 = document.getElementById("button2");
    button2?.addEventListener("click", () => {
      Router.go("/");
    });
  }

  initMap() {
    const mapContainer: any = this.querySelector(".map");
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-58.381775, -34.603851], // Coordenadas del Obelisco en Buenos Aires long-lat
      zoom: 8,
      maxBounds: [
        [-75, -55], // Esquina suroeste de Argentina
        [-53, -20], // Esquina noreste de Argentina
      ],
    });
  }

  initSearchForm(query: string) {
    // Cambiar el cursor a 'wait' mientras se realiza la búsqueda
    map.getCanvas().style.cursor = "wait";

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&country=AR`
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          const placeName = data.features[0].place_name;
          const nameUbicacionPet = placeName.split(" ").slice(0, 4).join(" ");
          const nameUbicacion = nameUbicacionPet.split(",").join("");

          resReport.lng = longitude;
          resReport.lat = latitude;
          resReport.location = nameUbicacion;
          // Centrar el mapa en la ubicación buscada
          map.flyTo({ center: [longitude, latitude], zoom: 15 });

          // Cambiar el cursor a 'crosshair' cuando se está en modo de selección en el mapa
          map.getCanvas().style.cursor = "crosshair";

          // Eliminar marcadores existentes (si los hay)
          if (map.getLayer("marker")) {
            map.removeLayer("marker");
            map.removeSource("marker");
          }

          // Cargar la imagen de una flecha o cualquier otro icono personalizado
          map.loadImage(
            "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
            (error, image) => {
              if (error) throw error;

              // Asegúrate de agregar la imagen solo una vez
              if (!map.hasImage("custom-marker")) {
                map.addImage("custom-marker", image);
              }

              // Agregar el marcador en el punto de la ubicación buscada
              map.addSource("marker", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude], // Coordenadas de la ubicación buscada
                      },
                    },
                  ],
                },
              });

              // Añadir la capa del marcador con el icono personalizado
              map.addLayer({
                id: "marker",
                type: "symbol",
                source: "marker",
                layout: {
                  "icon-image": "custom-marker", // Usamos la imagen cargada
                  "icon-size": 1.0, // Tamaño del marcador (puedes ajustarlo)
                  "icon-anchor": "bottom", // Ancla el marcador en la parte inferior
                },
              });
            }
          );

          // Evento para cambiar la ubicación del marcador al hacer clic en el mapa
          map.on("click", (e) => {
            const { lng, lat } = e.lngLat;

            resReport.lng = lng;
            resReport.lat = lat;
            resReport.location = nameUbicacion;

            // Actualizar el marcador a la nueva ubicación seleccionada
            map.getSource("marker").setData({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                  },
                },
              ],
            });
          });

          // Restablecer el cursor después de la búsqueda
          map.getCanvas().style.cursor = "";
        } else {
          console.error("No se encontraron resultados en Argentina.");
          // Restablecer el cursor si no hay resultados
          map.getCanvas().style.cursor = "";
        }
      })
      .catch((error) => {
        console.error("Error al realizar la búsqueda:", error);
        // Restablecer el cursor en caso de error
        map.getCanvas().style.cursor = "";
      });
  }

  buscarDir() {
    const form = this.querySelector(".search-form") as HTMLFormElement;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target instanceof HTMLFormElement) {
        const query = e.target.q.value;
        if (query.trim() !== "") {
          this.initSearchForm(query);
        }
      }
    });
  }
}

customElements.define("reporte-mascota", Reportpet);
