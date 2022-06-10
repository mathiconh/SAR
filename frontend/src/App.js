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

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null)
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
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (
            <BrowserRouter>
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </BrowserRouter>
            )}

          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <BrowserRouter>
          <Switch>
            <Route exact path={["/", "/users"]} component={UsersList} />
            <Route exact path={["/", "/cars"]} component={CarsList} />
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