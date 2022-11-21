import axios from 'axios';

export default axios.create({
	baseURL: 'https://data.mongodb-api.com/app/sarapi-zfogf/endpoint/',
	headers: {
		'Content-type': 'application/json',
	},
});
