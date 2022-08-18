import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AddAddress from "./components/add-address";
import User from "./components/users";
import UsersList from "./components/users-list";
import Car from "./components/cars";
import CarsList from "./components/cars-list";
import Login from "./components/login";
// import addCar from "./components/add-car"
import Cookies from 'universal-cookie'
const cookies = new Cookies();

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }


  const sesion = () => {
    if(cookies.get('_id')){
      console.log("entro al primero")
      return(
        <a onClick={cerrarSesion} className="nav-link" style={{cursor:'pointer'}}>
          Cerrar Sesión 
        </a>
      );
      
    }else{
      console.log("entro al 2do")
      return(
          <a onClick={cerrarSesion} className="nav-link" style={{cursor:'pointer'}}>
            Ingresar
          </a>
      );
    };
      
    
  }

  async function cerrarSesion() {
    cookies.remove('_id', {path: "/"});
    cookies.remove('nombre', {path: "/"});
    cookies.remove('apellido', {path: "/"});
    window.location.href="./login"
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
          <li className="nav-item" >
            {sesion()}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <BrowserRouter>
          <Switch>
            <Route exact path={["/", "/users"]} component={UsersList} />
            <Route exact path={["/", "/cars"]} component={CarsList} />
            <Route exact path={["/", "/login"]} component={Login} />

            
            {/* <Route exact path={["/", "/add-car"]} component={addCar} /> */}

            <Route 
              path="/users/:id/address"
              render={(props) => (
                <AddAddress {...props} user={user} />
              )}
            />
            <Route 
              path="/users/:id"
              render={(props) => (
                <User {...props} user={user} />
              )}
            />
            // TODO: Investigar como funciona para desde aca darle estilo al render
            <Route 
              path="/cars/:id"
              render={(props) => (
                <Car {...props} user={user} />
              )}
            />
            <Route 
              path="/login"
              render={(props) => (
                <Login {...props} login={login} />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;