import http from "../http-common";
import Cookies from 'universal-cookie'
const cookies = new Cookies();
class PerfilDataService {

  async get(id) {
    return await http.get(`/users?id=${id}`);
  }

}

export default new PerfilDataService();