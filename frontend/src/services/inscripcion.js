import http from "../http-common";

class InscripcionDataService {
  async getAvailable() {
    const result = await http.get(`availableRaces`);
    console.log('DB Result: ', result);
    return result;
  }

}

export default new InscripcionDataService();