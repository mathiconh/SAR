import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import UsersList from "./components/users-list";
import CarsList from "./components/cars-list";
import ChampionshipsList from "./components/championships-list";
import Login from "./components/login";
// import addCar from "./components/add-car"
import Cookies from 'universal-cookie'
const cookies = new Cookies();

function App() {


  const sesion = () => {
    if(cookies.get('_id')){
      return(
        <a onClick={cerrarSesion} href="./login" className="nav-link" style={{cursor:'pointer'}}>
          Cerrar Sesión 
        </a>
      );
      
    }else{
      return(
          <a onClick={cerrarSesion} href="./login" className="nav-link" style={{cursor:'pointer'}}>
            Ingresar
          </a>
      );
    };
      
    
  }

  async function cerrarSesion() {
    cookies.remove('_id', {path: "/"});
    cookies.remove('nombre', {path: "/"});
    cookies.remove('apellido', {path: "/"});
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/users" className="navbar-brand">
          User Addresses
        </a>
        <a href="/cars" className="navbar-brand">
          Cars ABM
        </a>
        <a href="/login" className="navbar-brand">
          Login
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <BrowserRouter>
              <Link to={"/users"} className="nav-link">
                Users
              </Link>
            </BrowserRouter>
          </li>
          <li className="nav-item">
            <BrowserRouter>
              <Link to={"/cars"} className="nav-link">
                Cars
              </Link>
            </BrowserRouter>
          </li>
          <li className="nav-item">
            <BrowserRouter>
              <Link to={"/championships"} className="nav-link">
                Campeonatos
              </Link>
            </BrowserRouter>
          </li>
          <li className="nav-item" >
            {sesion()}
          </li>
          <li className="navbar-brand">
            Bienvenido {cookies.get("nombre")}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <BrowserRouter>
          <Switch>
            <Route exact path={["/", "/users"]} component={UsersList} />
            <Route exact path={["/", "/cars"]} component={CarsList} />
            <Route exact path={["/", "/championships"]} component={ChampionshipsList} />
            <Route exact path={["/", "/login"]} component={Login} />

            
            {/* <Route exact path={["/", "/add-car"]} component={addCar} /> */}

          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;