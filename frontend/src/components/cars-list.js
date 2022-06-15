import React, { useState, useEffect, Component } from "react";
import CarsDataService from "../services/cars";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";

const CarsList = (props) => {

  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [searchPatent, setSearchPatent] = useState("");
  const [searchId, setSearchId] = useState("");
  const [selectedCar, setSelectedCar] = useState({
    id: "",
    patent: "",
    model: "",
    year: "",
    workshopAssociated: "",
  });

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalElminar] = useState(false);

  useEffect(() => {
    retrieveCars();
  }, []);

  const onChangeSearchId = (e) => {
    const searchId = e.target.value;
    setSearchId(searchId);
  };

  const onChangeSearchPatent = (e) => {
    const searchPatent = e.target.value;
    setSearchPatent(searchPatent);
  };

  const retrieveCars = () => {
    CarsDataService.getAll()
      .then((response) => {
        console.log("Data: ", response.data);
        setCars(response.data.cars);
        setTotalPages(response.data.total_pages);
        setTotalResults(response.data.total_results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteCar = (carId) => {
    console.log("Car to be deleted", carId);
    CarsDataService.deleteCar(carId)
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

  const find = (query, by) => {
    CarsDataService.find(query, by)
      .then((response) => {
        console.log("Data: ", response.data);
        setCars(response.data.cars);
        setTotalPages(response.data.total_pages);
        setTotalResults(response.data.total_results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByPatent = () => {
    find(searchPatent, "Patente");
  };

  const findById = () => {
    find(searchId, "_id");
  };

  function getPages() {
    let pages = [];
    for (let index = 0; index < totalPages; index++) {
      pages.push(index + 1);
    }
    return pages;
  }

  let items = getPages();

  let itemList = items.map((item, index) => {
    console.log("Index: ", index + 1);
    return (
      <li className="page-item active">
        <a href="#a" className="page-link">
          {index + 1}
        </a>
      </li>
    );
  });

  let setModalButton = (selectedCar) => {
    if (selectedCar._id) {
        return (
            <button className="btn btn-danger" onClick={() => editar()}>
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

  const selectCar = (action, car = {}) => {
    console.log("Selected: ", car);
    setSelectedCar(car);
    action === "Editar" ? setModalEditar(true) : setModalElminar(true);
  };

  const eliminar = (carId) => {
    deleteCar(carId);
    setModalElminar(false);
  };

  const handleChange=e=>{
      const {name, value}=e.target;
      setSelectedCar((prevState)=>({
          ...prevState,
          [name]: value
      }));
  }

  const editar = () =>{
    var newData=cars;
    newData.map(car=>{
    if(car._id === selectedCar._id){
        car.patent = selectedCar.patent;
        car.model = selectedCar.model;
        car.year = selectedCar.year;
        car.workshopAssociated = selectedCar.workshopAssociated;
    }});
    setCars(newData);
    setModalEditar(false);
  }

  const crear = (car) =>{
    CarsDataService.createCar(car);
    setModalEditar(false);
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
                <div className="col-sm-6">
                  <button className="btn btn-success" onClick={() => selectCar("Editar")}>Añadir un nuevo Auto</button>

                  <a href="#deleteCarModal" className="btn btn-danger" data-toggle="modal">
                    <i className="material-icons">&#xE15C;</i>{" "}
                    <span>Delete</span>
                  </a>
                </div>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>
                    <span className="custom-checkbox">
                      <input type="checkbox" id="selectAll"></input>
                      <label htmlFor="selectAll"></label>
                    </span>
                  </th>
                  <th>Id</th>
                  <th>Patente</th>
                  <th>Modelo</th>
                  <th>Año</th>
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
                  const workshopAssociated = `${car.workshopAssociated}`;
                  return (
                    <tr>
                      <td>
                        <span className="custom-checkbox">
                          <input
                            type="checkbox"
                            id="checkbox2"
                            name="options[]"
                            value="1"
                          ></input>
                          <label htmlFor="checkbox2"></label>
                        </span>
                      </td>
                      <td>{id}</td>
                      <td>{patent}</td>
                      <td>{model}</td>
                      <td>{year}</td>
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
                Showing 
                <b>{`${totalResults}`}</b> out of{" "}
                <b>{`${totalPages}`}</b> entries
              </div>
              <ul className="pagination">
                <li className="page-item">
                  <a href="#a" className="page-link">Previous</a>
                </li>
                {itemList}
                <li className="page-item">
                  <a href="#a" className="page-link">Next</a>
                </li>
              </ul>
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
            <input className="form-control" type="text" name="patent" id="patentField" onChange={handleChange} value={selectedCar.patent}/>
            <label>Modelo</label>
            <input className="form-control" type="text" name="model" id="modelField" onChange={handleChange} value={selectedCar.model}/>
            <label>Año</label>
            <input className="form-control" type="number" name="year" id="yearField" onChange={handleChange} value={selectedCar.year}/>
            <label>Taller Mecanico</label>
            <input className="form-control" type="text" name="workshopAssociated" id="workshopField" onChange={handleChange} value={selectedCar.workshopAssociated}/>
        </ModalBody>
        <ModalFooter>
            {setModalButton(selectedCar)}
          <button className="btn btn-secondary" onClick={() => setModalEditar(false)}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CarsList;
