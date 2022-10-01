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
    <section className="vh-100 img-fluid  imagenFondo">
      <div className="m-0 vh-100  p-5 row justify-content-center text-center">
        
        <div className="col-auto justify-center ">
        <p className=" text-center h1 text-white">Bienvenido a S4R asdasd</p>

          <a href="#" className="btn btn-success">
            Centrar boton
          </a>
          <a href="#" className="btn btn-success">
            Centrar boton
          </a>
        </div>
      </div>
    </section>
  );
};

export default CarsList;
