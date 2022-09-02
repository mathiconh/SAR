import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "reactstrap";
import Cookies from 'universal-cookie'
const cookies = new Cookies();


const CarsList = (props) => {

    const [cars, setCars] = useState([]);
    
    if (cookies.get("_id")){
        return (
            <div class="container-fluid">
                <p class="h1 text-center">Bienvenido a S4R</p>
            </div>
        );
    
    }else{    
        window.location.href="./login" 
        console.log("Necesita logearse para poder acceder al ABM de Autos");
        <Alert id='errorMessage' className="alert alert-danger fade show" key='danger' variant='danger'>
            Necesita logearse para poder acceder al ABM de Autos
        </Alert>
    }
};

export default CarsList;
