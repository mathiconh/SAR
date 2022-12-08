export function validatePayload(payload) {
	let validationResult = {
		status: true,
	};
	const errorProperties = [];

	Object.keys(payload).forEach((property) => {
		console.log(`Evaluating ${property} value ${payload[property]}`);

		if (payload[property] === undefined || !payload[property] || Object.keys(payload[property]).length === 0) {
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

export function validateUserDate(fechaNac) {
	const result = {
		status: true,
	};

	const anioActual = new Date().getFullYear();
	if (fechaNac < 1700 || fechaNac > anioActual) {
		result.status = false;
		result.errorMessage = 'La fecha de nacimiento no puede ser mayor al actual ni menor a 1700';
	}

	return result;
}
// Valida que la fecha ingresada como string sea una fecha válida formateada como "yyyy/mm/dd"
export function fechaValida(dateString) {
	// Primero verifica el patrón
	if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) return false;

	// Parseamos la fecha en partes enteras
	var parts = dateString.split('-');
	var day = parseInt(parts[2], 10);
	var month = parseInt(parts[1], 10);
	var year = parseInt(parts[0], 10);

	// Chequeamos que el mes y el año estén dentro de los rangos
	if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

	var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// Ajuste para años bisiestos
	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29;

	// Chequea que el día esté dentro del rango del mes
	return day > 0 && day <= monthLength[month - 1];
}
