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

	async find(query, by = 'idEvento') {
		console.log(`Searching by: ${by} value: ${query}`);
		const result = await http.get(`eventos?${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	async createEvento({ idEvento, fecha, cupos, idClase, cupoMaximo, precio }, allEventos) {
		console.log('About to create evento: ', idEvento, fecha, cupos, idClase, cupoMaximo, precio);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idEvento, fecha, cupos, idClase, cupoMaximo, precio });
		if (!result.status) return result;
		result = this.validarEvento(idEvento, fecha, cupos, cupoMaximo, precio, allEventos);
		if (!result.status) return result;

		result = await http.post(
			`/createEvento?idEvento=${idEvento}&fecha=${fecha}&cupos=${cupos}&idClase=${idClase}&cupoMaximo=${cupoMaximo}&precio=${precio}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	async deleteEvento(id) {
		return await http.delete(`/deleteEvento?_id=${id}`);
	}

	async editEvento({ _id, idEvento, fecha, cupos, idClase, cupoMaximo, precio }, allEventos) {
		console.log('About to edit evento: ', _id, idEvento, fecha, cupos, idClase, cupoMaximo, precio);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idEvento, fecha, cupos, idClase, cupoMaximo, precio });
		if (!result.status) return result;
		result = this.validarEvento('skip', fecha, cupos, cupoMaximo, precio, allEventos);
		if (!result.status) return result;

		result = await http.put(
			`/editEvento?_id=${_id}&idEvento=${idEvento}&fecha=${fecha}&cupos=${cupos}&idClase=${idClase}&cupoMaximo=${cupoMaximo}&precio=${precio}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	validarEvento(idEvento, fecha, cupos, cupoMaximo, precio, allEventos) {
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
		if (idEvento !== 'skip') {
			allEventos.forEach((evento) => {
				console.log(`Actual ${idEvento} VS ${evento.idEvento}`);
				if (idEvento === evento.idEvento) {
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
