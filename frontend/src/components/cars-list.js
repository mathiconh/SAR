import React, { useState, useEffect } from "react";
import CarsDataService from "../services/cars";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import Cookies from 'universal-cookie'
const cookies = new Cookies();


const CarsList = (props) => {

  const [cars, setCars] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [selectedCar, setSelectedCar] = useState({
    _id: "",
    patente: "",
    modelo: "",
    anio: "",
    agregados: "",
    historia: "",
    tallerAsociado: "",
  });
  const [searchableParams] = useState(Object.keys(selectedCar));

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

  const selectCar = (action, car = {}) => {
    console.log("Selected: ", car);
    setSelectedCar(car);
    action === "Editar" ? setModalEditar(true) : setModalElminar(true);
  };

  const findByParam = () => {
    find(searchValue, searchParam);
  };

  const retrieveCars = async () => {
    await CarsDataService.getAll()
      .then((response) => {
        console.log("Data: ", response.data);
        setCars(response.data.cars);
        setTotalResults(response.data.total_results);
        setEntriesPerPage(response.data.cars.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteCar = async (carId) => {
    console.log("Car to be deleted", carId);
    await CarsDataService.deleteCar(carId)
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
    await CarsDataService.find(query, by)
      .then((response) => {
        console.log("Data: ", response.data);
        setCars(response.data.cars);
        setTotalResults(response.data.total_results);
        setEntriesPerPage(response.data.cars.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  let setModalButton = (selectedCar) => {
    if (selectedCar._id) {
        return (
            <button className="btn btn-danger" onClick={() => editar(selectedCar)}>
            Actualizar
            </button>
        )
    } else {
        return (
            <button className="btn btn-danger" onClick={() => crear(selectedCar)}>
              Crear
            </button>
        )
    }
  }

  const closeModal = () => {
    setModalEditar(false);
    setValidationErrorMessage('');
  }

  const eliminar = (carId) => {
    deleteCar(carId);
    setModalElminar(false);
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setSelectedCar((prevState) => ({
        ...prevState,
        [name]: value
      }
    ));
  }


  const editar = async (selectedCar) =>{
    // REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente. 
    // NO, tiene que volver a como estaba antes

    cars.forEach(car => {
    if (car._id === selectedCar._id) {
        car.patente = selectedCar.patente;
        car.modelo = selectedCar.modelo;
        car.anio = selectedCar.anio;
        car.agregados = selectedCar.agregados;
        car.historia = selectedCar.historia;
        car.tallerAsociado = selectedCar.tallerAsociado;
      }
    });
    const result = await CarsDataService.editCar(selectedCar);
    if (result.status) {
      console.log('Edicion exitosa');
      setValidationErrorMessage('');
      setCars(cars);
      setModalEditar(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const crear = async (selectedCar) => {
    const result = await CarsDataService.createCar(selectedCar);
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
                      Administrar <b>Autos</b>
                    </h2>
                  </div>
                  <div className="input-group col-lg-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por "
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
                    <button className="btn btn-success" onClick={() => selectCar("Editar")}>Añadir un nuevo Auto</button>
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => {
                    const id = `${car._id}`;
                    const patente = `${car.patente}`;
                    const modelo = `${car.modelo}`;
                    const anio = `${car.anio}`;
                    const agregados = `${car.agregados}`;
                    const historia = `${car.historia}`;
                    const tallerAsociado = `${car.tallerAsociado}`;
                    return (
                      <tr>
                        <td>{id}</td>
                        <td>{patente}</td>
                        <td>{modelo}</td>
                        <td>{anio}</td>
                        <td>{agregados}</td>
                        <td width="">{historia}</td>
                        <td>{tallerAsociado}</td>
                        <td>
                          <button className="btn btn-primary" onClick={() => selectCar("Editar", car)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => selectCar("Eliminar", car)}>Delete</button>
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
            Estás seguro que deseas eliminar el registro? Id: {selectedCar._id}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => eliminar(selectedCar._id)}>
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
              <input className="form-control" readOnly type="text" name="id" id="idField" value={selectedCar._id} placeholder="Auto-Incremental ID"/>
              <label>Patente</label>
              <input className="form-control" type="text" maxlength="50" name="patente" id="patenteField" onChange={handleChange} value={selectedCar.patente}/>
              <label>Modelo</label>
              <input className="form-control" type="text" maxlength="100" name="modelo" id="modeloField" onChange={handleChange} value={selectedCar.modelo}/>
              <label>Año</label>
              <input className="form-control" type="number" maxlength="10" name="anio" id="anioField" onChange={handleChange} value={selectedCar.anio}/>
              <label>Agregados</label>
              <input className="form-control" type="text" maxlength="300" name="agregados" id="agregadosField" onChange={handleChange} value={selectedCar.agregados}/>
              <label>Historia</label>
              <input className="form-control" type="text" maxlength="200" name="historia" id="historiaField" onChange={handleChange} value={selectedCar.historia}/>
              <label>Taller Mecanico</label>
              <input className="form-control" type="text" maxlength="50" name="tallerAsociado" id="workshopField" onChange={handleChange} value={selectedCar.tallerAsociado}/>
          </ModalBody>
          <ModalFooter>
            {buildErrorMessage()}
            {setModalButton(selectedCar)}
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
