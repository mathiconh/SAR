import React, { useState, useEffect } from "react";
import CarsDataService from "../services/cars";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";

const CarsList = (props) => {

  const [cars, setCars] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [selectedCar, setSelectedCar] = useState({
    _id: "",
    patent: "",
    model: "",
    year: "",
    aggregated: "",
    history: "",
    workshopAssociated: "",
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
        car.patent = selectedCar.patent;
        car.model = selectedCar.model;
        car.year = selectedCar.year;
        car.aggregated = selectedCar.aggregated;
        car.history = selectedCar.history;
        car.workshopAssociated = selectedCar.workshopAssociated;
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
                  const patent = `${car.patent}`;
                  const model = `${car.model}`;
                  const year = `${car.year}`;
                  const aggregated = `${car.aggregated}`;
                  const history = `${car.history}`;
                  const workshopAssociated = `${car.workshopAssociated}`;
                  return (
                    <tr>
                      <td>{id}</td>
                      <td>{patent}</td>
                      <td>{model}</td>
                      <td>{year}</td>
                      <td>{aggregated}</td>
                      <td width="">{history}</td>
                      <td>{workshopAssociated}</td>
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
            <input className="form-control" type="text" maxlength="50" name="patent" id="patentField" onChange={handleChange} value={selectedCar.patent}/>
            <label>Modelo</label>
            <input className="form-control" type="text" maxlength="100" name="model" id="modelField" onChange={handleChange} value={selectedCar.model}/>
            <label>Año</label>
            <input className="form-control" type="number" maxlength="10" name="year" id="yearField" onChange={handleChange} value={selectedCar.year}/>
            <label>Agregados</label>
            <input className="form-control" type="text" maxlength="300" name="aggregated" id="aggregatedField" onChange={handleChange} value={selectedCar.aggregated}/>
            <label>Historia</label>
            <input className="form-control" type="text" maxlength="200" name="history" id="historyField" onChange={handleChange} value={selectedCar.history}/>
            <label>Taller Mecanico</label>
            <input className="form-control" type="text" maxlength="50" name="workshopAssociated" id="workshopField" onChange={handleChange} value={selectedCar.workshopAssociated}/>
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
};

export default CarsList;
