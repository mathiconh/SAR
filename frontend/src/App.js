import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import UsersList from "./components/users-list";
import CarsList from "./components/cars-list";
import ChampionshipsList from "./components/championships-list";
import Login from "./components/login";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {
  const menuPopulate = () => {
    if (cookies.get("_id")) {
      return (
        <div>
          <li>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Menu
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
                <li className="nav-item">
                  <a href="/championships" className="dropdown-item">
                    Campeonatos
                  </a>
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
          className="nav-link"
          style={{ cursor: "pointer" }}
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
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container-fluid">
          <div className="navbar-nav mr-auto">
            <li className="navbar-brand">Bienvenido {cookies.get("nombre")}</li>
            <li className="nav-item">{sesion()}</li>
            {menuPopulate()}
          </div>
        </div>
      </nav>
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
            <Route exact path={["/", "/login"]} component={Login} />

            {/* <Route exact path={["/", "/add-car"]} component={addCar} /> */}
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
