import React, { useState, useEffect } from "react";
import InscripcionDataService from "../services/inscripcion";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "reactstrap";
import Cookies from 'universal-cookie'
const cookies = new Cookies();


const CarsList = (props) => {

    const [carrerasDisponibles, setCarrerasDisponibles] = useState([]);
    const [clasesDisponibles, setClasesDisponibles] = useState([]);
    const [carreraSeleccionada, setCarreraSeleccionada] = useState([]);

    useEffect(() => {
        retrieveCarreras();
    }, []);

    const onChangesetSelectedClass = (e) => {
        const clase = e.target.value;
        console.log('Carreras Disponibles: ', carrerasDisponibles);
        console.log('clase: ', clase);
        const carreraData = carrerasDisponibles.find(clase => clase.carreraNombreClase === clase);
        // console.log('Clase Seleccionada: ', carreraId);
        console.log('Carrera Seleccionada: ', carreraData);
        setCarreraSeleccionada(carreraData);
      };
    /*
        En principio para anotarse se pediria
            Clase en la que se quiere correr
            Auto con el que se quiere correr (se tiene que tener autos registrados)
            Dni
            fecha (determinada por el viernes mas proximo cargado en el sistema en la tabla Carreras)

        Para traer las clases disponibles, primero tenemos que recorrer la tabla de carreras
        DONE - al recorrer la tabla de carreras, buscamos todos los documentos que tengan fecha del proximo viernes mas cercano
        DONE - al tener todos esos documentos, podemos recorrerlos para obtener el ID de clase de cada uno de esos documentos, teniendo
            asi entonces todas las clases disponibles para el viernes mas proximo
        TODO ACA - teniendo todos los id de clase disponibles, podemos ofrecer el dropdown con los valores de clases que se pueden elegir
        - la fecha es dada por la data de lo obtenido en la tabla de carreras
        DONE - antes de habilitar la clase para ser seleccionada, se debe tambien validar que para esa carrera(fecha) haya cupos disponibles
    */ 
    const retrieveCarreras = async () => {
    const response = await InscripcionDataService.getAvailable();
    
    console.log("Data: ", response.data.availableRaces);
    const clasesDisponiblesList = response.data.availableRaces.map((carrera) => {
        return carrera.carreraNombreClase;
    });
    // clasesDisponiblesList.push(response.data.availableRaces[0].carreraNombreClase);
    setCarrerasDisponibles(response.data.availableRaces);
    setClasesDisponibles(clasesDisponiblesList);
    // console.log('So: ', clasesDisponibles);
    };
    
    if (cookies.get("_id")){
        return (
            <div class="container-fluid">
                {/*
                <div className="input-group col-lg-4">
                    <p class="h1 text-center">Clases disponibles para este viernes </p>
                    
                  </div> */}
                <p class="h1 text-center">Inscripcion a Carrera</p>
                <form>
                    <div class="form-group align-items-center">
                        <label for="exampleInputEmail1">Clases disponibles para este viernes </label>
                        <select onChange={onChangesetSelectedClass}>
                            {clasesDisponibles.map(param => {
                                return (
                                    <option value={param}> {param} </option>
                                    )
                                })}
                        </select>
                        <br></br>
                        <label for="tiempoClase">Tiempo de la clase seleccionada: {carreraSeleccionada.tiempoClase}</label>
                        {/* <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"> */}
                        {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
                    </div>
                    <div class="form-group align-items-center">
                        <div className="form-row align-items-center">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                    </div>
                    <div class="form-group align-items-center form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
                        <label class="form-check-label" for="exampleCheck1">Check me out</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
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
