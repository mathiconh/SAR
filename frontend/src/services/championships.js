import http from "../http-common";
import Cookies from 'universal-cookie'
const cookies = new Cookies();

class ChampionshipsDataService {
  async getAll(page = 0) {
    const result = await http.get(`championships?page=${page}`);
    console.log('DB Result: ', result);
    return result;
  }

  async get(id) {
    return await http.get(`/championships?id=${id}`);
  }

  // async find(query, by = "patente", page = 0) {
  //   console.log(`Searching by: ${by} value: ${query}`);
  //   const result = await http.get(`cars?page=${page}&${by}=${query}`);
  //   console.log('DB Result: ', result);
  //   return result;
  // } 

  async createChampionship({ nombre = '', fechaDesde, fechaHasta }) {
    console.log("About to create championship: ", nombre, fechaDesde, fechaHasta );
    let result;
    let idUsuarioModif = cookies.get("_id");


    // result = this.validateCarPayload({ patente, modelo, año });
    // if (!result.status) return result;

    result = await http.post(`/createChampionship?nombre=${nombre}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&idUsuarioModif=${idUsuarioModif}`);
    console.log('Result: ', result);
    return result;
  }

  async deleteChampionship(id) {
    return await http.delete(`/deleteChampionship?_id=${id}`);
  }

  async editChampionship({ _id, nombre = '', fechaDesde, fechaHasta }) {
    console.log("About to edit championship: ", _id, nombre, fechaDesde, fechaHasta);
    let result;

    //result = this.validateCarPayload({ nombre, modelo, año });
    //if (!result.status) return result;
    
    result = await http.put(`/editChampionship?_id=${_id}&nombre=${nombre}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
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

export default new ChampionshipsDataService();