import React, { useState, useEffect } from "react";
import UserDataService from "../services/users";
import { Link } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, Alert } from "reactstrap";
import Cookies from 'universal-cookie'
const cookies = new Cookies();

const UsersList = props => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    _id: "",
    apellido: "",
    correoE: "",
    direccion: "",
    dni: "",
    fechaNac: "",
    idRol: "",
    idSector: "",   
    idSexo: "",
    idVehiculo: "",
    nombre: "",
    password: "",
    telefono: ""
  });
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [searchName, setSearchName ] = useState("");
  const [searchId, setSearchId ] = useState("");
  const [searchIdRol, setSearchIdRol ] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [idRols, setIdRoles] = useState(["All IdRoles"]);

  useEffect(() => {
    retrieveUsers();
    retrieveIdRol();
  }, []);

  const onChangeSearchId = e => {
    const searchId = e.target.value;
    setSearchId(searchId);
  };

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchIdRol = e => {
    const searchIdRol = e.target.value;
    setSearchIdRol(searchIdRol); 
  };

  const retrieveUsers = () => {
    UserDataService.getAll()
      .then(response => {
        console.log(response.data);
        setUsers(response.data.users);
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveIdRol = () => {
    UserDataService.getIdRol()
      .then(response => {
        console.log('Resultados: ', response.data);
        setIdRoles(["All IdRoles"].concat(response.data));
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveUsers();
  };

  const find = async (query, by) => {
    await UserDataService.find(query, by)
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.users);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "nombre")
  };

  const findById = () => {
    find(searchId, "_id")
  };

  const findByIdRol = () => {
    if (searchIdRol === "All IdRoles") {
      refreshList();
    } else {
      find(searchIdRol, "idRol")
    }
  };


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

  const selectUser = (action, selectedUser = {}) => {
    console.log("Selected: ", selectedUser);
    setSelectedUser(selectedUser);

    action === "Crear" ? setModalCrear(true) : setModalEliminar(true);

  };

  const crear = async (selectedUser) => {
    const result = await UserDataService.createUser(selectedUser);
    if (result?.status) {
      console.log('creación exitosa');
      setValidationErrorMessage('');
      retrieveUsers();
      setModalCrear(false);
    } else {
      setValidationErrorMessage(result?.errorMessage);
    }
  }

  const eliminar = async (selectedUser) => {
    console.log("esto tiene de id:" + selectedUser._id);
    deleteUser(selectedUser._id);
    setModalEliminar(false);
  }

  const deleteUser = async (_id) => {
    console.log("Car to be deleted", _id);
    await UserDataService.deleteUser(_id)
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setSelectedUser((prevState) => ({
        ...prevState,
        [name]: value
      }
    ));
  }


  if (cookies.get("_id") ){
    return (
      <div className="align-self-center">
        <div className="container-lg align-self-center">
          <div className="input-group col-lg-12">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={searchName}
              onChange={onChangeSearchName}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByName}
              >
                Search
              </button>
            </div>
          </div>
          <div className="input-group col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by ID"
              value={searchId}
              onChange={onChangeSearchId}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findById}
              >
                Search
              </button>
            </div>
          </div>
          <div className="input-group col-lg-4">

            <select onChange={onChangeSearchIdRol}>
            {idRols.map(idRol => {
                return (
                  <option value={idRol}> {idRol.substr(0, 20)} </option>
                )
              })}
            </select>
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByIdRol}
              >
                Search
              </button>
            </div>

          </div>
          
        <div className="col-lg-6">
          <button className="btn btn-success" onClick={() => selectUser("Crear")} >Añadir un nuevo Auto</button>
        </div>
        </div>
        <div className="col-lg-10 align-self-center">
          <div className="row">
            {users.map((user) => {
              const id = `${user._id}`;
              const name = `${user.nombre}`;
              const Lastname = `${user.apellido}`;
              const idrol = `${user.idRol}`;
              const address = `${user.direccion}`;
              const email = `${user.correoE}`;
              return (
                <div className="col-lg-4 pb-1">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{user.nombre}</h5>
                      <p className="card-text">
                        <strong>Id: </strong>{id}<br/>
                        <strong>name: </strong>{name}<br/>
                        <strong>Id Rol: </strong>{idrol}<br/>
                        <strong>Lastname: </strong>{Lastname}<br/>
                        <strong>Address: </strong>{address}<br/>
                        <strong>Email: </strong>{email}
                      </p>
                      <div className="row">
                      <Link to={"/miperfil/"+user._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                        View User
                      </Link>
                      <button className="btn btn-success" onClick={() => selectUser(selectedUser)} >Eliminar</button>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Modal isOpen={modalCrear}>
          <ModalBody>
              <label>ID</label>
              <input className="form-control" readOnly type="text" name="id" id="idField" value={selectedUser._id} placeholder="Auto-Incremental ID"/>
              <label>apellido</label>
              <input className="form-control" type="text" maxlength="50" name="apellido" id="apellidoField" onChange={handleChange} value={selectedUser.apellido}/>
              <label>correoE</label>
              <input className="form-control" type="text" maxlength="50" name="correoE" id="correoEField" onChange={handleChange} value={selectedUser.correoE}/>
              <label>direccion</label>
              <input className="form-control" type="text" maxlength="100" name="direccion" id="direccionField" onChange={handleChange} value={selectedUser.direccion}/>
              <label>dni</label>
              <input className="form-control" type="number" maxlength="10" name="dni" id="dniField" onChange={handleChange} value={selectedUser.dni}/>
              <label>fechaNac</label>
              <input className="form-control" type="text" maxlength="300" name="fechaNac" id="fechaNacField" onChange={handleChange} value={selectedUser.fechaNac}/>
              <label>idRol</label>
              <input className="form-control" type="text" maxlength="200" name="idRol" id="idRolField" onChange={handleChange} value={selectedUser.idRol}/>
              <label>idSector</label>
              <input className="form-control" type="text" maxlength="50" name="idSector" id="idSectorField" onChange={handleChange} value={selectedUser.idSector}/>
              <label>idSexo</label>
              <input className="form-control" type="text" maxlength="100" name="idSexo" id="idSexoField" onChange={handleChange} value={selectedUser.idSexo}/>
              <label>idVehiculo</label>
              <input className="form-control" type="number" maxlength="10" name="idVehiculo" id="idVehiculoField" onChange={handleChange} value={selectedUser.idVehiculo}/>
              <label>nombre</label>
              <input className="form-control" type="text" maxlength="300" name="nombre" id="nombreField" onChange={handleChange} value={selectedUser.nombre}/>
              <label>password</label>
              <input className="form-control" type="text" maxlength="200" name="password" id="passwordField" onChange={handleChange} value={selectedUser.password}/>
              <label>telefono</label>
              <input className="form-control" type="text" maxlength="50" name="telefono" id="telefonoField" onChange={handleChange} value={selectedUser.telefono}/>
          </ModalBody>
          <ModalFooter>
            {buildErrorMessage()}
            <button className="btn btn-secondary" onClick={() => crear(selectedUser)}>
              Crear
            </button>
            <button className="btn btn-secondary" onClick={() => setModalCrear(false)}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar el registro? Id: {selectedUser._id}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => eliminar(selectedUser._id)}>
              Sí
            </button>
            <button className="btn btn-secondary" onClick={() => setModalEliminar(false)}>
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>

    );
  }else{    
    return (
      <div className="align-self-center">
        <div className="container-lg align-self-center">
          <div className="input-group col-lg-12">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={searchName}
              onChange={onChangeSearchName}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByName}
              >
                Search
              </button>
            </div>
          </div>
          <div className="input-group col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by ID"
              value={searchId}
              onChange={onChangeSearchId}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findById}
              >
                Search
              </button>
            </div>
          </div>
          <div className="input-group col-lg-4">

            <select onChange={onChangeSearchIdRol}>
            {idRols.map(idRol => {
                return (
                  <option value={idRol}> {idRol.substr(0, 20)} </option>
                )
              })}
            </select>
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByIdRol}
              >
                Search
              </button>
            </div>

          </div>
        </div>
        <div className="col-lg-10 align-self-center">
          <div className="row">
            {users.map((user) => {
              const id = `${user._id}`;
              const name = `${user.nombre}`;
              const Lastname = `${user.apellido}`;
              const idrol = `${user.idRol}`;
              const address = `${user.direccion}`;
              const email = `${user.correoE}`;
              return (
                <div className="col-lg-4 pb-1">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{user.nombre}</h5>
                      <p className="card-text">
                        <strong>Id: </strong>{id}<br/>
                        <strong>name: </strong>{name}<br/>
                        <strong>Id Rol: </strong>{idrol}<br/>
                        <strong>Lastname: </strong>{Lastname}<br/>
                        <strong>Address: </strong>{address}<br/>
                        <strong>Email: </strong>{email}
                      </p>
                      <div className="row">
                      <Link to={"/miperfil/"+user._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                        View User
                      </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    );
  }
};

export default UsersList;