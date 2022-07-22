import http from "../http-common";

class CarsDataService {
  async getAll(page = 0) {
    const result = await http.get(`cars?page=${page}`);
    console.log('DB Result: ', result);
    return result;
  }

  async get(id) {
    return await http.get(`/cars?id=${id}`);
  }

  async find(query, by = "patent", page = 0) {
    console.log(`Searching by: ${by} value: ${query}`);
    const result = await http.get(`cars?page=${page}&${by}=${query}`);
    console.log('DB Result: ', result);
    return result;
  } 

  async createCar({patent, model, year, aggregated = '', history = '', workshopAssociated = ''}) {
    console.log("About to create car: ", patent, model, year, aggregated, history, workshopAssociated);
    let result;

    result = this.validateCarPayload({ patent, model, year });
    if (!result.status) return result;

    result = await http.post(`/createCar?patent=${patent}&model=${model}&year=${year}&aggregated=${aggregated}&history=${history}&workshopAssociated=${workshopAssociated}`);
    console.log('Result: ', result);
    return result;
  }

  async deleteCar(id) {
    return await http.delete(`/deleteCar?_id=${id}`);
  }

  async editCar({ _id, patent, model, year, aggregated = '', history = '', workshopAssociated = '' }) {
    console.log("About to edit car: ", _id, patent, model, year, aggregated, history, workshopAssociated);
    let result;

    result = this.validateCarPayload({ patent, model, year });
    if (!result.status) return result;
    
    result = await http.put(`/editCar?_id=${_id}&patent=${patent}&model=${model}&year=${year}&aggregated=${aggregated}&history=${history}&workshopAssociated=${workshopAssociated}`);
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