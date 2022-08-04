import http from "../http-common";


class UsersDataService {
  getAll(page = 0) {
    // return http.get(`user?page=${page}`);
    return http.get(`users?page=${page}`);
  }

  get(id) {
    return http.get(`/users?id=${id}`);
  }

  getLogin(nombre, password) {
    const result =  http.get(`/login?Nombre=${nombre}&Password=${password}`);
    console.log('DB Result: ', result);
    return result;
  }
  

  find(query, by = "Nombre", page = 0) {
    const result = http.get(`users?page=${page}&${by}=${query}`);
    console.log('DB Result: ', result);
    return result;
  } 

  createAddress(data) {
    return http.post("/address-new", data);
  }

  updateAddress(data) {
    return http.put("/address-edit", data);
  }

  deleteAddress(id, userId) {
    return http.delete(`/address-delete?id=${id}`, {data:{user_id: userId}});
  }

  getIdRol(id) {
    return http.get(`/usersIdRoles`);
  }

}

export default new UsersDataService();