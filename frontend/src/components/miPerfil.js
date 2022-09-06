import React, { useState, useEffect } from "react";
import UserDataService from "../services/users";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const MiPerfil = (props) => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchIdRol, setSearchIdRol] = useState("");
  const [idRols, setIdRoles] = useState(["All IdRoles"]);

  //   useEffect(() => {
  //     retrieveUsers();
  //     retrieveIdRol();
  //   }, []);

  //   const onChangeSearchId = e => {
  //     const searchId = e.target.value;
  //     setSearchId(searchId);
  //   };

  //   const onChangeSearchName = e => {
  //     const searchName = e.target.value;
  //     setSearchName(searchName);
  //   };

  //   const onChangeSearchIdRol = e => {
  //     const searchIdRol = e.target.value;
  //     setSearchIdRol(searchIdRol);
  //   };

  //   const retrieveUsers = () => {
  //     UserDataService.getAll()
  //       .then(response => {
  //         console.log(response.data);
  //         setUsers(response.data.users);

  //       })
  //       .catch(e => {
  //         console.log(e);
  //       });
  //   };

  //   const retrieveIdRol = () => {
  //     UserDataService.getIdRol()
  //       .then(response => {
  //         console.log('Resultados: ', response.data);
  //         setIdRoles(["All IdRoles"].concat(response.data));

  //       })
  //       .catch(e => {
  //         console.log(e);
  //       });
  //   };

  //   const refreshList = () => {
  //     retrieveUsers();
  //   };

  //   const find = (query, by) => {
  //     UserDataService.find(query, by)
  //       .then(response => {
  //         console.log(response.data);
  //         setUsers(response.data.users);
  //       })
  //       .catch(e => {
  //         console.log(e);
  //       });
  //   };

  //   const findByName = () => {
  //     find(searchName, "Nombre")
  //   };

  //   const findById = () => {
  //     find(searchId, "_id")
  //   };

  //   const findByIdRol = () => {
  //     if (searchIdRol === "All IdRoles") {
  //       refreshList();
  //     } else {
  //       find(searchIdRol, "IdRol")
  //     }
  //   };
  if (cookies.get("_id")) {
    return (
      <div>
        <div class="container">
          <div class="row">
            <div class="col-lg-12 mb-4 mb-sm-5">
              <div class="card card-style1 border-0">
                <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                  <div class="row align-items-center">
                    <div class="col-lg-6 mb-4 mb-lg-0">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                        alt="..."
                      ></img>
                    </div>
                    <div class="col-lg-6 px-xl-10">
                      <div class="d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                        <h3 class="h2 text-black mb-0">{cookies.get("nombre")} {cookies.get("apellido")}</h3>
                      </div>
                      <ul class="list-unstyled mb-1-9">
                        <li class="mb-2 mb-xl-3 display-28">
                          <span class="display-26 text-secondary me-2 font-weight-600">
                            Dirección:
                          </span>
                          {cookies.get("direccion")}
                        </li>
                        <li class="mb-2 mb-xl-3 display-28">
                          <span class="display-26 text-secondary me-2 font-weight-600">
                            Telefono:
                          </span>{" "}
                          {cookies.get("telefono")}
                        </li>
                        <li class="mb-2 mb-xl-3 display-28">
                          <span class="display-26 text-secondary me-2 font-weight-600">
                            Email:
                          </span>{" "}
                          {cookies.get("correoE")}
                        </li>
                        <li class="mb-2 mb-xl-3 display-28">
                          <span class="display-26 text-secondary me-2 font-weight-600">
                            DNI:
                          </span>{" "}
                          {cookies.get("dni")}
                        </li>
                        <li class="display-28">
                          <span class="display-26 text-secondary me-2 font-weight-600">
                            Fecha de nacimiento:
                          </span>{" "}
                          {cookies.get("fechaNac")}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-12 mb-4 mb-sm-5">
              <div>
                <span class="section-title text-primary mb-3 mb-sm-4">
                  About Me
                </span>
                <p>
                  Edith is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                </p>
                <p class="mb-0">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    window.location.href = "./login";
    console.log("Necesita logearse para poder acceder al ABM de usuarios");
  }
};

export default MiPerfil;
