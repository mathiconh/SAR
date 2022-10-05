import React, { useState, useEffect } from "react";
import InscripcionDataService from "../services/inscripcion";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "reactstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const CarsList = (props) => {
    const defaultInsc = {
        carreraId: '',
        claseId: '',
        dni: '',
        vehiculoSeleccionado: '',
        pagarMP: 'off',
      }

  const [carrerasDisponibles, setCarrerasDisponibles] = useState([]);
  const [clasesDisponibles, setClasesDisponibles] = useState(["Seleccionar Clase"]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState([]);
  const [inscripcion, setInscripcion] = useState(defaultInsc);
  // Añadir el mensaje de error en el html
  const [validationErrorMessage, setValidationErrorMessage] = useState("");

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
    if (carreraData) {
        setCarreraSeleccionada(carreraData);
        setInscripcion((prevState) => ({
            ...prevState,
            carreraId: carreraData.carreraId,
            claseId: carreraData.carreraIdClase,
          }
        ));
    }
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setInscripcion((prevState) => ({
        ...prevState,
        [name]: value
      }
    ));
  }
  /*
        En principio para anotarse se pediria
            PENDIENTE - Auto con el que se quiere correr (se tiene que tener autos registrados)
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

  function enviarInscripcion() {
    const result = InscripcionDataService.createInscripcion(inscripcion);
    if (result.status) {
        console.log('Edicion exitosa');
        setValidationErrorMessage('');
        setInscripcion(defaultInsc);
      } else {
        setValidationErrorMessage(result?.errorMessage);
      }
  }

  if (cookies.get("_id")) {
    return (
        <div className="align-self-center">
            <div className="container-lg align-self-center">
                <div className="container-fluid align-self-center">
                    <p className="h1 text-center">Inscripcion a Carrera</p>
                    <div className="form-row">
                        <div className="form-group align-items-center col-md-6">
                            <label htmlFor="exampleInputEmail1">Clases disponibles para este viernes</label>
                            <select onChange={onChangesetSelectedClass}>
                            {clasesDisponibles.map((param) => {
                                return <option value={param}> {param} </option>;
                            })}
                            </select>
                            <label htmlFor="cuposClase">{carreraSeleccionada.aproxCupos}</label>
                            <br></br>
                            <label htmlFor="tiempoClase"> Tiempo de la clase seleccionada: {carreraSeleccionada.tiempoClase}</label>
                        </div>
                        <div className="col align-items-center">
                            <div class="form-group">
                                <label for="inputPassword6">DNI</label>
                                <input type="text" id="inputDni" name="dni" class="col-md-3" onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="form-group align-items-center form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" name="pagarMP" onChange={handleChange}/>
                            <label className="form-check-label" htmlFor="exampleCheck1">Pagar con MercadoPago</label>
                        </div>
                        <button className="btn btn-primary col-md-3" onClick={enviarInscripcion}>
                            Inscribirse
                        </button>
                    </div>
                </div>
            </div>
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


{/* {clasesDisponibles.map((param) => {
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
        })} */}

        {/*
                <div className="input-group col-lg-4">
                    <p className="h1 text-center">Clases disponibles para este viernes </p>
                    
                  </div> */}