import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import UsersDataService from "../services/users";
import CarsDataService from "../services/cars";
import Cookies from "universal-cookie";
import "../App.css";
import defaultImg from "../assets/profilePics/default.png";
import avatar1 from "../assets/profilePics/avatar1.png";
import avatar2 from "../assets/profilePics/avatar2.png";
import avatar3 from "../assets/profilePics/avatar3.png";
import avatar4 from "../assets/profilePics/avatar4.png";
import avatar5 from "../assets/profilePics/avatar5.png";
import avatar6 from "../assets/profilePics/avatar6.png";
import avatar7 from "../assets/profilePics/avatar7.png";
import avatar8 from "../assets/profilePics/avatar8.png";
import { Link } from "react-router-dom";

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
};
const keys = Object.keys(imgObj);
const MiPerfil = props => {
  const initialPerfilState = {
    _id: "",
    apellido: "",
    nombre: "",
    direccion: "",
    correoE: "",
    dni: "",
    telefono: "",
    profilePic: "",
    idRol: ""
  };
  const [perfil, setPerfil] = useState(initialPerfilState);
  const [selectedImg, setSelectedImg] = useState(undefined);
  const [userFechaNac, setUserFechaNac] = useState('');
  const [modalEditar, setModalEditar] = useState(false);
  //vt = Verificación Técnica
  const [vt, setVt] = useState([]) 
  const [modalEditarVt, setModalEditarVt] = useState(false);
  const [selectedVt, setSelectedVt] = useState({
    _id: "",
    mataFuego: "",
    traje: "",
    motor: "",
    electricidad: "",
    estado: "",
    idUsuarioDuenio: "",
    idAuto: ""
  })

  //carreras
  const [carreras, setCarreras] = useState([]);


  //autos
  const [autos, setAutos] = useState([]);
  const [modalEditarAuto, setModalEditarAuto] = useState(false);
  const [modalEliminarAuto, setModalElminarAuto] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [selectedCar, setSelectedCar] = useState({
    _id: "",
    idUsuarioDuenio: "",
    patente: "",
    modelo: "",
    anio: "",
    agregados: "",
    historia: "",
    tallerAsociado: "",
    idVt: "",
  });

  useEffect(() => {
    getPerfilById(props.match.params._id);
    getAutos(props.match.params._id);
  }, [props.match.params._id]);
  


  const getPerfilById = async ( _id ) => {

    UsersDataService.get(_id)
      .then(async (response) => {
        console.log(response.data.users[0]);
        const perfilData = response.data.users[0];
        
        const fechaNacData = new Date(perfilData.fechaNac);
        const fechaNacDay = fechaNacData.getDate() + 1;
        // Be careful! January is 0, not 1
        const fechaNacMonth = fechaNacData.getMonth() + 1;
        const fechaNacYear = fechaNacData.getFullYear();
        
        setUserFechaNac(`${fechaNacDay}/${fechaNacMonth}/${fechaNacYear}`);
        
        setPerfil(response.data.users[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const editData = (perfil) => {
    console.log("Selected: ", perfil);
    setModalEditar(true);
  };

  const closeModal = () => {
    setSelectedImg(undefined);
    setModalEditar(false);
    setValidationErrorMessage("");
  };

  

  const editar = async (perfil) => {
    if (selectedImg) perfil.profilePic = selectedImg;
    const result = await UsersDataService.editUser(perfil);
    if (result.status) {
      console.log("Edicion exitosa");
      setValidationErrorMessage("");
      setPerfil(perfil);
      setModalEditar(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
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
  //--------------------------------------------------------------Carreras--------------------------------------------------------------




  //--------------------------------------------------------------Verificación Técnica--------------------------------------------------


  let setModalButtonVt = (selectedVt) => {
    if (selectedVt._id) {
        return (
            <button className="btn btn-danger" onClick={() => editarVt(selectedVt)}>
            Actualizar
            </button>
        )
    } else {
      
        return (
            <button className="btn btn-danger" onClick={() => completarVt(selectedVt)}>
              Completar 
            </button>
        )
    }
  }

  const completarVt = async (selectedVt) => {
    console.log("SelectecVt tiene:", selectedVt._id)
    const result = await CarsDataService.completarVt(selectedVt);
    if (result?.status) {
      console.log('creación exitosa');
      setValidationErrorMessage('');
      setModalEditarVt(false);
      getAutos();
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const editarVt = async (selectedVt) =>{
    // REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente. 
    // NO, tiene que volver a como estaba antes

    autos.forEach(vt => {
    if (vt._id === selectedVt._id) {
        vt.mataFuego = selectedVt.mataFuego;
        vt.traje = selectedVt.traje;
        vt.motor = selectedVt.motor;
        vt.electricidad = selectedVt.electricidad;
        vt.estado = selectedVt.estado;
        vt.idUsuarioDuenio = selectedVt.idUsuarioDuenio;
        vt.idAuto = selectedVt.idAuto;
      }
    });
    const result = await CarsDataService.editVt(selectedVt);
    if (result.status) {
      console.log('Edicion exitosa');
      setValidationErrorMessage('');
      setVt(vt);
      setModalEditarAuto(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const selectVt = async (action, car = {} ) => {
    if(car.idVt){
      await CarsDataService.findVt(car.idVt, "_id")
      .then((response) => {
        setVt(response.data.vts[0]);
        setSelectedVt(response.data.vts[0]);
        action === "EditarVt" ? setModalEditarVt(true) : console.log("first");//setModalElminarVt(true);
      })
      .catch((e) => {
        console.log(e);
      });
    }else{
      setSelectedVt({});
      action === "EditarVt" ? setModalEditarVt(true) : console.log("first");//setModalElminarVt(true);
    }
    
  };

  const handleChangeVt = (e) => {
    const { name, value } = e.target;
    setSelectedVt((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const closeModalVt = () => {
    setModalEditarVt(false);
    setValidationErrorMessage("");
  };

  //--------------------------------------------------------------------auto------------------------------------------------------------
  
  
  const getAutos = async ( _id ) => {

    await CarsDataService.find(_id, "idUsuarioDuenio")
      .then((response) => {
        console.log("autos tiene", response.data.cars);
        setAutos(response.data.cars);
      })
      .catch((e) => {
        console.log(e);
      });

    await CarsDataService.findVt(_id, "idVt")
    .then((response) => {
      console.log("vt tiene", response.data.vts);
      setVt(response.data.vts);
    })
    .catch((e) => {
      console.log(e);
    });

    await CarsDataService.findCarreras(_id, "idUsuarioP2")
    .then((response) => {
      console.log("carreras tiene", response.data.sprints);
      setCarreras(response.data.sprints);
    })
    .catch((e) => {
      console.log(e);
    });
  };
  
  const selectCar = (action, car = {}) => {
    console.log("Selected: ", car);
    setSelectedCar(car);
    action === "EditarAuto" ? setModalEditarAuto(true) : setModalElminarAuto(true);
  };

  const handleChangeAuto = (e) => {
    const { name, value } = e.target;
    setSelectedCar((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const editarAuto = async (selectedCar) =>{
    // REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente. 
    // NO, tiene que volver a como estaba antes

    autos.forEach(car => {
    if (car._id === selectedCar._id) {
        car.patente = selectedCar.patente;
        car.modelo = selectedCar.modelo;
        car.anio = selectedCar.anio;
        car.agregados = selectedCar.agregados;
        car.historia = selectedCar.historia;
        car.tallerAsociado = selectedCar.tallerAsociado;
        car.idUsuarioDuenio = selectedCar.idUsuarioDuenio;
        car.idVt = selectedCar.idVt;
      }
    });
    const result = await CarsDataService.editCar(selectedCar);
    if (result.status) {
      console.log('Edicion exitosa');
      setValidationErrorMessage('');
      setAutos(autos);
      setModalEditarAuto(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const crearAuto = async (selectedCar) => {
    const result = await CarsDataService.createCar(selectedCar);
    if (result?.status) {
      console.log('creación exitosa');
      setValidationErrorMessage('');
      setModalEditarAuto(false);
      getAutos();
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const eliminarAuto = (carId) => {
    deleteCar(carId);
    setModalElminarAuto(false);
  };

  const deleteCar = async (carId) => {
    console.log("Car to be deleted", carId);
    await CarsDataService.deleteCar(carId)
      .then((response) => {
        getAutos();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  

  let setModalButtonAuto = (selectedCar) => {
    if (selectedCar._id) {
        return (
            <button className="btn btn-danger" onClick={() => editarAuto(selectedCar)}>
            Actualizar
            </button>
        )
    } else {
      
        return (
            <button className="btn btn-danger" onClick={() => crearAuto(selectedCar)}>
              Crear 
            </button>
        )
    }
  }

  const closeModalAuto = () => {
    setModalEditarAuto(false);
    setValidationErrorMessage("");
  };

  if (perfil._id === cookies.get("_id") || cookies.get("idRol") === "1") {
    console.log("Entro")
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mb-4 mb-sm-5">
              <div className="card card-style1 border-0">
                <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                  <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                      <img src={ perfil.profilePic ? imgObj[perfil.profilePic] : defaultImg } alt="..."/>
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
                          {userFechaNac}
                        </li>
                        <li>
                          <button
                            className="btn btn-primary"
                            onClick={() => editData("Editar", perfil)}
                          >
                            Editar datos
                          </button>
                          <br></br>
                          <br></br>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="container-xl">
                <div className="table-responsive">
                  <div className="table-wrapper">
                    <div className="table-title">
                      <div className="row">
                        <div className="col-sm-6">
                          <h2>
                            Administra tus <b>Autos</b>
                          </h2>
                          <button
                            className="btn btn-success"
                            onClick={() => selectCar("EditarAuto")}
                          >
                            Añadir un nuevo Auto
                          </button>
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
                          <th>Id Verificación Técnica</th>
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
                          const idVt = `${selectedCar.idVt}`                          
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
                              <td>{idVt}</td>
                              <td>
                                <button className="btn btn-primary" onClick={() => selectCar("EditarAuto", selectedCar)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => selectCar("Eliminar", selectedCar)}>Delete</button>
                                <button className="btn btn-primary" onClick={() => selectVt("EditarVt", selectedCar)}>Verificación Técnica</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
        
        <div>
            <div className="container-xl">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>
                          Tus Carreras
                        </h2>
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped w-auto table-hover">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Campeonato</th>
                        <th>Usuario 1</th>
                        <th>Vehiculo 1</th>
                        <th>Reacción</th>
                        <th>Tiempo 100 mts</th>                          
                        <th>Tiempo Lllegada</th>
                        <th>Usuario 2</th>
                        <th>Vehiculo 2</th>
                        <th>Reacción</th>
                        <th>Tiempo 100 mts</th>                          
                        <th>Tiempo Lllegada</th>
                        <th>Clase</th>
                        <th>Pista</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carreras.map((selectedCarrera) => {
                        const _id = `${selectedCarrera.idUsuarioP1}`;
                        const fecha = `${selectedCarrera.fecha}`;
                        const idCampeonato = `${selectedCarrera.idCampeonato}`;
                        const idUsuarioP1 = `${selectedCarrera.idUsuarioP1}`;
                        const idUsuarioP2 = `${selectedCarrera.idUsuarioP2}`;
                        const idVehiculoP1 = `${selectedCarrera.idVehiculoP1}`;
                        const idVehiculoP2 = `${selectedCarrera.idVehiculoP2}`;
                        const reaccionP1 = `${selectedCarrera.reaccionP1}`
                        const reaccionP2 = `${selectedCarrera.reaccionP2}`
                        const tiempo100mtsP1 = `${selectedCarrera.tiempo100mtsP1}`  
                        const tiempo100mtsP2 = `${selectedCarrera.tiempo100mtsP2}`  
                        const tiempoLlegadaP1 = `${selectedCarrera.tiempoLlegadaP1}`  
                        const tiempoLlegadaP2 = `${selectedCarrera.tiempoLlegadaP2}`   
                        const pista = `${selectedCarrera.pista}`   
                        const clase = `${selectedCarrera.clase}`                           
                        return (
                          <tr>
                            <td>{fecha}</td>
                            <td>{idCampeonato}</td>
                            <td>{idUsuarioP1}</td>
                            <td>{idVehiculoP1}</td>
                            <td>{reaccionP1}</td>
                            <td>{tiempo100mtsP1}</td>
                            <td>{tiempoLlegadaP1}</td>
                            <td>{idUsuarioP2}</td>
                            <td>{idVehiculoP2}</td>
                            <td>{reaccionP2}</td>
                            <td>{tiempo100mtsP2}</td>
                            <td>{tiempoLlegadaP2}</td>
                            <td>{pista}</td>
                            <td>{clase}</td>
                            <td>
                            <div className="row">
                              <a className="btn btn-primary" href={"/miperfil/"+selectedCarrera.idUsuarioP1}>Ver</a>
                            </div>
                            </td>
                          </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <Modal isOpen={modalEditarAuto}>
          <ModalBody>
              <label>ID Usuario</label>
              <label>ID Auto</label>
              <input className="form-control" readOnly type="text" name="id" id="idField" value={selectedCar._id} placeholder="ID Auto-Incremental"/>
              <label>Patente</label>
              <input className="form-control" type="text" maxlength="50" name="patente" id="patenteField" onChange={handleChangeAuto} value={selectedCar.patente}/>
              <label>Modelo</label>
              <input className="form-control" type="text" maxlength="100" name="modelo" id="modeloField" onChange={handleChangeAuto} value={selectedCar.modelo}/>
              <label>Año</label>
              <input className="form-control" type="number" maxlength="10" name="anio" id="anioField" onChange={handleChangeAuto} value={selectedCar.anio}/>
              <label>Agregados</label>
              <input className="form-control" type="text" maxlength="300" name="agregados" id="agregadosField" onChange={handleChangeAuto} value={selectedCar.agregados}/>
              <label>Historia</label>
              <input className="form-control" type="text" maxlength="200" name="historia" id="historiaField" onChange={handleChangeAuto} value={selectedCar.historia}/>
              <label>Taller Mecanico</label>
              <input className="form-control" type="text" maxlength="50" name="tallerAsociado" id="workshopField" onChange={handleChangeAuto} value={selectedCar.tallerAsociado}/>
              <label>ID Verificación Técnica</label>
              <input className="form-control" type="text" maxlength="50" name="tallerAsociado" id="workshopField" onChange={handleChangeAuto} value={selectedCar.idVt}/>
          </ModalBody>
          <ModalFooter>
            {buildErrorMessage()}
            {setModalButtonAuto(selectedCar)}
            <button className="btn btn-secondary" onClick={() => closeModalAuto()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEditarVt}>
          <ModalBody>
              <label>ID VT</label>
              <input className="form-control" readOnly type="text" name="id" id="idField" value={selectedVt._id} placeholder="ID Auto-Incremental"/>
              <label>Mata Fuego</label>
              <input className="form-control" type="text" maxlength="50" name="mataFuego" id="mataFuegoField" onChange={handleChangeVt} value={selectedVt.mataFuego}/>
              <label>Traje</label>
              <input className="form-control" type="text" maxlength="50" name="traje" id="trajeField" onChange={handleChangeVt} value={selectedVt.traje}/>
              <label>Motor</label>
              <input className="form-control" type="text" maxlength="100" name="motor" id="motorField" onChange={handleChangeVt} value={selectedVt.motor}/>
              <label>Electricidad</label>
              <input className="form-control" type="number" maxlength="10" name="electricidad" id="electricidadField" onChange={handleChangeVt} value={selectedVt.electricidad}/>
              <label>Estado</label>
              <input className="form-control" type="text" maxlength="300" name="estado" id="estadoField" onChange={handleChangeVt} value={selectedVt.estado}/>
              <label>id Dueño del auto</label>
              <input className="form-control" type="text" maxlength="200" name="idUsuarioDuenio" id="idUsuarioDuenioField" onChange={handleChangeVt} value={selectedVt.idUsuarioDuenio}/>
              <label>id Auto</label>
              <input className="form-control" type="text" maxlength="50" name="idAuto" id="idAutoField" onChange={handleChangeVt} value={selectedVt.idAuto}/>
          </ModalBody>
          <ModalFooter>
            {buildErrorMessage()}
            {setModalButtonVt(selectedVt)}
            <button className="btn btn-secondary" onClick={() => closeModalVt()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEliminarAuto}>
          <ModalBody>
            Estás seguro que deseas eliminar el registro? Id: {selectedCar._id}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => eliminarAuto(selectedCar._id)}>
              Sí
            </button>
            <button className="btn btn-secondary" onClick={() => setModalElminarAuto(false)}>
              No
            </button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={modalEditar}>
          <ModalBody>
            <label>Nombre</label>
            <input
              className="form-control"
              type="text"
              maxLength="50"
              name="nombre"
              id="nombreField"
              onChange={handleChange}
              value={perfil.nombre}
            />
            <label>Apellido</label>
            <input
              className="form-control"
              type="text"
              maxLength="50"
              name="apellido"
              id="apellidoField"
              onChange={handleChange}
              value={perfil.apellido}
            />
            <div className="container">
              <p>Elegi una imagen de perfil</p>
              <div className="imgContainer">
                {keys.map((imageName, index) => (
                  <img
                    key={index}
                    src={imgObj[imageName]}
                    alt={`Profile ${index}`}
                    width="20%"
                    style={{
                      border:
                        selectedImg === imageName ? "4px solid purple" : "",
                    }}
                    onClick={() => setSelectedImg(imageName)}
                  ></img>
                ))}
              </div>
            </div>
            <label>Dirección</label>
            <input
              className="form-control"
              type="text"
              maxLength="50"
              name="direccion"
              id="direccionField"
              onChange={handleChange}
              value={perfil.direccion}
            />
            <label>Telefono</label>
            <input
              className="form-control"
              type="number"
              maxLength="100"
              name="telefono"
              id="telefonoField"
              onChange={handleChange}
              value={perfil.telefono}
            />
            <label>Email</label>
            <input
              className="form-control"
              type="text"
              maxLength="10"
              name="email"
              id="emailField"
              onChange={handleChange}
              value={perfil.correoE}
            />
            <label>DNI</label>
            <input
              className="form-control"
              type="number"
              maxLength="300"
              name="dni"
              id="dniField"
              onChange={handleChange}
              value={perfil.dni}
            />
            <label>Fecha de nacimiento</label>
            <input
              className="form-control"
              type="date"
              maxLength="200"
              name="fechaNac"
              id="fechaNacField"
              onChange={handleChange}
              value={perfil.fechaNac}
            />
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
    // // window.location.href = "./login";
     console.log("Necesita logearse para poder acceder al ABM de usuarios");
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mb-4 mb-sm-5">
              <div className="card card-style1 border-0">
                <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                  <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                      <img src={ perfil.profilePic ? imgObj[perfil.profilePic] : defaultImg } alt="..."/>
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
                          {userFechaNac}
                        </li>
                        <li>
                          <br></br>
                          <br></br>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="container-xl">
                <div className="table-responsive">
                  <div className="table-wrapper">
                    <div className="table-title">
                      <div className="row">
                        <div className="col-sm-6">
                          <h2>
                            Autos
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
                          <th>Id Verificación Técnica</th>
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
                          const idVt = `${selectedCar.idVt}`                          
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
                              <td>{idVt}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )}
};

export default MiPerfil;
