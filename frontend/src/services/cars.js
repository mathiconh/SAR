import http from "../http-common";
import Cookies from 'universal-cookie'
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
    console.log("About to create car: ", patente, modelo, anio, agregados, historia, tallerAsociado);
    let result;
    let idUsuarioModif = cookies.get("_id");


    result = this.validateCarPayload({ patente, modelo, anio });
    if (!result.status) return result;

    result = await http.post(`/createCar?patente=${patente}&modelo=${modelo}&anio=${anio}&agregados=${agregados}&historia=${historia}&tallerAsociado=${tallerAsociado}&idUsuarioModif=${idUsuarioModif}`);
    console.log('Result: ', result);
    return result;
  }

  async deleteCar(id) {
    return await http.delete(`/deleteCar?_id=${id}`);
  }

  async editCar({ _id, patente, modelo, año, agregados = '', historia = '', tallerAsociado = '' }) {
    console.log("About to edit car: ", _id, patente, modelo, año, agregados, historia, tallerAsociado);
    let result;

    result = this.validateCarPayload({ patente, modelo, año });
    if (!result.status) return result;
    
    result = await http.put(`/editCar?_id=${_id}&patente=${patente}&modelo=${modelo}&año=${año}&agregados=${agregados}&historia=${historia}&tallerAsociado=${tallerAsociado}`);
    console.log('Result: ', result);
    return result;
  }

  validateCarPayload(payload) {
    let validationResult = {
        status: true,
    };
    const errorProperties = [];

    Object.keys(payload).forEach((property) => {
      console.log(`Evaluating ${property} value ${payload[property]}`);
      
      if ((payload[property] === undefined) || !payload[property]) {
        errorProperties.push(property);
      }
    });

    if (errorProperties.length) {
      validationResult.status = false;
      validationResult.errorMessage = errorProperties.length > 1 
        ? `Las siguientes propiedades no pueden estar vacias: ${errorProperties}.` 
        : `La siguiente propiedad no puede estar vacia: ${errorProperties}.`;
      
      console.log('', validationResult.errorMessage);
      return validationResult;
    }
    
    return validationResult;
  }

}

export default new CarsDataService();