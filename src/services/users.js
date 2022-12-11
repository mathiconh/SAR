import http from '../http-common';
import Cookies from 'universal-cookie';
import bcrypt from 'bcryptjs';
import { validatePayload, fechaValida } from '../utils/utils';

const cookies = new Cookies();

class UsersDataService {
	getAll(page = 0) {
		return http.get(`users?page=${page}`);
	}

	getAllGen(page = 0) {
		return http.get(`/generos?page=${page}`);
	}

	get(id) {
		return http.get(`/users?_id=${id}`);
	}

	async find(query, by = 'nombre', page = 0) {
		console.log(`Searching by ${by} and value ${query}`);
		const result = await http.get(`users?page=${page}&${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	findCar(query, by = 'idUsuarioDuenio', page = 0) {
		console.log(`Searching by ${by} and value ${query}`);
		const result = http.get(`cars?page=${page}&${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	async createUser({ nombre, apellido, direccion, correoE, dni, fechaNac, telefono, idRol, idGenero, password }) {
		let result;
		result = validatePayload({ nombre, apellido, direccion, correoE, dni, fechaNac, telefono, idRol, idGenero, password });
		if (!result.status) return result;
		result = this.validateData(fechaNac, idRol);
		if (!result.status) return result;

		const passwordHash = await bcrypt.hash(password, 8);

		result = await http.post(
			`/createUser?nombre=${nombre}&apellido=${apellido}&direccion=${direccion}&correoE=${correoE}&dni=${dni}&fechaNac=${fechaNac}&telefono=${telefono}&idRol=${idRol}&idGenero=${idGenero}&password=${passwordHash}`
		);
		console.log('Result: ', result);
		return result;
	}

	async deleteUser(_id) {
		return await http.delete(`/deleteUser?_id=${_id}`);
	}

	async editUser({ _id, nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic, idRol }) {
		console.log('About to edit car: ', nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic, idRol);
		let idUsuarioModif = cookies.get('_id');
		let result;
		result = validatePayload({ _id, nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic, idRol });
		if (!result.status) return result;
		result = this.validateData(fechaNac, idRol);
		if (!result.status) return result;

		result = await http.put(
			`/editUser?_id=${_id}&nombre=${nombre}&apellido=${apellido}&direccion=${direccion}&correoE=${correoE}&dni=${dni}&fechaNac=${fechaNac}&telefono=${telefono}&profilePic=${profilePic}&idRol=${idRol}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	validateData(fechaNac, idRol) {
		const resultValidaciones = {
			status: true,
		};
		const fechaArray = fechaNac.split('-');
		const newFechaNac = fechaArray[2] + '-' + fechaArray[1] + '-' + fechaArray[0];

		if (!fechaValida(newFechaNac)) {
			if (this.calcularEdad(fechaNac) < 18) {
				resultValidaciones.status = false;
				resultValidaciones.errorMessage = 'La fecha debe ser valida y debe ser mayor de 18 años';
			}
		}

		if (idRol !== '1' && idRol !== '2') {
			resultValidaciones.status = false;
			resultValidaciones.errorMessage = 'El ID del rol debe ser 1 o 2';
		}

		return resultValidaciones;
	}

	calcularEdad(fechaNac) {
		var hoy = new Date();
		var fechaDeNacimiento = new Date(fechaNac);
		var edad = hoy.getFullYear() - fechaDeNacimiento.getFullYear();
		var mes = hoy.getMonth() - fechaDeNacimiento.getMonth();
		console.log(`Hoy ${hoy} | Nac ${fechaDeNacimiento} | Edad ${edad} | Mes ${mes}`);
		if (mes < 0 || (mes === 0 && hoy.getDate() < fechaDeNacimiento.getDate())) {
			edad--;
		}
		console.log('Edad es: ', edad);
		return edad;
	}

	getIdRol() {
		return http.get(`/usersIdRoles`);
	}
}

export default new UsersDataService();
