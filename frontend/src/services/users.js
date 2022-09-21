import http from "../http-common";


class UsersDataService {
  getAll(page = 0) {
    // return http.get(`user?page=${page}`);
    return http.get(`users?page=${page}`);
  }

  get(id) {
    return http.get(`/users?id=${id}`);
  }

  find(query, by = "Nombre", page = 0) {
    const result = http.get(`users?page=${page}&${by}=${query}`);
    console.log('DB Result: ', result);
    return result;
  } 
  
  async editUser({ _id, nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic}) {
    console.log("About to edit car: ", nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic);
    let result = { status: false };

    result = this.validateUserPayload({ nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic });
    if (!result.status) return result;
    
    result = await http.put(`/editUser?_id=${_id}&nombre=${nombre}&apellido=${apellido}&direccion=${direccion}&correoE=${correoE}&dni=${dni}&fechaNac=${fechaNac}&telefono=${telefono}&profilePic=${profilePic}`);
    console.log('Result: ', result);
    return result;
  }

  getIdRol(id) {
    return http.get(`/usersIdRoles`);
  }

	validateUserPayload(payload) {
    let validationResult = {
        status: true,
    };
    const errorProperties = [];

    Object.keys(payload).forEach((property) => {
      console.log(`Evaluating ${property} value ${payload[property]}`);
      
      if ((payload[property] === undefined) || !payload[property]) {
        errorProperties.push(property);
      }
    });

    if (errorProperties.length) {
      validationResult.status = false;
      validationResult.errorMessage = errorProperties.length > 1 
        ? `Las siguientes propiedades no pueden estar vacias: ${errorProperties}.` 
        : `La siguiente propiedad no puede estar vacia: ${errorProperties}.`;
      
      console.log('', validationResult.errorMessage);
      return validationResult;
    }
    
    return validationResult;
  }

}

export default new UsersDataService();