import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
import Inicio from "./components/inicio";
import Login from "./components/login";
import UsersList from "./components/users-list";
import CarsList from "./components/cars-list";
import ChampionshipsList from "./components/championships-list";
import Inscripcion from "./components/inscripcion";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {
  const menuPopulate = () => {
    if (cookies.get("_id")) {
      return (
        <div>
          <li>
            <div className="dropdown bugermenu">
              <button
                className="btn btn-secondary  navbar-toggler"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a href="/users" className="dropdown-item">
                    Usuarios
                  </a>
                </li>
                <li>
                  <a href="/cars" className="dropdown-item">
                    ABM Autos
                  </a>
                </li>
                <li>
                  <a href="/championships" className="dropdown-item">
                    ABM campeonatos
                  </a>
                </li>
                <li>
                    {sesion()}
                </li>
              </ul>
            </div>
          </li>
        </div>
      );
    }
  };

  const sesion = () => {
    if (cookies.get("_id")) {
      return (
        <a
          onClick={cerrarSesion}
          href="./login"
          className="dropdown-item"
        >
          Cerrar Sesión
        </a>
      );
    } else {
      return (
        <a
          onClick={cerrarSesion}
          href="./login"
          className="nav-link"
          style={{ cursor: "pointer" }}
        >
          Ingresar
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
      <div class="navbar navbar-dark d-flex bg-dark box-shadow">
        <div class="container  justify-content-between">
        <div className="col-6"><a href="#" class=" navbar-brand d-flex align-items-center">
            <strong>S4R</strong>
          </a></div>
        <div className="col-5">
        <a href="/inscripcion" className="nav-link text-light float-right" >
            <strong> Inscripcion a Carrera</strong>
          </a></div>
        <div className="col-1">
          {menuPopulate()}</div>
          
          

        </div>
      </div>
      <div className="container mt-3">
        <BrowserRouter>
          <Switch>
            <Route exact path={["/", "/users"]} component={UsersList} />
            <Route exact path={["/", "/cars"]} component={CarsList} />
            <Route
              exact
              path={["/", "/championships"]}
              component={ChampionshipsList}
            />
            <Route exact path={["/", "/Inicio"]} component={Inicio} />
            <Route exact path={["/", "/Inscripcion"]} component={Inscripcion} />
            <Route exact path={["/", "/login"]} component={Login} />

            {/* <Route exact path={["/", "/add-car"]} component={addCar} /> */}
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
