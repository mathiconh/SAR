import http from "../http-common";

class LoginDataService {

  get(id) {
    return http.get(`/login?id=${id}`);
  }
  
}

export default new LoginDataService();