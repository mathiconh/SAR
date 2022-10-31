import http from "../http-common";
import Cookies from 'universal-cookie'
import { validatePayload } from '../utils/payloadValidations';

const cookies = new Cookies();

class SprintsDataService {
  async getAll(page = 0) {
    const result = await http.get(`sprints?page=${page}`);
    console.log('DB Result: ', result);
    return result;
  }

  async get(id) {
    return await http.get(`/sprints?id=${id}`);
  }

  async find(query, by = "patente", page = 0) {
    console.log(`Searching by: ${by} value: ${query}`);
    const result = await http.get(`cars?page=${page}&${by}=${query}`);
    console.log('DB Result: ', result);
    return result;
  } 


  async createSprint({fecha, idCampeonato , idUsuarioP1 , idUsuarioP2 , idVehiculoP1 , idVehiculoP2 , reaccionP1 , reaccionP2 , tiempo100mtsP1 , tiempo100mtsP2 , tiempoLlegadaP1 , pista , clase}) {
    // console.log("About to create sprint: ", patente, modelo, anio, agregados, historia, tallerAsociado );
    let result;
    let idUsuarioModif = cookies.get("_id");



     result = validatePayload({ idUsuarioP1, idUsuarioP2, idVehiculoP1, idVehiculoP2, clase });
     if (!result.status) return result;

    result = await http.post(`/createSprint?fecha=${fecha}&idCampeonato=${idCampeonato}&idUsuarioP1=${idUsuarioP1}&idUsuarioP2=${idUsuarioP2}&idVehiculoP1=${idVehiculoP1}&idVehiculoP2=${idVehiculoP2}&reaccionP1=${reaccionP1}&reaccionP2=${reaccionP2}&tiempo100mtsP1=${tiempo100mtsP1}&tiempo100mtsP2=${tiempo100mtsP2}&tiempoLlegadaP1=${tiempoLlegadaP1}&pista=${pista}&clase=${clase}&idUsuarioModif=${idUsuarioModif}`);
    console.log('Result: ', result);
    return result;
  }

  async deleteSprint(id) {
    return await http.delete(`/deleteSprint?_id=${id}`);
  }

  async editSprint({ _id, fecha, idCampeonato , idUsuarioP1 , idUsuarioP2 , idVehiculoP1 , idVehiculoP2 , reaccionP1 , reaccionP2 , tiempo100mtsP1 , tiempo100mtsP2 , tiempoLlegadaP1 , pista , clase}) {
    let result;
    let idUsuarioModif = cookies.get("_id");

    result = validatePayload({ idUsuarioP1, idUsuarioP2, idVehiculoP1, idVehiculoP2, clase });
    if (!result.status) return result;
    
    result = await http.put(`/editSprint?_id=${_id}&fecha=${fecha}&idCampeonato=${idCampeonato}&idUsuarioP1=${idUsuarioP1}&idUsuarioP2=${idUsuarioP2}&idVehiculoP1=${idVehiculoP1}&idVehiculoP2=${idVehiculoP2}&reaccionP1=${reaccionP1}&reaccionP2=${reaccionP2}&tiempo100mtsP1=${tiempo100mtsP1}&tiempo100mtsP2=${tiempo100mtsP2}&tiempoLlegadaP1=${tiempoLlegadaP1}&pista=${pista}&clase=${clase}&idUsuarioModif=${idUsuarioModif}`);
    console.log('Result: ', result);
    return result;
  }

}

export default new SprintsDataService();