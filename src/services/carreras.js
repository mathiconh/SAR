import http from '../http-common';

class CarrerasDataService {
	async findCarreras(query, page = 0) {
		console.log(`Searching value: ${query}`);
		const result = await http.get(`sprints?page=${page}&perfil=${query}`);
		return result;
	}
}

export default new CarrerasDataService();
