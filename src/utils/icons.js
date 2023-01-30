const Icons = (icon) => {
	switch (icon) {
		case 'Thunderstorm':
			icon = 'icons/thunderstorms-rain.svg';
			console.log('TORMENTA');
			break;
		case 'Drizzle':
			icon = '../assets/icons/drizzle.svg';
			console.log('LLOVIZNA');
			break;
		case 'Rain':
			icon = '../assets/icons/rain.svg';
			console.log('LLUVIA');
			break;
		case 'Snow':
			icon = '../assets/icons/snowy.svg';
			console.log('NIEVE');
			break;
		case 'Clear':
			icon = '../assets/icons/clear-day.svg';
			console.log('LIMPIO');
			break;
		case 'Atmosphere':
			icon = '../assets/icons/weather.svg';
			console.log('ATMOSFERA');
			break;
		case 'Clouds':
			icon = '../assets/icons/fog.svg';
			console.log('NUBES');
			break;
		case 'Fog':
			icon = '../assets/icons/fog.svg';
			console.log('NUBES');
			break;
		case 'Haze':
			icon = '../assets/icons/haze.svg';
			console.log('BRUMAS');
			break;
		case 'Smoke':
			icon = '../assets/icons/smoke.svg';
			console.log('HUMO');
			break;
		default:
			icon = '../assets/icons/clear-day.svg';
			console.log('LIMPIO');
	}
	return icon;
};

export default Icons;
