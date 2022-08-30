import React, { useState, useEffect } from "react";
import InscripcionDataService from "../services/inscripcion";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "reactstrap";
import Cookies from 'universal-cookie'
const cookies = new Cookies();


const CarsList = (props) => {

    const [carrerasDisponibles, setCarrerasDisponibles] = useState([]);
    const [clasesDisponibles, setClasesDisponibles] = useState([]);

    useEffect(() => {
        retrieveCarreras();
    }, []);


    /*
        En principio para anotarse se pediria
            Clase en la que se quiere correr
            Auto con el que se quiere correr (se tiene que tener autos registrados)
            Dni
            fecha (determinada por el viernes mas proximo cargado en el sistema en la tabla Carreras)

        Para traer las clases disponibles, primero tenemos que recorrer la tabla de carreras
        - al recorrer la tabla de carreras, buscamos todos los documentos que tengan fecha del proximo viernes mas cercano
        - al tener todos esos documentos, podemos recorrerlos para obtener el ID de clase de cada uno de esos documentos, teniendo
            asi entonces todas las clases disponibles para el viernes mas proximo
        - teniendo todos los id de clase disponibles, podemos ofrecer el dropdown con los valores de clases que se pueden elegir
        - la fecha es dada por la data de lo obtenido en la tabla de carreras
        - antes de habilitar la clase para ser seleccionada, se debe tambien validar que para esa carrera(fecha) haya cupos disponibles
    */ 
    const retrieveCarreras = async () => {
    await InscripcionDataService.getAll()
        .then((response) => {
        console.log("Data: ", response.data);
        })
        .catch((e) => {
        console.log(e);
        });
    };
    
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
