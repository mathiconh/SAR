import http from '../http-common';

class LoginDataService {
	async get(correoE, password) {
		const result = await http.get(`/login?correoE=${correoE}&password=${password}`);
		console.log('DB Result: ', result);
		return result;
	}
}

export default new LoginDataService();
