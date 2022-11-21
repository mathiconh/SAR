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
