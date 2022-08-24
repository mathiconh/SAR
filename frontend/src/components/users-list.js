import React, { useState, useEffect } from "react";
import UserDataService from "../services/users";
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie'
const cookies = new Cookies();

const UsersList = props => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName ] = useState("");
  const [searchId, setSearchId ] = useState("");
  const [searchIdRol, setSearchIdRol ] = useState("");
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

  const find = (query, by) => {
    UserDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setUsers(response.data.users);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "Nombre")
  };

  const findById = () => {
    find(searchId, "_id")
  };

  const findByIdRol = () => {
    if (searchIdRol === "All IdRoles") {
      refreshList();
    } else {
      find(searchIdRol, "IdRol")
    }
  };
  if (cookies.get("_id")){
    return (
      <div>
        <div className="row pb-1">
          <div className="input-group col-lg-4">
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
        <div className="row">
          {users.map((user) => {
            const id = `${user._id}`;
            const name = `${user.nombre}`;
            const Lastname = `${user.apellido}`;
            const idrol = `${user.idRol}`;
            const address = `${user.direccion}`;
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
                      <strong>Address: </strong>{address}
                    </p>
                    <div className="row">
                    <Link to={"/users/"+user._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
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
    );
  }else{    
    window.location.href="./login" 
    console.log("Necesita logearse para poder acceder al ABM de usuarios");
  }
};

export default UsersList;