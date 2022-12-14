import http from '../http-common';
import Cookies from 'universal-cookie';
import { validatePayload } from '../utils/utils';

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

	async find(query, by = 'id', page = 0) {
		console.log(`Searching by: ${by} value: ${query}`);
		const result = await http.get(`sprints?page=${page}&${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	async createSprint({
		idEvento,
		idUsuarioP1,
		idUsuarioP2,
		idVehiculoP1,
		idVehiculoP2,
		reaccionP1,
		reaccionP2,
		tiempo100mtsP1,
		tiempo100mtsP2,
		tiempoLlegadaP1,
		tiempoLlegadaP2,
	}) {
		console.log(
			'About to create sprint: ',
			idEvento,
			idUsuarioP1,
			idUsuarioP2,
			idVehiculoP1,
			idVehiculoP2,
			reaccionP1,
			reaccionP2,
			tiempo100mtsP1,
			tiempo100mtsP2,
			tiempoLlegadaP1,
			tiempoLlegadaP2
		);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idUsuarioP1, idUsuarioP2, idVehiculoP1, idVehiculoP2 });
		if (!result.status) return result;

		result = await http.post(
			`/createSprint?idEvento=${idEvento}&idUsuarioP1=${idUsuarioP1}&idUsuarioP2=${idUsuarioP2}&idVehiculoP1=${idVehiculoP1}&idVehiculoP2=${idVehiculoP2}&reaccionP1=${reaccionP1}&reaccionP2=${reaccionP2}&tiempo100mtsP1=${tiempo100mtsP1}&tiempo100mtsP2=${tiempo100mtsP2}&tiempoLlegadaP1=${tiempoLlegadaP1}&tiempoLlegadaP2=${tiempoLlegadaP2}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	async deleteSprint(id) {
		return await http.delete(`/deleteSprint?_id=${id}`);
	}

	async editSprint({
		_id,
		idEvento,
		idUsuarioP1,
		idUsuarioP2,
		idVehiculoP1,
		idVehiculoP2,
		reaccionP1,
		reaccionP2,
		tiempo100mtsP1,
		tiempo100mtsP2,
		tiempoLlegadaP1,
		tiempoLlegadaP2,
	}) {
		console.log(
			'About to edit sprint: ',
			_id,
			idEvento,
			idUsuarioP1,
			idUsuarioP2,
			idVehiculoP1,
			idVehiculoP2,
			reaccionP1,
			reaccionP2,
			tiempo100mtsP1,
			tiempo100mtsP2,
			tiempoLlegadaP1,
			tiempoLlegadaP2
		);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idUsuarioP1, idUsuarioP2, idVehiculoP1, idVehiculoP2 });
		if (!result.status) return result;

		result = await http.put(
			`/editSprint?_id=${_id}&idEvento=${idEvento}&idUsuarioP1=${idUsuarioP1}&idUsuarioP2=${idUsuarioP2}&idVehiculoP1=${idVehiculoP1}&idVehiculoP2=${idVehiculoP2}&reaccionP1=${reaccionP1}&reaccionP2=${reaccionP2}&tiempo100mtsP1=${tiempo100mtsP1}&tiempo100mtsP2=${tiempo100mtsP2}&tiempoLlegadaP1=${tiempoLlegadaP1}&tiempoLlegadaP2=${tiempoLlegadaP2}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}
}

export default new SprintsDataService();
