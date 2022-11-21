import http from "../http-common";
import Cookies from 'universal-cookie'
const cookies = new Cookies();
class LoginDataService {

  async get(correoE, password) {
    const result =  await http.get(`/login?correoE=${correoE}&password=${password}`);
    console.log('DB Result: ', result);
    return result;
  }

  
}

export default new LoginDataService();