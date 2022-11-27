import http from '../http-common';
import Cookies from 'universal-cookie';
import { validatePayload, fechaValida } from '../utils/utils';

const cookies = new Cookies();

class EventosDataService {
	async getAll(page = 0) {
		const result = await http.get(`eventos?page=${page}`);
		console.log('DB Result: ', result);
		return result;
	}

	async get(id) {
		return await http.get(`/eventos?_id=${id}`);
	}

	async find(query, by = 'idCarrera') {
		console.log(`Searching by: ${by} value: ${query}`);
		const result = await http.get(`eventos?${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	async createEvento({ idCarrera, fecha, cupos, idClase, cupoMaximo, precio }, allEventos) {
		console.log('About to create evento: ', idCarrera, fecha, cupos, idClase, cupoMaximo, precio);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idCarrera, fecha, cupos, idClase, cupoMaximo, precio });
		result = this.validarEvento(idCarrera, fecha, cupos, cupoMaximo, precio, allEventos);

		if (!result.status) return result;

		result = await http.post(
			`/createEvento?idCarrera=${idCarrera}&fecha=${fecha}&cupos=${cupos}&idClase=${idClase}&cupoMaximo=${cupoMaximo}&precio=${precio}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	async deleteEvento(id) {
		return await http.delete(`/deleteEvento?_id=${id}`);
	}

	async editEvento({ _id, idCarrera, fecha, cupos, idClase, cupoMaximo, precio }, allEventos) {
		console.log('About to edit evento: ', _id, idCarrera, fecha, cupos, idClase, cupoMaximo, precio);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idCarrera, fecha, cupos, idClase, cupoMaximo, precio });
		result = this.validarEvento('skip', fecha, cupos, cupoMaximo, precio, allEventos);

		if (!result.status) return result;

		result = await http.put(
			`/editEvento?_id=${_id}&idCarrera=${idCarrera}&fecha=${fecha}&cupos=${cupos}&idClase=${idClase}&cupoMaximo=${cupoMaximo}&precio=${precio}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	validarEvento(idCarrera, fecha, cupos, cupoMaximo, precio, allEventos) {
		const resultValidaciones = {
			status: true,
		};

		if (parseInt(cupos) > parseInt(cupoMaximo)) {
			resultValidaciones.status = false;
			resultValidaciones.errorMessage = 'Cupos no puede ser mayor a cupo máximo';
		}
		if (parseInt(precio) === '0') {
			resultValidaciones.status = false;
			resultValidaciones.errorMessage = 'Debe configurar un precio mayor a 0';
		}
		if (idCarrera !== 'skip') {
			allEventos.forEach((evento) => {
				console.log(`Actual ${idCarrera} VS ${evento.idCarrera}`);
				if (idCarrera === evento.idCarrera) {
					resultValidaciones.status = false;
					resultValidaciones.errorMessage = 'No puede usar el ID Carrera de un evento que ya exista';
				}
			});
		}
		if (!fechaValida(fecha)) {
			resultValidaciones.status = false;
			resultValidaciones.errorMessage = 'La fecha tiene que sea en format yyyy-mm-dd, y no puede ser menor a la fecha actual';
		}

		return resultValidaciones;
	}
}

export default new EventosDataService();
