import React, { useState, useEffect } from "react";
import ClasesDataService from "../services/clases";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import Cookies from 'universal-cookie'
const cookies = new Cookies();

const ClasesList = (props) => {

  const [clases, setClases] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [selectedClase, setSelectedClase] = useState({
    _id: "",
    nombre: "",
    tiempo: "",
  });
  const [searchableParams] = useState(Object.keys(selectedClase));

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalElminar] = useState(false);

  useEffect(() => {
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

  const selectClase = (action, clase = {}) => {
    console.log("Selected: ", clase);
    setSelectedClase(clase);
    action === "Editar" ? setModalEditar(true) : setModalElminar(true);
  };

  const findByParam = () => {
    find(searchValue, searchParam);
  };

  const retrieveClases = async () => {
    await ClasesDataService.getAll()
      .then((response) => {
        console.log("Data: ", response.data);
        setClases(response.data.clases);
        setTotalResults(response.data.total_results);
        setEntriesPerPage(response.data.clases.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteClase = async (claseId) => {
    console.log("Clase to be deleted", claseId);
    await ClasesDataService.deleteClase(claseId)
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveClases();
  };

  const find = async (query, by) => {
    await ClasesDataService.find(query, by)
      .then((response) => {
        console.log("Data: ", response.data);
        setClases(response.data.clases);
        setTotalResults(response.data.total_results);
        setEntriesPerPage(response.data.clases.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  let setModalButton = (selectedClase) => {
    if (selectedClase._id) {
        return (
            <button className="btn btn-danger" onClick={() => editar(selectedClase)}>
            Actualizar
            </button>
        )
    } else {
        return (
            <button className="btn btn-danger" onClick={() => crear(selectedClase)}>
              Crear
            </button>
        )
    }
  }

  const closeModal = () => {
    setModalEditar(false);
    setValidationErrorMessage('');
  }

  const eliminar = (claseId) => {
    deleteClase(claseId);
    setModalElminar(false);
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setSelectedClase((prevState) => ({
        ...prevState,
        [name]: value
      }
    ));
  }


  const editar = async (selectedClase) =>{
    // REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente. 
    // NO, tiene que volver a como estaba antes

    clases.forEach(clase => {
    if (clase._id === selectedClase._id) {
        clase.nombre = selectedClase.nombre;
        clase.tiempo = selectedClase.tiempo;
      }
    });
    const result = await ClasesDataService.editClase(selectedClase);
    if (result.status) {
      console.log('Edicion exitosa');
      setValidationErrorMessage('');
      setClases(clases);
      setModalEditar(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const crear = async (selectedClase) => {
    const result = await ClasesDataService.createClase(selectedClase);
    if (result?.status) {
      console.log('creación exitosa');
      setValidationErrorMessage('');
      retrieveClases();
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
                      Administrar <b>Autos</b>
                    </h2>
                  </div>
                  <div className="input-group col-lg-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Busclase por "
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
                    <button className="btn btn-success" onClick={() => selectClase("Editar")}>Añadir una nueva Clase</button>
                  </div>
                </div>
              </div>
              <table className="table table-striped w-auto table-hover">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  {clases.map((clase) => {
                    const id = `${clase._id}`;
                    const nombre = `${clase.nombre}`;
                    const tiempo = `${clase.tiempo}`;
                    return (
                      <tr>
                        <td>{id}</td>
                        <td>{nombre}</td>
                        <td>{tiempo}</td>
                        <td>
                          <button className="btn btn-primary" onClick={() => selectClase("Editar", clase)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => selectClase("Eliminar", clase)}>Delete</button>
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
            Estás seguro que deseas eliminar el registro? Id: {selectedClase._id}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => eliminar(selectedClase._id)}>
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
              <input className="form-control" readOnly type="text" name="id" id="idField" value={selectedClase._id} placeholder="Auto-Incremental ID"/>
              <label>Nombre</label>
              <input className="form-control" type="text" maxlength="50" name="nombre" id="nombreField" onChange={handleChange} value={selectedClase.nombre}/>
              <label>Tiempo</label>
              <input className="form-control" type="text" maxlength="100" name="tiempo" id="tiempoField" onChange={handleChange} value={selectedClase.tiempo}/>
          </ModalBody>
          <ModalFooter>
            {buildErrorMessage()}
            {setModalButton(selectedClase)}
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

export default ClasesList;
