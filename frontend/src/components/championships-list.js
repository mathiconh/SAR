import React, { useState, useEffect } from "react";
import ChampionshipsDataService from "../services/championships";
import ClasesDataService from "../services/clases";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import Cookies from 'universal-cookie'
const cookies = new Cookies();


const ChampionshipsList = (props) => {

  const [clases, setClases] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [selectedChampionship, setSelectedChampionship] = useState({
    _id: "",
    nombre: "",
    fechaDesde: "",
    fechaHasta: "",
  });
  const [searchableParams] = useState(Object.keys(selectedChampionship));

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalElminar] = useState(false);

  useEffect(() => {
    retrieveChampionship();
    retrieveClases();
  }, []);

  const onChangeSearchParam = (e) => {
    const searchParam = e.target.value;
    setSearchParam(searchParam);
  };

  const onChangeSearchValue = (e) => {
    const searchValue = e.target.value;
    setSearchValue(searchValue);
  };

  const selectChampionship = (action, championship = {}) => {
    console.log("Selected: ", championship);
    setSelectedChampionship(championship);
    action === "Editar" ? setModalEditar(true) : setModalElminar(true);
  };

  const findByParam = () => {
    find(searchValue, searchParam);
  };

  const retrieveChampionship = async () => {
    await ChampionshipsDataService.getAll()
      .then((response) => {
        console.log("Data: ", response.data);
        setChampionships(response.data.championships);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveClases = async () => {
    await ClasesDataService.getAll()
      .then((response) => {
        console.log("Data: ", response.data);
        setClases([{ nombre: 'Seleccionar Clase' }].concat(response.data.clases));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteChampionship = async (championshipId) => {
    await ChampionshipsDataService.deleteChampionship(championshipId)
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveChampionship();
  };

  const find = async (query, by) => {
    await ChampionshipsDataService.find(query, by)
      .then((response) => {
        console.log("Data: ", response.data);
        setChampionships(response.data.championships);
        setTotalResults(response.data.total_results);
        setEntriesPerPage(response.data.championships.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  let setModalButton = (selectedChampionship) => {
    if (selectedChampionship._id) {
        return (
            <button className="btn btn-danger" onClick={() => editar(selectedChampionship)}>
            Actualizar
            </button>
        )
    } else {
        return (
            <button className="btn btn-danger" onClick={() => crear(selectedChampionship)}>
              Crear
            </button>
        )
    }
  }

  const closeModal = () => {
    setModalEditar(false);
    setValidationErrorMessage('');
  }

  const eliminar = (championshipId) => {
    deleteChampionship(championshipId);
    setModalElminar(false);
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setSelectedChampionship((prevState) => ({
        ...prevState,
        [name]: value
      }
    ));
  }


  const editar = async (selectedChampionship) =>{
    // REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente. 
    // NO, tiene que volver a como estaba antes

    championships.forEach(championship => {
    if (championship._id === selectedChampionship._id) {
        championship.nombre = selectedChampionship.nombre;
        championship.fechaDesde = selectedChampionship.fechaDesde;
        championship.fechaHasta = selectedChampionship.fechaHasta;
      }
    });
    const result = await ChampionshipsDataService.editChampionship(selectedChampionship);
    if (result.status) {
      console.log('Edicion exitosa');
      setValidationErrorMessage('');
      setChampionships(championships);
      setModalEditar(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const crear = async (selectedChampionship) => {
    const result = await ChampionshipsDataService.createChampionship(selectedChampionship);
    if (result?.status) {
      console.log('creación exitosa');
      setValidationErrorMessage('');
      retrieveChampionship();
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
  if (cookies.get("_id") && cookies.get("idRol") === "1"){
    return (
      <div>
        <div className="container-xl">
          <div className="table-responsive">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-6">
                    <h2>
                      Administrar <b>Campeonatos</b>
                    </h2>
                  </div>
                  <div className="input-group col-lg-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buschampionship por "
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
                    <button className="btn btn-success" onClick={() => selectChampionship("Editar")}>Añadir un nuevo Campeonato</button>
                  </div>
                </div>
              </div>
              <table className="table table-striped w-auto table-hover">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Clase</th>
                    <th>Fecha desde</th>
                    <th>Fecha hasta</th>
                  </tr>
                </thead>
                <tbody>
                  {championships.map((championship) => {
                    const id = `${championship._id}`;
                    const nombre = `${championship.nombre}`;
                    const fechaDesde = `${championship.fechaDesde}`;
                    const fechaHasta = `${championship.fechaHasta}`;
                    const clase = `${championship.clase}`;
                    return (
                      <tr>
                        <td>{id}</td>
                        <td>{nombre}</td>
                        <td>{clase}</td>
                        <td>{fechaDesde}</td>
                        <td>{fechaHasta}</td>
                        <td>
                          <button className="btn btn-primary" onClick={() => selectChampionship("Editar", championship)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => selectChampionship("Eliminar", championship)}>Delete</button>
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
            Estás seguro que deseas eliminar el registro? Id: {selectedChampionship._id}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => eliminar(selectedChampionship._id)}>
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
              <input className="form-control" readOnly type="text" name="id" id="idField" value={selectedChampionship._id} placeholder="Auto-Incremental ID"/>
              <label>Nombre</label>
              <input className="form-control" type="text" maxlength="50" name="nombre" id="nombreField" onChange={handleChange} value={selectedChampionship.nombre}/>
              <label>Clase</label>
              <select class="form-select" name="clase" id="claseField" onChange={handleChange} value={selectedChampionship.clase} aria-label="Default select example">
                {clases.map((clase) => {
                      const id = `${clase._id}`;
                      const nombre = `${clase.nombre}`;
                      return (
                        <option value={id}>{nombre}</option>
                      );
                    })}
              </select>
              <label>Fecha desde</label>
              <input className="form-control" type="date" maxlength="100" name="fechaDesde" id="fechaDesdeField" onChange={handleChange} value={selectedChampionship.fechaDesde}/>
              <label>Fecha hasta</label>
              <input className="form-control" type="date" maxlength="10" name="fechaHasta" id="fechaHastaField" onChange={handleChange} value={selectedChampionship.fechaHasta}/>
          </ModalBody>
          <ModalFooter>
            {buildErrorMessage()}
            {setModalButton(selectedChampionship)}
            <button className="btn btn-secondary" onClick={() => closeModal()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  
  }else{    
    window.location.href="./login" 
    console.log("Necesita logearse para poder acceder al ABM de Campeonatos");
    <Alert id='errorMessage' className="alert alert-danger fade show" key='danger' variant='danger'>
      Necesita logearse para poder acceder al ABM de Autos
    </Alert>
  }
};

export default ChampionshipsList;
