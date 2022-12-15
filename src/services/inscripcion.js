import http from '../http-common';
import { validatePayload } from '../utils/utils';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class InscripcionDataService {
	async getAvailable() {
		const result = await http.get(`availableRaces`);
		console.log('DB Result: ', result);
		return result;
	}

	async createInscripcion({ idEvento, claseId, idUsuario, vehiculoSeleccionado, fechaSprint }) {
		console.log('About inscribir: ', idEvento, claseId, idUsuario, vehiculoSeleccionado, fechaSprint);
		let result;

		result = validatePayload({ idEvento, claseId, idUsuario, vehiculoSeleccionado });
		if (!result.status) return result;

		result = await http.post(`/createInscripcion?idEvento=${idEvento}&claseId=${claseId}&idUsuario=${idUsuario}&vehiculoId=${vehiculoSeleccionado}&fechaSprint=${fechaSprint}`);
		// Testing purposes
		// result.status = 200;
		console.log('Result: ', result);
		return result;
	}

	async createInscripcionABM({ idEvento, claseId, idUsuario, vehiculoId, fechaSprint, matcheado, ingreso }) {
		console.log('About inscribir: ', idEvento, claseId, idUsuario, vehiculoId, fechaSprint, matcheado, ingreso);
		let result;

		result = validatePayload({ idEvento, claseId, idUsuario, vehiculoId, fechaSprint, matcheado, ingreso });
		if (!result.status) return result;
		result = this.validarInscripcion(matcheado, ingreso);
		if (!result.status) return result;

		result = await http.post(
			`/createInscripcion?idEvento=${idEvento}&claseId=${claseId}&idUsuario=${idUsuario}&vehiculoId=${vehiculoId}&fechaSprint=${fechaSprint}&matcheado=${matcheado}&ingreso=${ingreso}`
		);

		console.log('Result: ', result);
		return result;
	}

	async getAll(page = 0) {
		const result = await http.get(`inscripciones?page=${page}`);
		console.log('DB Result: ', result);
		return result;
	}

	async get(query, by = 'idEvento', page = 0) {
		console.log(`Searching by: ${by} value: ${query}`);
		const result = await http.get(`/inscripciones?page=${page}&${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	async getRegularUser(query, by = 'idEvento', userId) {
		let result;
		console.log(`Searching by: ${by} value: ${query} for User: ${userId}`);
		if (query === '') {
			result = await http.get(`/inscripciones?idUsuario=${userId}`);
		} else {
			result = await http.get(`/inscripciones?perfil=${userId}&${by}=${query}`);
		}
		console.log('DB Result: ', result);
		return result;
	}

	async deleteInscripcion(id) {
		return await http.delete(`/deleteInscripcion?_id=${id}`);
	}

	async editInscripcion({ _id, idEvento, claseId, idUsuario, vehiculoId, fechaSprint, matcheado, ingreso }) {
		console.log('About edit: ', _id, idEvento, claseId, idUsuario, vehiculoId, fechaSprint, matcheado, ingreso);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idEvento, claseId, idUsuario, vehiculoId, fechaSprint, matcheado, ingreso });
		if (!result.status) return result;
		result = this.validarInscripcion(matcheado, ingreso);
		if (!result.status) return result;

		result = await http.put(
			`/editInscripcion?_id=${_id}&idEvento=${idEvento}&claseId=${claseId}&idUsuario=${idUsuario}&vehiculoId=${vehiculoId}&fechaSprint=${fechaSprint}&matcheado=${matcheado}&idUsuarioModif=${idUsuarioModif}&ingreso=${ingreso}`
		);
		console.log('Result: ', result);
		return result;
	}

	validarInscripcion(matcheado, ingreso) {
		const resultValidaciones = {
			status: true,
		};

		if (matcheado.toLowerCase() !== 'si' && matcheado.toLowerCase() !== 'no') {
			resultValidaciones.status = false;
			resultValidaciones.errorMessage = 'Los valores de matcheado solo pueden ser "Si" o "No"';
		}
		if (ingreso.toLowerCase() !== 'si' && ingreso.toLowerCase() !== 'no') {
			resultValidaciones.status = false;
			resultValidaciones.errorMessage = 'Los valores de ingreso solo pueden ser "Si" o "No"';
		}

		return resultValidaciones;
	}
}

export default new InscripcionDataService();
