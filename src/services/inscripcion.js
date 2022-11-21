import http from '../http-common';
import { validatePayload } from '../utils/payloadValidations';

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
}

export default new InscripcionDataService();
