import http from '../http-common';
import Cookies from 'universal-cookie';
import bcrypt from 'bcryptjs';
const cookies = new Cookies();

class UsersDataService {
	getAll(page = 0) {
		return http.get(`users?page=${page}`);
	}

	get(id) {
		return http.get(`/users?_id=${id}`);
	}

	find(query, by = 'nombre', page = 0) {
		console.log(`Searching by ${by} and value ${query}`);
		const result = http.get(`users?page=${page}&${by}=${query}`);
		console.log('DB Result: ', result);
		return result;
	}

	async createUser({ nombre, apellido, direccion, correoE, dni, fechaNac, telefono, idRol, idSector, idSexo, idVehiculo, password }) {
		let result;
		result = this.validateUserPayload({ nombre, apellido, direccion, correoE, dni, fechaNac, telefono });
		if (!result.status) return result;

		const passwordHash = await bcrypt.hash(password, 8);

		result = await http.post(
			`/createUser?nombre=${nombre}&apellido=${apellido}&direccion=${direccion}&correoE=${correoE}&dni=${dni}&fechaNac=${fechaNac}&telefono=${telefono}&idRol=${idRol}&idSector=${idSector}&idSexo=${idSexo}&idVehiculo=${idVehiculo}&password=${passwordHash}`
		);
		console.log('Result: ', result);
		return result;
	}

	async deleteUser(_id) {
		return await http.delete(`/deleteUser?_id=${_id}`);
	}

	async editUser({ _id, nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic }) {
		console.log('About to edit car: ', nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic);
		let result = { status: false };
		let idUsuarioModif = cookies.get('_id');

		result = this.validateUserPayload({ nombre, apellido, direccion, correoE, dni, fechaNac, telefono, profilePic });
		if (!result.status) return result;

		result = await http.put(
			`/editUser?_id=${_id}&nombre=${nombre}&apellido=${apellido}&direccion=${direccion}&correoE=${correoE}&dni=${dni}&fechaNac=${fechaNac}&telefono=${telefono}&profilePic=${profilePic}&idUsuarioModif=${idUsuarioModif}`
		);
		console.log('Result: ', result);
		return result;
	}

	getIdRol() {
		return http.get(`/usersIdRoles`);
	}

	validateUserPayload(payload) {
		let validationResult = {
			status: true,
		};
		const errorProperties = [];

		Object.keys(payload).forEach((property) => {
			console.log(`Evaluating ${property} value ${payload[property]}`);

			if (payload[property] === undefined || !payload[property]) {
				errorProperties.push(property);
			}
		});

		if (errorProperties.length) {
			validationResult.status = false;
			validationResult.errorMessage =
				errorProperties.length > 1
					? `Las siguientes propiedades no pueden estar vacias: ${errorProperties}.`
					: `La siguiente propiedad no puede estar vacia: ${errorProperties}.`;

			console.log('', validationResult.errorMessage);
			return validationResult;
		}

		return validationResult;
	}
}

export default new UsersDataService();
