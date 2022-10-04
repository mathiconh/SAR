import React, { useState, useEffect } from "react";
import InscripcionDataService from "../services/inscripcion";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "reactstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const CarsList = (props) => {
  const [carrerasDisponibles, setCarrerasDisponibles] = useState([]);
  const [clasesDisponibles, setClasesDisponibles] = useState([
    "Seleccionar Clase",
  ]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState([]);

  useEffect(() => {
    retrieveCarreras();
  }, []);

  const onChangesetSelectedClass = (e) => {
    const clase = e.target.value;
    console.log("Carreras Disponibles: ", carrerasDisponibles);

    const carreraData = carrerasDisponibles.find(
      (carrera) => carrera.carreraNombreClase === clase
    );
    console.log("Carrera Seleccionada: ", carreraData);
    if (carreraData) setCarreraSeleccionada(carreraData);
  };
  /*
        En principio para anotarse se pediria
            Partial - Clase en la que se quiere correr
            PENDIENTE - Auto con el que se quiere correr (se tiene que tener autos registrados)
            PENDIENTE - Dni (COOKIES ?)
            PENDIENTE - PAGAR CON MP
    */
  const retrieveCarreras = async () => {
    const response = await InscripcionDataService.getAvailable();

    console.log("Data: ", response.data.availableRaces);
    const clasesDisponiblesList = response.data.availableRaces.map(
      (carrera) => {
        return carrera.carreraNombreClase;
      }
    );
    setCarrerasDisponibles(response.data.availableRaces);

    ordenarClases(clasesDisponiblesList);
    console.log("Clases Detectadas: ", clasesDisponiblesList);

    setClasesDisponibles(["Seleccionar Clase"].concat(clasesDisponiblesList));
    // setClasesDisponibles(clasesDisponiblesList);
  };

  function ordenarClases(clasesDisponiblesList) {
    clasesDisponiblesList.sort((claseA, claseB) => {
      const nameA = claseA.toUpperCase(); // Para ignorar mayusculas y minusculas en la comparacion
      const nameB = claseB.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      // Nombres iguales
      return 0;
    });
  }

  if (cookies.get("_id")) {
    return (
      <div className="container-fluid">
        {clasesDisponibles.map((param) => {
          return (
            <div className="card col-3 mt-2">
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          );
        })}

        {/*
                <div className="input-group col-lg-4">
                    <p className="h1 text-center">Clases disponibles para este viernes </p>
                    
                  </div> */}
        <p className="h1 text-center">Inscripcion a Carrera</p>
        <form>
          <div className="form-group align-items-center">
            <label htmlFor="exampleInputEmail1">
              Clases disponibles para este viernes{" "}
            </label>
            <select onChange={onChangesetSelectedClass}>
              {clasesDisponibles.map((param) => {
                return <option value={param}> {param} </option>;
              })}
            </select>
            <br></br>
            <label htmlFor="tiempoClase">
              Tiempo de la clase seleccionada: {carreraSeleccionada.tiempoClase}
            </label>
            {/* <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"> */}
            {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
          </div>
          <div className="form-group align-items-center">
            <div className="form-row align-items-center">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
              ></input>
            </div>
          </div>
          <div className="form-group align-items-center form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            ></input>
            <label className="form-check-label" htmlFor="exampleCheck1">
              Check me out
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    );
  } else {
    window.location.href = "./login";
    console.log("Necesita logearse para poder acceder al ABM de Autos");
    <Alert
      id="errorMessage"
      className="alert alert-danger fade show"
      key="danger"
      variant="danger"
    >
      Necesita logearse para poder acceder al ABM de Autos
    </Alert>;
  }
};

export default CarsList;
