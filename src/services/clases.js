import http from '../http-common';
import Cookies from 'universal-cookie';
import { validatePayload } from '../utils/utils';

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

	async createClase({ idClase, nombre, tiempo }, allClases) {
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idClase, nombre, tiempo });
		result = this.validarClase(idClase, tiempo, allClases);
		if (!result.status) return result;

		result = await http.post(`/createClase?idClase=${idClase}&nombre=${nombre}&tiempo=${tiempo}&idUsuarioModif=${idUsuarioModif}`);
		console.log('Result: ', result);
		return result;
	}

	async deleteClase(id) {
		return await http.delete(`/deleteClase?_id=${id}`);
	}

	async editClase({ _id, idClase, nombre, tiempo }, allClases) {
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idClase, nombre, tiempo });
		result = this.validarClase(idClase, tiempo, allClases);
		if (!result.status) return result;

		result = await http.put(`/editClase?_id=${_id}&idClase=${idClase}&nombre=${nombre}&tiempo=${tiempo}&idUsuarioModif=${idUsuarioModif}`);
		console.log('Result: ', result);
		return result;
	}

	validarClase(idClase, tiempo, allClases) {
		const resultValidaciones = {
			status: true,
		};

		if (parseInt(tiempo) === 0 || !tiempo || tiempo === '') {
			resultValidaciones.status = false;
			resultValidaciones.errorMessage = 'Debe configurar un tiempo mayor a 0';
		}
		if (idClase !== 'skip') {
			allClases.forEach((clase) => {
				console.log(`Actual ${idClase} VS ${clase.idClase}`);
				if (idClase === clase.idClase) {
					resultValidaciones.status = false;
					resultValidaciones.errorMessage = 'No puede usar el ID Clase de un clase que ya exista';
				}
			});
		}

		return resultValidaciones;
	}
}

export default new ClasesDataService();
