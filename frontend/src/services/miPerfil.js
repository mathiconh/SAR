import http from "../http-common";
import Cookies from 'universal-cookie'
const cookies = new Cookies();
class PerfilDataService {

  async get(_id) {
    return await http.get(`/users?_id=${_id}`);
  }

}

export default new PerfilDataService();