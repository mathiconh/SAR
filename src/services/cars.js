import http from '../http-common';
import Cookies from 'universal-cookie';
import { validatePayload } from '../utils/utils';

const cookies = new Cookies();

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

	async createCar({ idUsuarioDuenio, modelo, anio, patente = '', agregados = '', historia = '', tallerAsociado = '', idVt = '' }) {
		console.log('About to create car: ', patente, modelo, anio, agregados, historia, tallerAsociado, idUsuarioDuenio);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idUsuarioDuenio, modelo, anio });
		if (!result.status) return result;
		result = this.validarVehiculo(anio);
		if (!result.status) return result;

		result = await http.post(
			`/createCar?patente=${patente}&modelo=${modelo}&anio=${anio}&agregados=${agregados}&historia=${historia}&tallerAsociado=${tallerAsociado}&idUsuarioModif=${idUsuarioModif}&idVt=${idVt}&idUsuarioDuenio=${idUsuarioDuenio}`
		);
		console.log('Result: ', result);
		return result;
	}

	async deleteCar(id) {
		return await http.delete(`/deleteCar?_id=${id}`);
	}

	async editCar({ _id, idUsuarioDuenio, modelo, anio, patente = '', agregados = '', historia = '', tallerAsociado = '' }) {
		console.log('About to edit car: ', _id, patente, modelo, anio, agregados, historia, tallerAsociado, idUsuarioDuenio);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ idUsuarioDuenio, modelo, anio });
		if (!result.status) return result;
		result = this.validarVehiculo(anio);
		if (!result.status) return result;

		result = await http.put(
			`/editCar?_id=${_id}&patente=${patente}&modelo=${modelo}&anio=${anio}&agregados=${agregados}&historia=${historia}&tallerAsociado=${tallerAsociado}&idUsuarioDuenio=${idUsuarioDuenio}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	validarVehiculo(anio) {
		const resultValidaciones = {
			status: true,
		};

		const anioActual = new Date().getFullYear();
		if (anio === undefined || anio < 1900 || anio > anioActual) {
			resultValidaciones.status = false;
			resultValidaciones.errorMessage = 'El año no puede ser mayor al actual ni menor a 1900';
		}

		return resultValidaciones;
	}

	//-------------------------------------------------------------verificación técnica---------------------------------------------

	async findVt(query, by = '_id', page = 0) {
		console.log(`Searching by: ${by} value: ${query}`);
		const result = await http.get(`vt?page=${page}&${by}=${query}`);
		console.log('DB Result para vt: ', result);
		return result;
	}

	async editVt({ _id, mataFuego, traje, motor, electricidad, estado, idUsuarioDuenio, idAuto }) {
		console.log('About to edit car: ', _id, mataFuego, traje, motor, electricidad, estado, idUsuarioDuenio, idAuto);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ mataFuego, traje, motor, electricidad, estado });
		if (!result.status) return result;
		// Descomentar la linea de abajo para activar la llamada a la validacion de datos por campo
		// result = this.validarDatosVt(mataFuego, traje, motor, electricidad, estado);
		// if (!result.status) return result;

		result = await http.put(
			`/editVt?_id=${_id}&mataFuego=${mataFuego}&traje=${traje}&motor=${motor}&electricidad=${electricidad}&estado=${estado}&idUsuarioDuenio=${idUsuarioDuenio}&idAuto=${idAuto}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	async completarVt({ mataFuego, traje, motor, electricidad, estado, idUsuarioDuenio, idAuto }) {
		console.log('About to complete vt: ', mataFuego, traje, motor, electricidad, estado, idUsuarioDuenio, idAuto);
		let result;
		let idUsuarioModif = cookies.get('_id');

		result = validatePayload({ mataFuego, traje, motor, electricidad, estado });
		if (!result.status) return result;
		// Descomentar la linea de abajo para activar la llamada a la validacion de datos por campo
		// result = this.validarDatosVt(mataFuego, traje, motor, electricidad, estado);
		// if (!result.status) return result;

		result = await http.post(
			`/completeVt?mataFuego=${mataFuego}&traje=${traje}&motor=${motor}&electricidad=${electricidad}&estado=${estado}&idUsuarioDuenio=${idUsuarioDuenio}&idUsuarioModif=${idUsuarioModif}&idAuto=${idAuto}`
		);
		console.log('Result: ', result);
		return result;
	}

	// validarDatosVt(mataFuego, traje, motor, electricidad, estado){
	// Borrar la linea de abajo y completar la función
	validarDatosVt() {
		const resultValidaciones = {
			status: true,
		};

		// if (mataFuego) {

		// }
		// if (traje) {

		// }
		// if (motor) {

		// }
		// if (electricidad) {

		// }
		// if (estado) {

		// }

		return resultValidaciones;
	}
}

export default new CarsDataService();
