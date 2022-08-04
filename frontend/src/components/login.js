import React, { useState } from "react";
import UsersDataService from "../services/users";

function Login() {
  const [user, setUser] = useState({
    nombre: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(user);
  };

  //      const deleteCar = async (carId) => {
  //        console.log("Car to be deleted", carId);
  //        await CarsDataService.deleteCar(carId)
  //          .then((response) => {
  //            refreshList();
  //          })
  //          .catch((e) => {
  //            console.log(e);
  //          });
  //      };

  const iniciarSesion = async (user) => {
    await UsersDataService.getLogin(user.nombre, user.password)
      .then((response) => {
        console.log("data", response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="App">
      <label>Usuario: </label>
      <br />
      <input
        type="text"
        className="form-control"
        name="nombre"
        onChange={handleChange}
      />
      <br />
      <label>Contraseña: </label>
      <br />
      <input
        type="password"
        className="form-control"
        name="password"
        onChange={handleChange}
      />
      <br />
      <button className="btn btn-primary" onClick={() => iniciarSesion(user)}>
        Iniciar Sesión
      </button>
    </div>
  );
}

export default Login;
