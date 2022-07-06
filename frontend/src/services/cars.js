import http from "../http-common";

class CarsDataService {
  getAll(page = 0) {
    const result = http.get(`cars?page=${page}`);
    console.log('DB Result: ', result);
    return result;
  }

  get(id) {
    return http.get(`/cars?id=${id}`);
  }

  find(query, by = "patent", page = 0) {
    const result = http.get(`cars?page=${page}&${by}=${query}`);
    console.log('DB Result: ', result);
    return result;
  } 

  createCar(patent, model, year, aggregated, history, workshopAssociated) {
    console.log("About to create car: ", patent, model, year, aggregated, history, workshopAssociated);
    return http.post(`/createCar?&patent=${patent}&model=${model}&year=${year}&aggregated=${aggregated}$history=${history}$workshopAssociated=${workshopAssociated}}`);
  }

  deleteCar(id) {
    return http.delete(`/deleteCar?_id=${id}`);
  }

  editCar({ _id, patent, model, year, aggregated, history, workshopAssociated }) {
    console.log("About to edit car: ", _id, patent, model, year, aggregated, history, workshopAssociated);
    return http.put(`/editCar?_id=${_id}&patent=${patent}&model=${model}&year=${year}&aggregated=${aggregated}$history=${history}$workshopAssociated=${workshopAssociated}}`);
  }

  // createAddress(data) {
  //   return http.post("/address-new", data);
  // }

  // updateAddress(data) {
  //   return http.put("/address-edit", data);
  // }

  // deleteAddress(id, userId) {
  //   return http.delete(`/address-delete?id=${id}`, {data:{user_id: userId}});
  // }

}

export default new CarsDataService();