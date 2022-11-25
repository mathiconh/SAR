import http from '../http-common';
import { validatePayload } from '../utils/payloadValidations';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class InscripcionDataService {
	async getAvailable() {
		const result = await http.get(`availableRaces`);
		console.log('DB Result: ', result);
		return result;
	}

	async createInscripcion({ carreraId, claseId, idUsuario, pagarMP, vehiculoSeleccionado, fechaSprint }) {
		console.log('About inscribir: ', carreraId, claseId, idUsuario, pagarMP, vehiculoSeleccionado, fechaSprint);
		let result;

		result = validatePayload({ carreraId, claseId, idUsuario, vehiculoSeleccionado });
		if (!result.status) return result;

		result = await http.post(
			`/createInscripcion?carreraId=${carreraId}&claseId=${claseId}&idUsuario=${idUsuario}&pagarMP=${pagarMP}&vehiculoId=${vehiculoSeleccionado}&fechaSprint=${fechaSprint}`
		);
		// Testing purposes
		// result.status = 200;
		console.log('Result: ', result);
		return result;
	}

	async createInscripcionABM({ carreraId, claseId, idUsuario, pagarMP, vehiculoId, fechaSprint, matcheado }) {
		console.log('About inscribir: ', carreraId, claseId, idUsuario, pagarMP, vehiculoId, fechaSprint, matcheado);
		let result;

		result = validatePayload({ carreraId, claseId, idUsuario, pagarMP, vehiculoId, fechaSprint, matcheado });
		if (!result.status) return result;

		result = await http.post(
			`/createInscripcion?carreraId=${carreraId}&claseId=${claseId}&idUsuario=${idUsuario}&pagarMP=${pagarMP}&vehiculoId=${vehiculoId}&fechaSprint=${fechaSprint}&matcheado=${matcheado}`
		);
		// Testing purposes
		// result.status = 200;
		console.log('Result: ', result);
		return result;
	}

	async getAll(page = 0) {
		const result = await http.get(`inscripciones?page=${page}`);
		console.log('DB Result: ', result);
		return result;
	}

	async get(query, by = 'carreraId', page = 0) {
		console.log(`Searching by: ${by} value: ${query}`);
		const result = await http.get(`/inscripciones?page=${page}&${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	async getRegularUser(query, by = 'carreraId', userId) {
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

	async editInscripcion({ _id, carreraId, claseId, idUsuario, pagarMP, vehiculoId, fechaSprint, matcheado, ingreso }) {
		console.log('About edit: ', _id, carreraId, claseId, idUsuario, pagarMP, vehiculoId, fechaSprint, matcheado, ingreso);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ carreraId, claseId, idUsuario, pagarMP, vehiculoId, fechaSprint, matcheado, ingreso });
		if (!result.status) return result;

		result = await http.put(
			`/editInscripcion?_id=${_id}&carreraId=${carreraId}&claseId=${claseId}&idUsuario=${idUsuario}&pagarMP=${pagarMP}&vehiculoId=${vehiculoId}&fechaSprint=${fechaSprint}&matcheado=${matcheado}&idUsuarioModif=${idUsuarioModif}&ingreso=${ingreso}`
		);
		console.log('Result: ', result);
		return result;
	}
}

export default new InscripcionDataService();
