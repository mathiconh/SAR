import http from "../http-common";

class UsersDataService {
  getAll(page = 0) {
    // return http.get(`user?page=${page}`);
    return http.get(`users?page=${page}`);
  }

  get(id) {
    return http.get(`/user?id=${id}`);
  }

  find(query, by = "Nombre", page = 0) {
    // const result = http.get(`users?${by}=${query}&page=${page}`);
    const result = http.get(`users?page=${page}&${by}=${query}`);
    console.log('Result: ', result);
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
    return http.get(`/idRol`);
  }

}

export default new UsersDataService();