import React, { useState, useEffect } from "react";
import fondo from '../assets/profilePics/galvez.jpg'
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "reactstrap";
import Cookies from 'universal-cookie'
import "../styles/inicio.css";
const cookies = new Cookies();


const divStyle = {
    color: 'blue',
    backgroundImage: "url(https://cdn.pixabay.com/photo/2021/09/02/16/48/cat-6593947_960_720.jpg)",
  };
  


const CarsList = (props) => {

    const [cars, setCars] = useState([]);
        return (
            <div style={divStyle}>
                <div className="" >
                    <img className="imagenFondo"  alt=""/>
                    <p className="h1 text-center">Bienvenido a S4R</p>
                </div>
            </div>
        );
    
};

export default CarsList;
