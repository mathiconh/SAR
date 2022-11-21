import http from '../http-common';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class ClasesDataService {
	async getAll(page = 0) {
		const result = await http.get(`clases?page=${page}`);
		console.log('DB Result: ', result);
		return result;
	}

	async get(id) {
		return await http.get(`/clases?id=${id}`);
	}

	async createClase({ nombre, tiempo }) {
		let result;
		let idUsuarioModif = cookies.get('_id');

		// result = validatePayload({ patente, modelo, anio });
		// if (!result.status) return result;

		result = await http.post(`/createClase?nombre=${nombre}&tiempo=${tiempo}&idUsuarioModif=${idUsuarioModif}`);
		console.log('Result: ', result);
		return result;
	}

	async deleteClase(id) {
		return await http.delete(`/deleteClase?_id=${id}`);
	}

	async editClase({ _id, nombre, tiempo }) {
		let result;
		let idUsuarioModif = cookies.get('_id');

		// result = validatePayload({ idUsuarioDuenio, patente, modelo, anio });
		// if (!result.status) return result;

		result = await http.put(`/editClase?_id=${_id}&nombre=${nombre}&tiempo=${tiempo}&idUsuarioModif=${idUsuarioModif}`);
		console.log('Result: ', result);
		return result;
	}
}

export default new ClasesDataService();
