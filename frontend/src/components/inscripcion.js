import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import InscripcionDataService from "../services/inscripcion";
import CarsDataService from "../services/cars";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const CarsList = (props) => {
    const defaultInsc = {
        carreraId: '',
        claseId: '',
        idUsuario: cookies.get("_id"),
        vehiculoSeleccionado: {},
        pagarMP: 'off',
      }

  const [carrerasDisponibles, setCarrerasDisponibles] = useState([]);
  const [clasesDisponibles, setClasesDisponibles] = useState(["Seleccionar Clase"]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState([]);
  const [autos, setAutos] = useState([]);
  const [inscripcion, setInscripcion] = useState(defaultInsc);
  const [inscribrOtroCompetidor, setInscribirOtroCompetidor] = useState(true);
  const [modalCodigoQR, setModalCodigoQR] = useState(false);
  const [modalErrorDatos, setModalErrorDatos] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");

  useEffect(() => {
    retrieveCarreras();
    getAutos();
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
    document.getElementById("tiempoClaseData").value = carreraData.tiempoClase;
  };

  function onChangeValue(event) {
    // console.log(`Name: ${event.target.name} Value: ${event.target.value}`);
    const {name, value} = event.target;
    setInscripcion((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  function onChangeValueCompetidor() {
	setInscribirOtroCompetidor(prevState => !prevState)
	document.getElementById('otroCompetidorData').setAttribute('required', inscribrOtroCompetidor);
  }

  const getAutos = async () => {
	//Cambiar que ID usa para buscar los autos en base a OTRO COMPETIDOR
    const _id = cookies.get("_id");

    await CarsDataService.find(_id, "idUsuarioDuenio")
      .then((response) => {
        console.log("autos tiene", response.data.cars);
        setAutos(response.data.cars);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const selectCar = (car = {}) => {
    console.log("Selected: ", car);
    // setSelectedCar(car);
    setInscripcion((prevState) => ({
      ...prevState,
      vehiculoSeleccionado: car._id
    }));
    const carData = `${car.modelo} - ${car.patente} - ${car.anio}`;
    document.getElementById("carData").value = carData;
  };

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

	function cambiarIdUsuarioInscripcion(userId) {
		const newInscripcion = inscripcion;
		newInscripcion.idUsuario = userId;
		setInscripcion(newInscripcion);
	}

  async function enviarInscripcion() {
	// TODO: Buscar autos del competidor
	// False implica usar ID del OTRO competidor y no del user logeado
	if (!inscribrOtroCompetidor) {
		const competidorId = document.getElementById('otroCompetidorData').value;
		cambiarIdUsuarioInscripcion(competidorId);
		
	} else if (inscripcion.idUsuario !== cookies.get("_id")) {
		cambiarIdUsuarioInscripcion(cookies.get("_id"));
	}

    const result = await InscripcionDataService.createInscripcion(inscripcion);
	// Testing purposes
    // const result = {status:200}
    // const result = { errorMessage: 'Datos erroneos' }
    if (result.status) {
        console.log('Inscripcion exitosa');
        setInscripcion(defaultInsc);
		if (inscripcion.pagarMP === 'on') {
			setModalCodigoQR(true);
		} else {
			window.location.reload(false);
		}
      } else {
		setModalErrorDatos(true);
        setValidationErrorMessage(result?.errorMessage);
      }
  }

  const closeModalCodigoQR = () => {
    setModalCodigoQR(false);
	window.location.reload(false);
  };

  const closeModalErrorDatos = () => {
    setModalErrorDatos(false);
	setValidationErrorMessage('');
  };

  const buildErrorMessage = () => {
    if (validationErrorMessage !== "") {
      return (
        <Alert
          id="errorMessage"
          className="alert alert-danger fade show"
          key="danger"
          variant="danger"
        >
          {validationErrorMessage}
        </Alert>
      );
    }
    return;
  };

  // Funcion de custom validation basada en la documentacion de Bootstrap
  (function () {
    'use strict'
    // Obtiene todos los formularios a los que queremos aplicarles la validacion custom
    var forms = document.querySelectorAll('.needs-validation')

    // Loopeamos a traves de los campos a ser validados y los marcamos segun apliquen
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
  })();

  function formPreventDefault(e) {
    alert('Inscripcion enviada');
    e.preventDefault();
  }

  if (cookies.get("_id")) {
    return (
        <div className="align-self-center">
            <div className="container-lg align-self-center">
                <form className="container-fluid align-self-center needs-validation" onSubmit={formPreventDefault} noValidate>
                    <p className="h1 text-center">Inscripcion a Carrera</p>
                    <div className="form-row">
                        <div className="form-group align-items-center col-md-6">
                            <label className="label-class" htmlFor="exampleInputEmail1">Clases disponibles para este viernes</label>
                            <select onChange={onChangesetSelectedClass}>
                            {clasesDisponibles.map((param) => {
                                return <option value={param}> {param} </option>;
                            })}
                            </select>
                            <br></br>
                            <label className="label-class" htmlFor="cuposClase">{carreraSeleccionada.aproxCupos}</label>
                            <br></br>
                            <label className="label-class" htmlFor="tiempoClase"> Tiempo de la clase seleccionada: </label>
                            <input type="text" id="tiempoClaseData" name="tiempoDataInput" className="col-md-1" data-readonly required/>
                            <div class="invalid-feedback">
                              Por favor seleccione una clase de la lista.
                            </div>
                        </div>
						<hr class="rounded"></hr>
                        <div className="form-group align-items-center form-check">
                            <label className="font-weight-bold" htmlFor="inscripcionOtroCompetidorLabel"> Deseo inscribir a otro competidor: </label>
                            <br></br>
                            <div onChange={onChangeValueCompetidor}>
                            {/* <div onChange={()=> setInscribirOtroCompetidor(prevState => !prevState)}> */}
                              <input className="radio-class-competidor" type="radio" value="false" name="inscribirOtroCompetidor" defaultChecked/> No
                              <br></br>
                              <input className="radio-class-competidor" type="radio" value="true" name="inscribirOtroCompetidor"/> Si
                            </div>
                        </div>
						<div className="form-group align-items-center form-check">
						{/* {setInputOtroCompetidor()} */}
							<div className="form-group align-items-center">
								<label className="label-class" htmlFor="idCompetidor"> Id del competidor: </label>
								<input type="text" id="otroCompetidorData" name="otroCompetidorDataInput" className="col-md-3" readOnly={inscribrOtroCompetidor}/>
								<div class="invalid-feedback">
								Por favor ingrese el ID de un competidor.
								</div>
							</div>
						</div>
                        <hr className="rounded"></hr>
                        <div>
                          <div className="container-xl">
                            <div className="table-responsive">
                              <div className="table-wrapper">
                                <div className="table-title">
                                  <div className="row">
                                    <div className="col-sm-6">
                                      <h2>
                                        Selecciona el auto con el que vas a correr
                                      </h2>
                                    </div>
                                  </div>
                                </div>
                                <table className="table table-striped w-auto table-hover">
                                  <thead>
                                    <tr>
                                      <th>Id</th>
                                      <th>Patente</th>
                                      <th>Modelo</th>
                                      <th>Año</th>
                                      <th>Agregados</th>
                                      <th>Historia</th>
                                      <th>Workshop Asociado</th>
                                      <th>Id Dueño</th>
                                      <th>Acciones</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {autos.map((selectedCar) => {
                                      const id = `${selectedCar._id}`;
                                      const patente = `${selectedCar.patente}`;
                                      const modelo = `${selectedCar.modelo}`;
                                      const anio = `${selectedCar.anio}`;
                                      const agregados = `${selectedCar.agregados}`;
                                      const historia = `${selectedCar.historia}`;
                                      const tallerAsociado = `${selectedCar.tallerAsociado}`;
                                      const idUsuarioDuenio = `${selectedCar.idUsuarioDuenio}`
                                      return (
                                        <tr>
                                          <td>{id}</td>
                                          <td>{patente}</td>
                                          <td>{modelo}</td>
                                          <td>{anio}</td>
                                          <td>{agregados}</td>
                                          <td width="">{historia}</td>
                                          <td>{tallerAsociado}</td>
                                          <td>{idUsuarioDuenio}</td>
                                          <td>
                                            <button className="btn btn-primary" type="button" onClick={() => selectCar(selectedCar)}>Seleccionar</button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <br></br>
                          <div className="form-group align-items-center">
                            <label className="label-class" htmlFor="tiempoClase"> Vehiculo Seleccionado: </label>
                            <input type="text" id="carData" name="carDataInput" className="col-md-3" data-readonly required/>
                            <div className="invalid-feedback">
                              Por favor seleccione uno de sus vehiculos en la tabla.
                            </div>
                          </div>
                        </div>
                        <hr className="rounded"></hr>
                        <div className="form-group align-items-center form-check">
                            <label className="font-weight-bold" htmlFor="tiempoClase"> Precio de la inscripcion: {carreraSeleccionada.precio}</label>
                            <br></br>
                            <div onChange={onChangeValue}>
                              <input className="radio-class" type="radio" value="off" name="pagarMP" defaultChecked/> Abonar con efectivo al ingresar al predio
                              <br></br>
                              <input className="radio-class" type="radio" value="on" name="pagarMP"/> Abonar con MercadoPago
                            </div>
                        </div>
                        <hr className="rounded"></hr>
                        <button className="btn btn-primary col-md-3" onClick={enviarInscripcion}>
                            Inscribirse
                        </button>
                    </div>
                </form>
            </div>
        <Modal isOpen={modalCodigoQR}>
        <ModalBody>
			<p className="h1 text-center">Gracias por inscribirse</p>
            <label>Con el siguiente codigo QR, usted podra ingresar al predio por la entrada preferencial:</label>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={() => closeModalCodigoQR()}>
            Cerrar
          </button>
        </ModalFooter>
        </Modal>

        <Modal isOpen={modalErrorDatos}>
        <ModalBody>
			<p className="h1 text-center">Hay un error en los datos ingresados</p>
            <label>Por favor corregir el error para continuar:</label>
			{buildErrorMessage()}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => closeModalErrorDatos()}>
            Cerrar
          </button>
        </ModalFooter>
        </Modal>
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
