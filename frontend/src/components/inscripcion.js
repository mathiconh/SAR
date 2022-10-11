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

    const carreraData = carrerasDisponibles.find((carrera) => carrera.carreraNombreClase === clase);
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

  function onChangeValue(event) {
    // console.log(`Name: ${event.target.name} Value: ${event.target.value}`);
    const {name, value} = event.target;
    setInscripcion((prevState) => ({
      ...prevState,
      [name]: value
    }));
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
        setValidationErrorMessage('success');
        setInscripcion(defaultInsc);
      } else {
        setValidationErrorMessage(result?.errorMessage);
      }
  }

  // Arreglar el problema de que siempre muestra el mensaje de error
  const buildErrorMessage = () => {
    if (validationErrorMessage !== '') {
      return (
        <Alert id='errorMessage' className="alert alert-danger fade show" key='danger' variant='danger'>
          {validationErrorMessage}
        </Alert>
      );
    }

    return;
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
                            <label htmlFor="tiempoClase"> Precio de la inscripcion: {carreraSeleccionada.precio}</label>
                            <br></br>
                            <div onChange={onChangeValue}>
                              <input type="radio" value="off" name="pagarMP" defaultChecked/> Abonar con efectivo al ingresar al predio
                              <input type="radio" value="on" name="pagarMP" /> Abonar con MercadoPago
                            </div>
                        </div>
                        <button className="btn btn-primary col-md-3" onClick={enviarInscripcion}>
                            Inscribirse
                        </button>
                        {buildErrorMessage()}
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
