import React, { useState, useEffect } from "react";
import SprintsDataService from "../services/sprints";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import Cookies from 'universal-cookie'
const cookies = new Cookies();

const CarsList = (props) => {

  const [sprints, setSprints] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [selectedSprint, setSelectedSprint] = useState({
    _id: "",
    fecha: "",
    idCampeonato: "",
    idUsuarioP1: "",
    idUsuarioP2: "",
    idVehiculoP1: "",
    idVehiculoP2: "",
    reaccionP1: "",
    reaccionP2: "",
    tiempo100mtsP1: "",
    tiempo100mtsP2: "",
    tiempoLlegadaP1: "",
    tiempoLllegadaP2: "",
    pista: "",
    clase: "",
  });
  const [searchableParams] = useState(Object.keys(selectedSprint));

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalElminar] = useState(false);

  useEffect(() => {
    retrieveCars();
  }, []);

  const onChangeSearchParam = (e) => {
    const searchParam = e.target.value;
    setSearchParam(searchParam);
  };

  const onChangeSearchValue = (e) => {
    const searchValue = e.target.value;
    setSearchValue(searchValue);
  };

  const selectSprint = (action, sprint = {}) => {
    console.log("Selected: ", sprint);
    setSelectedSprint(sprint);
    action === "Editar" ? setModalEditar(true) : setModalElminar(true);
  };

  const findByParam = () => {
    find(searchValue, searchParam);
  };

  const retrieveCars = async () => {
    await SprintsDataService.getAll()
      .then((response) => {
        console.log("Data: ", response.data);
        setSprints(response.data.sprints);
        setTotalResults(response.data.total_results);
        setEntriesPerPage(response.data.sprints.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteSprints = async (sprintId) => {
    console.log("Car to be deleted", sprintId);
    await SprintsDataService.deleteSprints(sprintId)
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveCars();
  };

  const find = async (query, by) => {
    await SprintsDataService.find(query, by)
      .then((response) => {
        console.log("Data: ", response.data);
        setSprints(response.data.sprints);
        setTotalResults(response.data.total_results);
        setEntriesPerPage(response.data.sprints.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  let setModalButton = (selectedSprint) => {
    if (selectedSprint._id) {
        return (
            <button className="btn btn-danger" onClick={() => editar(selectedSprint)}>
            Actualizar
            </button>
        )
    } else {
        return (
            <button className="btn btn-danger" onClick={() => crear(selectedSprint)}>
              Crear
            </button>
        )
    }
  }

  const closeModal = () => {
    setModalEditar(false);
    setValidationErrorMessage('');
  }

  const eliminar = (sprintId) => {
    deleteSprints(sprintId);
    setModalElminar(false);
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setSelectedSprint((prevState) => ({
        ...prevState,
        [name]: value
      }
    ));
  }


  const editar = async (selectedSprint) =>{
    // REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente. 
    // NO, tiene que volver a como estaba antes

    sprints.forEach(sprint => {
    if (sprint._id === selectedSprint._id) {
        sprint.fecha = selectedSprint.fecha;
        sprint.idCampeonato = selectedSprint.idCampeonato;
        sprint.idUsuarioP1 = selectedSprint.idUsuarioP1;
        sprint.idUsuarioP2 = selectedSprint.idUsuarioP2;
        sprint.idVehiculoP1 = selectedSprint.idVehiculoP1;
        sprint.idVehiculoP2 = selectedSprint.idVehiculoP2;
        sprint.reaccionP1 = selectedSprint.reaccionP1;
        sprint.reaccionP2 = selectedSprint.reaccionP2;
        sprint.tiempo100mtsP1 = selectedSprint.tiempo100mtsP1;
        sprint.tiempo100mtsP2 = selectedSprint.tiempo100mtsP2;
        sprint.tiempoLlegadaP1 = selectedSprint.tiempoLllegadaP2;
        sprint.pista = selectedSprint.pista;
        sprint.clase = selectedSprint.clase;
      }
    });
    const result = await SprintsDataService.editCar(selectedSprint);
    if (result.status) {
      console.log('Edicion exitosa');
      setValidationErrorMessage('');
      setSprints(sprints);
      setModalEditar(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const crear = async (selectedSprint) => {
    const result = await SprintsDataService.createCar(selectedSprint);
    if (result?.status) {
      console.log('creación exitosa');
      setValidationErrorMessage('');
      retrieveCars();
      setModalEditar(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

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

  if (cookies.get("_id")){
    return (
      <div>
        <div className="container-xl">
          <div className="table-responsive">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-6">
                    <h2>
                      Administrar <b>Carreras</b>
                    </h2>
                  </div>
                  <div className="input-group col-lg-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Bussprint por "
                      value={searchValue}
                      onChange={onChangeSearchValue}
                    />
                    <select onChange={onChangeSearchParam}>
                    {searchableParams.map(param => {
                      return (
                        <option value={param}> {param.replace("_", "")} </option>
                      )
                    })}
                    </select>
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={findByParam}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <button className="btn btn-success" onClick={() => selectSprint("Editar")}>Añadir un nuevo Auto</button>
                  </div>
                </div>
              </div>
              <table className="table table-striped w-auto table-hover">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>fecha</th>
                    <th>idCampeonato</th>
                    <th>clase</th>
                    <th>idUsuarioP1</th>
                    <th>idUsuarioP2</th>
                    <th>idVehiculoP1</th>
                    <th>idVehiculoP2</th>
                    <th>reaccionP1</th>
                    <th>reaccionP2</th>
                    <th>tiempo100mtsP1</th>
                    <th>tiempo100mtsP2</th>
                    <th>pista</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sprints.map((sprint) => {
                    const id = `${sprint._id}`;
                    const fecha = `${sprint.fecha}`;
                    const idCampeonato = `${sprint.idCampeonato}`;
                    const clase = `${sprint.clase}`;
                    const idUsuarioP1 = `${sprint.idUsuarioP1}`;
                    const idUsuarioP2 = `${sprint.idUsuarioP2}`;
                    const idVehiculoP1 = `${sprint.idVehiculoP1}`;
                    const idVehiculoP2 = `${sprint.idVehiculoP2}`;
                    const reaccionP1 = `${sprint.reaccionP1}`;
                    const reaccionP2 = `${sprint.reaccionP2}`;
                    const tiempo100mtsP1 = `${sprint.tiempo100mtsP1}`;
                    const tiempo100mtsP2 = `${sprint.tiempo100mtsP2}`;
                    const pista = `${sprint.pista}`;
                    return (
                      <tr>
                        <td>{id}</td>
                        <td>{fecha}</td>
                        <td>{idCampeonato}</td>
                        <td>{clase}</td>
                        <td>{idUsuarioP1}</td>
                        <td width="">{idUsuarioP2}</td>
                        <td>{idVehiculoP1}</td>
                        <td>{idVehiculoP2}</td>
                        <td>{reaccionP1}</td>
                        <td>{reaccionP2}</td>
                        <td>{tiempo100mtsP1}</td>
                        <td>{tiempo100mtsP2}</td>
                        <td>{pista}</td>
                        <td>
                          <button className="btn btn-primary" onClick={() => selectSprint("Editar", sprint)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => selectSprint("Eliminar", sprint)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="clearfix">
                <div className="hint-text">
                  Showing{" "}
                  <b>{`${entriesPerPage}`}</b> out of{" "}
                  <b>{`${totalResults}`}</b> entries
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar el registro? Id: {selectedSprint._id}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => eliminar(selectedSprint._id)}>
              Sí
            </button>
            <button className="btn btn-secondary" onClick={() => setModalElminar(false)}>
              No
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEditar}>
          <ModalBody>
              <label>ID</label>
              <input className="form-control" readOnly type="text" name="id" id="idField" value={selectedSprint._id} placeholder="Auto-Incremental ID"/>
              <label>ID Usuario Dueño</label>
              <input className="form-control" type="text" maxlength="50" name="idVehiculoP2" id="idVehiculoP2Field" onChange={handleChange} value={selectedSprint.idVehiculoP2}/>
              <label>Patente</label>
              <input className="form-control" type="text" maxlength="50" name="fecha" id="fechaField" onChange={handleChange} value={selectedSprint.fecha}/>
              <label>Modelo</label>
              <input className="form-control" type="text" maxlength="100" name="idCampeonato" id="idCampeonatoField" onChange={handleChange} value={selectedSprint.idCampeonato}/>
              <label>Año</label>
              <input className="form-control" type="number" maxlength="10" name="clase" id="claseField" onChange={handleChange} value={selectedSprint.clase}/>
              <label>Agregados</label>
              <input className="form-control" type="text" maxlength="300" name="idUsuarioP1" id="idUsuarioP1Field" onChange={handleChange} value={selectedSprint.idUsuarioP1}/>
              <label>Historia</label>
              <input className="form-control" type="text" maxlength="200" name="idUsuarioP2" id="idUsuarioP2Field" onChange={handleChange} value={selectedSprint.idUsuarioP2}/>
              <label>Taller Mecanico</label>
              <input className="form-control" type="text" maxlength="50" name="idVehiculoP1" id="workshopField" onChange={handleChange} value={selectedSprint.idVehiculoP1}/>
          </ModalBody>
          <ModalFooter>
            {buildErrorMessage()}
            {setModalButton(selectedSprint)}
            <button className="btn btn-secondary" onClick={() => closeModal()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
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
