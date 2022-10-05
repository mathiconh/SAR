import http from "../http-common";
import Cookies from 'universal-cookie'
import { validatePayload } from '../utils/payloadValidations';

const cookies = new Cookies();

class CarsDataService {
  async getAll(page = 0) {
    const result = await http.get(`cars?page=${page}`);
    console.log('DB Result: ', result);
    return result;
  }

  async get(id) {
    return await http.get(`/cars?id=${id}`);
  }

  async find(query, by = "patente", page = 0) {
    console.log(`Searching by: ${by} value: ${query}`);
    const result = await http.get(`cars?page=${page}&${by}=${query}`);
    console.log('DB Result: ', result);
    return result;
  } 


  async createCar({patente, modelo, anio, agregados = '', historia = '', tallerAsociado = ''}) {
    console.log("About to create car: ", patente, modelo, anio, agregados, historia, tallerAsociado );
    let result;
    let idUsuarioModif = cookies.get("_id");
    let idUsuarioDuenio = cookies.get("_id");



    result = validatePayload({ patente, modelo, anio });
    if (!result.status) return result;

    result = await http.post(`/createCar?patente=${patente}&modelo=${modelo}&anio=${anio}&agregados=${agregados}&historia=${historia}&tallerAsociado=${tallerAsociado}&idUsuarioModif=${idUsuarioModif}&idUsuarioDuenio=${idUsuarioDuenio}`);
    console.log('Result: ', result);
    return result;
  }

  async deleteCar(id) {
    return await http.delete(`/deleteCar?_id=${id}`);
  }

  async editCar({ _id, patente, modelo, anio, agregados = '', historia = '', tallerAsociado = '', idUsuarioDuenio }) {
    console.log("About to edit car: ", _id, patente, modelo, anio, agregados, historia, tallerAsociado, idUsuarioDuenio);
    let result;

    result = validatePayload({ idUsuarioDuenio, patente, modelo, anio });
    if (!result.status) return result;
    
    result = await http.put(`/editCar?_id=${_id}&patente=${patente}&modelo=${modelo}&anio=${anio}&agregados=${agregados}&historia=${historia}&tallerAsociado=${tallerAsociado}&idUsuarioDuenio=${idUsuarioDuenio}`);
    console.log('Result: ', result);
    return result;
  }

}

export default new CarsDataService();