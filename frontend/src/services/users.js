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

    // result = this.validateCarPayload({ patente, modelo, año });
		result.status = true;
    if (!result.status) return result;
    
    result = await http.put(`/editUser?_id=${_id}&nombre=${nombre}&apellido=${apellido}&direccion=${direccion}&correoE=${correoE}&dni=${dni}&fechaNac=${fechaNac}&telefono=${telefono}&profilePic=${profilePic}`);
    console.log('Result: ', result);
    return result;
  }

  getIdRol(id) {
    return http.get(`/usersIdRoles`);
  }

}

export default new UsersDataService();