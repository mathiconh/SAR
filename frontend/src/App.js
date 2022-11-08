import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Inicio from "./components/inicio";
import Login from "./components/login";
import UsersList from "./components/users-list";
import CarsList from "./components/cars-list";
import MiPerfil from "./components/miPerfil";
import ChampionshipsList from "./components/championships-list";
import Inscripcion from "./components/inscripcion";
import Sprints from "./components/sprints-list";
import Clases from "./components/clases-list";
import Cookies from "universal-cookie";
import "./styles/inicio.css";

const cookies = new Cookies();

function App() {
  const completarMenu = () => {
    if (cookies.get("_id")) {
      console.log("User Id: ", cookies.get("_id"));
      console.log("Id Rol: ", cookies.get("idRol"));
      if (parseInt(cookies.get("idRol")) === 1) {
        return completarMenuAdmin();
      } else if (parseInt(cookies.get("idRol")) === 2) {
        return completarMenuUser();
      }
    }
  };

  const completarMenuUser = () => {
    return (
      <div>
        <li key='DropdownUser'>
          <div className="dropdown bugermenu">
            <button
              className="btn btn-secondary navbar-toggler"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li key='UserPerfil'>
                <a href="/miperfil" className="dropdown-item">
                  Mi perfil
                </a>
              </li>
              <li key='BasadoEnSesionRol'>{sesion()}</li>
            </ul>
          </div>
        </li>
      </div>
    );
  };

  const completarMenuAdmin = () => {
    return (
      <div>
        <li key='DropdownAdmin'>
          <div className="dropdown bugermenu">
            <button
              className="btn btn-secondary navbar-toggler"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li key='AdminUsuarios'>
                <a href="/users" className="dropdown-item">
                  Usuarios
                </a>
              </li>
              <li key='AdminAutos'>
                <a href="/cars" className="dropdown-item">
                  ABM Autos
                </a>
              </li>
              <li key='AdminCarreras'>
                <a href="/sprints" className="dropdown-item">
                  ABM Carreras
                </a>
              </li>
              <li key='AdminCampeonatos'>
                <a href="/championships" className="dropdown-item">
                  ABM Campeonatos
                </a>
              </li>
              <li key='AdminClases'>
                <a href="/clases" className="dropdown-item">
                  ABM Clases
                </a>
              </li>
              <li key='AdminPerfil'>
                <a href="/miperfil" className="dropdown-item">
                  Mi Perfil
                </a>
              </li>
              <li key='AdminCerrarSesion'>
                <a
                  onClick={cerrarSesion}
                  href="./login"
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                >
                  Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
        </li>
      </div>
    );
  };

  const sesion = () => {
    if (cookies.get("_id")) {
      return completarMenu();
    } else {
      return (
        <a
          onClick={cerrarSesion}
          href="./login"
          className="nav-link text-white"
          style={{ cursor: "pointer" }}
        >
          <strong> Ingresar</strong>
        </a>
      );
    }
  };

  async function cerrarSesion() {
    cookies.remove("_id", { path: "/" });
    cookies.remove("nombre", { path: "/" });
    cookies.remove("apellido", { path: "/" });
  }

  return (
    <div>
      <div className="navbar navbar-dark d-flex bg-dark box-shadow">
        <div className="container  justify-content-between">
          <div className="col-1">
            <a href="/inicio" className=" navbar-brand d-flex align-items-center">
              <strong>S4R</strong>
            </a>
          </div>
          <div className="col-4">
            <strong className="text-white">
              Bienvenido {cookies.get("nombre")}
            </strong>
          </div>
          <div className="col-6">
            <a href="/inscripcion" className="nav-link text-light float-right">
              <strong>Inscripcion a Carrera</strong>
            </a>
          </div>
          <div className="col-1">{sesion()}</div>
        </div>
      </div>
        <BrowserRouter>
          <Switch>
            <Route exact path={["/", "/Inicio"]} component={Inicio} />
            <Route exact path={["/", "/users"]} component={UsersList} />
            <Route exact path={["/", "/cars"]} component={CarsList} />
            <Route exact path={["/", "/championships"]} component={ChampionshipsList}/>
            <Route exact path={["/", "/Inscripcion"]} component={Inscripcion} />
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path={["/", "/miperfil"]} component={MiPerfil} />
            <Route 
            path="/miperfil/:_id"
            render={(props) => (
              <MiPerfil {...props}/>
            )}
          />
            <Route exact path={["/", "/sprints"]} component={Sprints} />
            <Route exact path={["/", "/clases"]} component={Clases} />
          </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
