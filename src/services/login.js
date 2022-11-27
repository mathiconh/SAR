import http from '../http-common';
import bcrypt from 'bcryptjs';

export const matchPassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};
class LoginDataService {
	async get(correoE, password) {
		const result = await http.get(`/login?correoE=${correoE}`);
		console.log('DB Result: ', result);
		const hash = result.data.responseData.password;
		const match = await matchPassword(password, hash);
		if (match === true) {
			return result;
		} else {
			result.data.status = false;
			result.data.errorMessage = 'El usuario y/o contraseña son incorrectos';
			return result;
		}
	}
}

export default new LoginDataService();
