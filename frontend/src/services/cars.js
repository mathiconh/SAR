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
    const result = await http.get(`cars?page=${page}&${by}=${query}`);
    console.log('DB Result: ', result);
    return result;
  } 

  async createCar({patent, model, year, aggregated, history, workshopAssociated}) {
    console.log("About to create car: ", patent, model, year, aggregated, history, workshopAssociated);
    const result = await http.post(`/createCar?patent=${patent}&model=${model}&year=${year}&aggregated=${aggregated}&history=${history}&workshopAssociated=${workshopAssociated}`);
    console.log('Result: ', result);
    return result;
  }

  async deleteCar(id) {
    return await http.delete(`/deleteCar?_id=${id}`);
  }

  async editCar({ _id, patent, model, year, aggregated, history, workshopAssociated }) {
    console.log("About to edit car: ", _id, patent, model, year, aggregated, history, workshopAssociated);
    const result = await http.put(`/editCar?_id=${_id}&patent=${patent}&model=${model}&year=${year}&aggregated=${aggregated}&history=${history}&workshopAssociated=${workshopAssociated}`);
    console.log('Result: ', result);
    return result;
  }

}

export default new CarsDataService();