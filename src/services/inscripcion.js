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

	async createInscripcionABM({ carreraId, claseId, idUsuario, pagarMP, vehiculoId, precio, fechaSprint, matcheado }) {
		console.log('About inscribir: ', carreraId, claseId, idUsuario, pagarMP, vehiculoId, precio, fechaSprint, matcheado);
		let result;

		result = validatePayload({ carreraId, claseId, idUsuario, pagarMP, vehiculoId, precio, fechaSprint, matcheado });
		if (!result.status) return result;

		result = await http.post(
			`/createInscripcion?carreraId=${carreraId}&claseId=${claseId}&idUsuario=${idUsuario}&pagarMP=${pagarMP}&vehiculoId=${vehiculoId}&precio=${precio}&fechaSprint=${fechaSprint}&matcheado=${matcheado}`
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

	async get(id) {
		console.log('Searching by Id: ', id);
		return await http.get(`/inscripciones?_id=${id}`);
	}

	async deleteInscripcion(id) {
		return await http.delete(`/deleteInscripcion?_id=${id}`);
	}

	async editInscripcion({ _id, carreraId, claseId, idUsuario, pagarMP, vehiculoId, precio, fechaSprint, matcheado }) {
		console.log('About edit: ', _id, carreraId, claseId, idUsuario, pagarMP, vehiculoId, precio, fechaSprint, matcheado);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ carreraId, claseId, idUsuario, pagarMP, vehiculoId, precio, fechaSprint, matcheado });
		if (!result.status) return result;

		result = await http.put(
			`/editInscripcion?_id=${_id}&carreraId=${carreraId}&claseId=${claseId}&idUsuario=${idUsuario}&pagarMP=${pagarMP}&vehiculoId=${vehiculoId}&precio=${precio}&fechaSprint=${fechaSprint}&matcheado=${matcheado}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}
}

export default new InscripcionDataService();
