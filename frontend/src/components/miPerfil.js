import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import UsersDataService from "../services/users";
import CarsDataService from "../services/cars";
import Cookies from "universal-cookie";
import "../App.css"
import defaultImg from "../assets/profilePics/default.png";
import avatar1 from "../assets/profilePics/avatar1.png";
import avatar2 from "../assets/profilePics/avatar2.png";
import avatar3 from "../assets/profilePics/avatar3.png";
import avatar4 from "../assets/profilePics/avatar4.png";
import avatar5 from "../assets/profilePics/avatar5.png";
import avatar6 from "../assets/profilePics/avatar6.png";
import avatar7 from "../assets/profilePics/avatar7.png";
import avatar8 from "../assets/profilePics/avatar8.png";
const cookies = new Cookies();

const imgObj = {
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
}
const keys = Object.keys(imgObj);

const MiPerfil = (props) => {
  const [perfil, setPerfil] = useState([]);
  const [selectedImg, setSelectedImg] = useState();
  const [autos, setAutos] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchIdRol, setSearchIdRol] = useState("");
  const [idRols, setIdRoles] = useState(["All IdRoles"]);
  const [modalEditar, setModalEditar] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");

  useEffect(() => {
    getPerfil();
    getAutos();
  }, []);

  const getAutos = async () => {
    const _id = cookies.get("_id");

    await CarsDataService.find(_id, "idUsuarioDueño").then((response) => {
      console.log("autos tiene", response.data.cars);
      setAutos(response.data.cars);
    })
    .catch((e) => {
      console.log(e);
    });
  };

  const getPerfil = async () => {
    const _id = cookies.get("_id");

    UsersDataService.get(_id)
      .then(async (response) => {
        console.log(response.data.users[0]);
        setPerfil(response.data.users[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setPerfil((prevState) => ({
        ...prevState,
        [name]: value
      }
    ));
  }

  const editData = (perfil) => {
    console.log("Selected: ", perfil);
    setModalEditar(true);
  }

  const closeModal = () => {
    setModalEditar(false);
    setValidationErrorMessage('');
  }

  const editar = async (perfil) =>{
    // REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente. 
    // NO, tiene que volver a como estaba antes

    // perfil.forEach(car => {
    // if (car._id === perfil._id) {
    //     car.patente = perfil.patente;
    //     car.modelo = perfil.modelo;
    //     car.anio = perfil.anio;
    //     car.agregados = perfil.agregados;
    //     car.historia = perfil.historia;
    //     car.tallerAsociado = perfil.tallerAsociado;
    //   }
    // });
    const result = await CarsDataService.editCar(UsersDataService);
    if (result.status) {
      console.log('Edicion exitosa');
      setValidationErrorMessage('');
      setPerfil(perfil);
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

  let mostrarAutos = () => {
    if(autos[0]){
      console.log("entra")
      // eslint-disable-next-line no-lone-blocks
      {autos.map((car) => {
        const patente = `${car.patente}`;
        const modelo = `${car.modelo}`;
        const anio = `${car.anio}`;
        const agregados = `${car.agregados}`;
        const historia = `${car.historia}`;
        const tallerAsociado = `${car.tallerAsociado}`;
        return (
          <div className="col-lg-12 mb-4 mb-sm-5">
            <div>
              <span className="section-title text-primary mb-3 mb-sm-4">
                {modelo}{console.log("llega hjasta acá" + modelo)}
              </span>
              <p>
              {patente + anio + agregados + historia + tallerAsociado}
              </p>
            </div>
          </div>
          );
          })}
    }else{
      console.log("no entra")

    }
  }

  if (cookies.get("_id")) {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mb-4 mb-sm-5">
              <div className="card card-style1 border-0">
                <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                  <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                      <img src={perfil.profilePic ? imgObj[perfil.profilePic] : defaultImg} alt="..."/>
                    </div>
                    <div className="col-lg-6 px-xl-10">
                      <div className="d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                        <h3 className="h2 text-black mb-0">
                          {perfil.nombre} {perfil.apellido}
                        </h3>
                      </div>
                      <ul className="list-unstyled mb-1-9">
                        <li className="mb-2 mb-xl-3 display-28">
                          <span className="display-26 text-secondary me-2 font-weight-600">
                            Dirección:
                          </span>
                          {perfil.direccion}
                        </li>
                        <li className="mb-2 mb-xl-3 display-28">
                          <span className="display-26 text-secondary me-2 font-weight-600">
                            Telefono:
                          </span>{" "}
                          {perfil.telefono}
                        </li>
                        <li className="mb-2 mb-xl-3 display-28">
                          <span className="display-26 text-secondary me-2 font-weight-600">
                            Email:
                          </span>{" "}
                          {perfil.correoE}
                        </li>
                        <li className="mb-2 mb-xl-3 display-28">
                          <span className="display-26 text-secondary me-2 font-weight-600">
                            DNI:
                          </span>{" "}
                          {perfil.dni}
                        </li>
                        <li className="display-28">
                          <span className="display-26 text-secondary me-2 font-weight-600">
                            Fecha de nacimiento:
                          </span>{" "}
                          {perfil.fechaNac}
                        </li>
                        <li>
                          <button className="btn btn-primary" onClick={() => editData("Editar", perfil)}>Edit</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {mostrarAutos()}
            {autos.map((car) => {
                    const patente = `${car.patente}`;
                    const modelo = `${car.modelo}`;
                    const anio = `${car.anio}`;
                    const agregados = `${car.agregados}`;
                    const historia = `${car.historia}`;
                    const tallerAsociado = `${car.tallerAsociado}`;
                    return (
            <div className="col-lg-12 mb-4 mb-sm-5">
              <div>
                <span className="section-title text-primary mb-3 mb-sm-4">
                  {modelo}
                </span>
                <p>
                 {patente + anio + agregados + historia + tallerAsociado}
                </p>
              </div>
            </div>
            );
          })}
          </div>
        </div>
      

        <Modal isOpen={modalEditar}>
        <ModalBody>
            <label>Nombre</label>
            <input className="form-control" type="text" maxLength="50" name="nombre" id="nombreField" onChange={handleChange} value={perfil.nombre}/>
            <label>Apellido</label>
            <input className="form-control" type="text" maxLength="50" name="apellido" id="apellidoField" onChange={handleChange} value={perfil.apellido}/>
            <div>
              <p>Elegi una imagen de perfil</p>
              <div className="imgContainer">
                {keys.map((imageName, index) => (
                  // console.log('Hi: ', imageName);
                  <img 
                    key={index} 
                    src={imgObj[imageName]} 
                    alt={`Profile ${index}`}
                    width="10%" 
                    style={{border: selectedImg === imageName ? "4px solid purple" : ""}}
                    onClick={() => setSelectedImg(imageName)}></img>
                ))}
              </div>
            </div>
            <label>Dirección</label>
            <input className="form-control" type="text" maxLength="50" name="direccion" id="direccionField" onChange={handleChange} value={perfil.direccion}/>
            <label>Telefono</label>
            <input className="form-control" type="text" maxLength="100" name="telefono" id="telefonoField" onChange={handleChange} value={perfil.telefono}/>
            <label>Email</label>
            <input className="form-control" type="text" maxLength="10" name="email" id="emailField" onChange={handleChange} value={perfil.correoE}/>
            <label>DNI</label>
            <input className="form-control" type="text" maxLength="300" name="dni" id="dniField" onChange={handleChange} value={perfil.dni}/>
            <label>Fecha de nacimiento</label>
            <input className="form-control" type="text" maxLength="200" name="fechaNac" id="fechaNacField" onChange={handleChange} value={perfil.fechaNac}/>
        </ModalBody>
        <ModalFooter>
          {buildErrorMessage()}
          <button className="btn btn-danger" onClick={() => editar(perfil)}>
            Actualizar
            </button>
          <button className="btn btn-secondary" onClick={() => closeModal()}>
            Cancelar
          </button>
        </ModalFooter>
        </Modal>
      </div>
    );
  } else {
    window.location.href = "./login";
    console.log("Necesita logearse para poder acceder al ABM de usuarios");
  }
};

export default MiPerfil;
