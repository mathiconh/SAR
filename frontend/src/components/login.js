import React, { useState } from "react";
import LoginDataService from "../services/login";
import { Alert } from "reactstrap";
import Cookies from "universal-cookie";
import "../styles/login.css";


const cookies = new Cookies();

function Login() {
  const [user, setUser] = useState({
    correoE: "",
    password: "",
  });
  const [validationErrorMessage, setValidationErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const logIn = async (user) => {
    const result = await LoginDataService.get(user.correoE, user.password);
    if (result.data.status) {
      setValidationErrorMessage("");

      cookies.set("_id", result.data.responseData._id, { path: "/" });
      cookies.set("nombre", result.data.responseData.nombre, { path: "/" });
      cookies.set("apellido", result.data.responseData.apellido, { path: "/" });
      cookies.set("idRol", result.data.responseData.idRol, { path: "/" });
      window.location.href = "./cars";
    } else {
      setValidationErrorMessage(result?.data?.errorMessage);
    }
  };

  const buildErrorMessage = () => {
    if (validationErrorMessage !== "") {
      return (
        <Alert
          id="errorMessage"
          className="alert alert-danger fade show"
          key="danger"
          variant="danger"
        >
          {validationErrorMessage}
        </Alert>
      );
    }
    return;
  };

  return (
    <div className="App">
      <div className="text-center">
        <div className="form-signin">
          <h1 className="h3 mb-3 font-weight-normal">Por favor, ingresa</h1>
          <label  className="sr-only">
            Usuario
          </label>
          <input
            type="text"
            className="form-control"
            name="correoE"
            onChange={handleChange}
          />
          <label  className="sr-only">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={handleChange}
          />{" "}
          <div className="checkbox mb-3">
            <label></label>
          </div>
          <button className="btn btn-primary" onClick={() => logIn(user)}>
            Iniciar Sesión
          </button>
          {buildErrorMessage()}
        </div>
      </div>
    </div>
  );
}

export default Login;
