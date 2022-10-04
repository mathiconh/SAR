import React, { useState, useEffect } from "react";
import fondo from "../assets/profilePics/galvez.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "reactstrap";
import Cookies from "universal-cookie";
import "../styles/inicio.css";
const cookies = new Cookies();

const divStyle = {
  color: "blue",
  backgroundImage: "url('../assets/profilePics/galvez.jpg')",
};

const CarsList = (props) => {
  const [cars, setCars] = useState([]);
  return (
    <section className="vh-100 d-flex justify-content-center align-items-center img-fluid  imagenFondo">
        <div className="col-auto  ">
        <p className="  h3 text-white text-center">Veni a probar los tiempos de tu auto</p>
        <p className="  h1 text-white text-center">EN EL GRAN AUTODROMO DE BUENOS AIRES</p>
        <div className="d-flex justify-content-center">
        <div className="m-4">
          <a href="/inscripcion" className="justify-center btn botonPrincipal ml-4">
            INSCRIBITE
          </a>
        </div>
        <div className="m-4">
          <a href="/login" className="justify-center btn botonSecundario">
            INICIAR SESION
          </a>
          </div>
          </div>
        </div>
    </section>
  );
};

export default CarsList;
