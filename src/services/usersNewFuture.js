import http from '../http-common';

class CarsDataService {
	async getAll(page = 0) {
		const result = await http.get(`cars?page=${page}`);
		console.log('DB Result: ', result);
		return result;
	}

	async get(id) {
		return await http.get(`/cars?id=${id}`);
	}

	async find(query, by = 'patente', page = 0) {
		console.log(`Searching by: ${by} value: ${query}`);
		const result = await http.get(`cars?page=${page}&${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	async createCar({ patente, modelo, año, agregados, historia, tallerAsociado }) {
		console.log('About to create car: ', patente, modelo, año, agregados, historia, tallerAsociado);
		const result = await http.post(`/createCar?patente=${patente}&modelo=${modelo}&año=${año}&agregados=${agregados}&historia=${historia}&tallerAsociado=${tallerAsociado}`);
		console.log('Result: ', result);
		return result;
	}

	async deleteCar(id) {
		return await http.delete(`/deleteCar?_id=${id}`);
	}

	async editCar({ _id, patente, modelo, año, agregados, historia, tallerAsociado }) {
		console.log('About to edit car: ', _id, patente, modelo, año, agregados, historia, tallerAsociado);
		const result = await http.put(
			`/editCar?_id=${_id}&patente=${patente}&modelo=${modelo}&año=${año}&agregados=${agregados}&historia=${historia}&tallerAsociado=${tallerAsociado}`
		);
		console.log('Result: ', result);
		return result;
	}
}

export default new CarsDataService();
