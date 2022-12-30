/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import InscripcionDataService from '../services/inscripcion';
import CarsDataService from '../services/cars';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import QRcode from 'qrcode';
const cookies = new Cookies();
import '../styles/buttons.css';

const CarsList = () => {
	const defaultInsc = {
		idEvento: '',
		claseId: '',
		idUsuario: cookies.get('_id'),
		vehiculoSeleccionado: '',
		fechaSprint: '',
	};

	const [eventosDisponibles, setEventosDisponibles] = useState([]);
	const [clasesDisponibles, setClasesDisponibles] = useState(['Seleccionar Clase']);
	const [eventoSeleccionada, setEventoSeleccionada] = useState([]);
	const [autos, setAutos] = useState([]);
	const [inscripcion, setInscripcion] = useState(defaultInsc);
	const [inscribrOtroCompetidor, setInscribirOtroCompetidor] = useState(true);
	const [modalCodigoQR, setModalCodigoQR] = useState(false);
	const [modalErrorDatos, setModalErrorDatos] = useState(false);
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [qrcode, setQrCode] = useState('');

	useEffect(() => {
		retrieveEventos();
		getAutos();
		document.getElementById('buscarVehiculsButton').disabled = true;
	}, []);

	const onChangesetSelectedClass = (e) => {
		const clase = e.target.value;
		console.log('Eventos Disponibles: ', eventosDisponibles);

		const eventoData = eventosDisponibles.find((evento) => evento.carreraNombreClase === clase);
		console.log('Evento Seleccionada: ', eventoData);
		const fechaSprint = eventoData.fecha.split('T')[0];

		if (eventoData) {
			setEventoSeleccionada(eventoData);
			setInscripcion((prevState) => ({
				...prevState,
				idEvento: eventoData.idEvento,
				claseId: eventoData.idEventoClase,
				fechaSprint: fechaSprint,
			}));
		}
		document.getElementById('tiempoClaseData').value = eventoData.tiempoClase;
	};

	function onChangeValueCompetidor() {
		setInscribirOtroCompetidor((prevState) => !prevState);
		document.getElementById('otroCompetidorData').setAttribute('required', inscribrOtroCompetidor);
		if (inscribrOtroCompetidor) {
			vaciarVehiculoSeleccionado();
			setAutos([]);
			alert('Necesita seleccionar el botón "Buscar Vehículos" para seleccionar un vehículo antes de finalizar la inscripción');
			document.getElementById('buscarVehiculsButton').setAttribute('class', 'btn btn-dark mx-2 my-2');
			document.getElementById('buscarVehiculsButton').disabled = false;
		} else {
			vaciarVehiculoSeleccionado();
			document.getElementById('buscarVehiculsButton').disabled = true;
			document.getElementById('buscarVehiculsButton').setAttribute('class', 'btn btn-dark mx-2 my-2');
			getAutos();
		}
	}

	function vaciarVehiculoSeleccionado() {
		setInscripcion((prevState) => ({
			...prevState,
			vehiculoSeleccionado: '',
		}));
		document.getElementById('carData').value = '';
		document.getElementById('otroCompetidorData').value = '';
	}

	const getAutos = async () => {
		const _id = cookies.get('_id');

		await CarsDataService.find(_id, 'idUsuarioDuenio')
			.then((response) => {
				console.log('autos tiene', response.data.cars);
				if (!response.data.cars.length) {
					alert('Debe tener al menos un auto cargado en el sistema para poder inscribirse');
				}
				setAutos(response.data.cars);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const selectCar = (car = {}) => {
		console.log('Selected: ', car);
		setInscripcion((prevState) => ({
			...prevState,
			vehiculoSeleccionado: car._id,
		}));
		const carData = `${car.modelo} - ${car.patente} - ${car.anio}`;
		document.getElementById('carData').value = carData;
	};

	const retrieveEventos = async () => {
		const response = await InscripcionDataService.getAvailable();

		console.log('Data: ', response.data.eventosDisponibles);
		const clasesDisponiblesList = response.data.eventosDisponibles.map((evento) => {
			return evento.carreraNombreClase;
		});
		setEventosDisponibles(response.data.eventosDisponibles);

		ordenarClases(clasesDisponiblesList);
		console.log('Clases Detectadas: ', clasesDisponiblesList);

		setClasesDisponibles(['Seleccionar Clase'].concat(clasesDisponiblesList));
	};

	function ordenarClases(clasesDisponiblesList) {
		clasesDisponiblesList.sort((claseA, claseB) => {
			const nameA = claseA.toUpperCase(); // Para ignorar mayusculas y minusculas en la comparacion
			const nameB = claseB.toUpperCase();
			if (nameA < nameB) return -1;
			if (nameA > nameB) return 1;

			// Nombres iguales
			return 0;
		});
	}

	async function buscarVehiculosCompetidor() {
		if (!inscribrOtroCompetidor) {
			const competidorId = document.getElementById('otroCompetidorData').value;
			if (competidorId) {
				console.log('Buscando autos para el competidor: ', competidorId);
				await CarsDataService.find(competidorId, 'idUsuarioDuenio')
					.then((response) => {
						console.log('autos tiene', response.data.cars);
						if (!response.data.cars.length) {
							alert('Debe ingresar el ID de un usuario registrádo el cual debe tener al menos un auto cargado en el sistema para poder inscribírse');
						}
						setAutos(response.data.cars);
					})
					.catch((e) => {
						console.log(e);
					});
			} else {
				alert('Por favor ingrese el Id de un usuario existente y vuelva a buscar sus vehículos');
			}
		}
	}

	function cambiarIdUsuarioInscripcion(userId) {
		const newInscripcion = inscripcion;
		newInscripcion.idUsuario = userId;
		setInscripcion(newInscripcion);
	}

	// Generador de codigo QR
	function generateQrCode() {
		// console.log('Datos de Inscripcion: ', inscripcion);
		const message = `Usuario ID: ${inscripcion.idUsuario} inscripto en el Evento ID: ${inscripcion.idEvento} Clase ID: ${inscripcion.claseId}`;
		QRcode.toDataURL(message, (err, message) => {
			if (err) return console.error(err);

			console.log(message);
			setQrCode(message);
		});
	}

	async function enviarInscripcion() {
		// False implica usar ID del OTRO competidor y no del user logeado
		if (!inscribrOtroCompetidor) {
			const competidorId = document.getElementById('otroCompetidorData').value;
			cambiarIdUsuarioInscripcion(competidorId);
		} else if (inscripcion.idUsuario !== cookies.get('_id')) {
			cambiarIdUsuarioInscripcion(cookies.get('_id'));
		}

		const result = await InscripcionDataService.createInscripcion(inscripcion);
		if (result.status) {
			console.log('Inscripcion exitosa');
			setInscripcion(defaultInsc);
			generateQrCode();
			setModalCodigoQR(true);
		} else {
			setModalErrorDatos(true);
			setValidationErrorMessage(result?.errorMessage);
		}
	}

	const closeModalCodigoQR = () => {
		setModalCodigoQR(false);
		window.location.reload(false);
	};

	const closeModalErrorDatos = () => {
		setModalErrorDatos(false);
		setValidationErrorMessage('');
	};

	const buildErrorMessage = () => {
		if (validationErrorMessage !== '') {
			return (
				<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
					{validationErrorMessage}
				</Alert>
			);
		}
		return;
	};

	// Funcion de custom validation basada en la documentacion de Bootstrap
	(function () {
		'use strict';
		// Obtiene todos los formularios a los que queremos aplicarles la validacion custom
		var forms = document.querySelectorAll('.needs-validation');

		// Loopeamos a traves de los campos a ser validados y los marcamos segun apliquen
		Array.prototype.slice.call(forms).forEach(function (form) {
			form.addEventListener(
				'submit',
				function (event) {
					if (!form.checkValidity()) {
						event.preventDefault();
						event.stopPropagation();
					}

					form.classList.add('was-validated');
				},
				false
			);
		});
	})();

	function formPreventDefault(e) {
		alert('Inscripción enviada');
		e.preventDefault();
	}

	if (cookies.get('_id')) {
		return (
			<div className="App">
				<div className="container-fluid">
					<div className="d-flex vh-85 p-2 justify-content-center align-self-center">
						<div className="container-lg align-self-center col card sombraCard form-signin">
							<form className="container-fluid align-self-center needs-validation" onSubmit={formPreventDefault} noValidate>
								<p className="h1 text-center">Inscripcion a Evento</p>
								<br></br>
								<div className="form-row">
									<div className="form-group align-items-stretch">
										<div className="row justify-content-center">
											<label className="label-class w-auto" htmlFor="exampleInputEmail1">
												Clases disponibles para este viernes
											</label>
											<select className="form-select w-25" name="idEvento" id="idEventoField" onChange={onChangesetSelectedClass}>
												{clasesDisponibles.map((param) => {
													return (
														<option key={param} value={param}>
															{' '}
															{param}{' '}
														</option>
													);
												})}
											</select>
											<br></br>
											<label className="label-class" htmlFor="cuposClase">
												{eventoSeleccionada.aproxCupos}
											</label>
										</div>
										<br></br>
										<label className="label-class" htmlFor="tiempoClase">
											{' '}
											Tiempo de la clase seleccionada:{' '}
										</label>
										<input type="text" id="tiempoClaseData" name="tiempoDataInput" className="col-md-1" data-readonly required />
										<div className="invalid-feedback">Por favor seleccione una clase de la lista.</div>
									</div>
									<hr className="rounded"></hr>
									<div className="form-group form-check">
										<label className="font-weight-bold" htmlFor="inscripcionOtroCompetidorLabel">
											{' '}
											Deseo inscribir a otro competidor:{' '}
										</label>
										<br></br>
										<div onChange={onChangeValueCompetidor}>
											<input className="radio-class-competidor" type="radio" value="false" name="inscribirOtroCompetidor" defaultChecked /> No
											<br></br>
											<input className="radio-class-competidor" type="radio" value="true" name="inscribirOtroCompetidor" /> Si
										</div>
									</div>
									<div className="form-group align-items-center form-check">
										<div className="form-group align-items-center">
											<label className="label-class" htmlFor="idCompetidor">
												{' '}
												ID del competidor:{' '}
											</label>
											<input type="text" id="otroCompetidorData" name="otroCompetidorDataInput" className="mt-1" readOnly={inscribrOtroCompetidor} />
											<div className="invalid-feedback">Por favor ingrese el ID de un competidor.</div>
											<button className="btn btn-dark mx-2" id="buscarVehiculsButton" type="button" onClick={buscarVehiculosCompetidor}>
												Buscar Vehiculos
											</button>
										</div>
									</div>
									<hr className="rounded"></hr>
									<div>
										<div className="container">
											<div className="table-responsive-sm">
												<div className="table-wrapper">
													<div className="table-title">
														<div className="row">
															<div className="col align-items-center">
																<h2>Selecciona el auto con el que vas a correr</h2>
															</div>
														</div>
													</div>
													<table className="table table-striped align-items-center table-hover">
														<thead>
															<tr>
																<th>Patente</th>
																<th>Marca & Modelo</th>
																<th>Año</th>
																<th>Taller Mecánico</th>
																<th>Acciones</th>
															</tr>
														</thead>
														<tbody>
															{autos.map((selectedCar) => {
																const patente = `${selectedCar.patente}`;
																const modelo = `${selectedCar.modelo}`;
																const anio = `${selectedCar.anio}`;
																const tallerAsociado = `${selectedCar.tallerAsociado}`;
																return (
																	<tr>
																		<td>{patente}</td>
																		<td>{modelo}</td>
																		<td>{anio}</td>
																		<td>{tallerAsociado}</td>
																		<td>
																			<button className="btn btn-warning" type="button" onClick={() => selectCar(selectedCar)}>
																				Seleccionar
																			</button>
																		</td>
																	</tr>
																);
															})}
														</tbody>
													</table>
												</div>
											</div>
										</div>
										<br></br>
										<div className="form-group">
											<label className="label-class" htmlFor="tiempoClase">
												{' '}
												Vehiculo Seleccionado:{' '}
											</label>
											<input type="text" id="carData" name="carDataInput" className="col-md-6" data-readonly required />
											<div className="invalid-feedback">Por favor seleccione uno de sus vehículos en la tabla.</div>
										</div>
									</div>
									<hr className="rounded"></hr>
									<div className="form-group align-items-center form-check">
										<label className="font-weight-bold" htmlFor="tiempoClase">
											{' '}
											Precio de la inscripción: ${eventoSeleccionada.precio}
										</label>
										<br></br>
									</div>
									<hr className="rounded"></hr>
									<button className="btn btn-primary col-md-3" onClick={enviarInscripcion}>
										Inscribirse
									</button>
								</div>
							</form>
						</div>
						<Modal isOpen={modalCodigoQR}>
							<ModalBody>
								<p className="h1 text-center">Gracias por inscribirse</p>
								<label>Con el siguiente código QR, usted podra ingresár al predio por la entrada preferencial y abonar en efectivo:</label>
								{qrcode && (
									<>
										<img src={qrcode} />
										<a className="btn btn-warning" href={qrcode} download="qrcode.png">
											Descargar
										</a>
									</>
								)}
							</ModalBody>
							<ModalFooter>
								<button className="btn btn-danger" onClick={() => closeModalCodigoQR()}>
									Cerrar
								</button>
							</ModalFooter>
						</Modal>

						<Modal isOpen={modalErrorDatos}>
							<ModalBody>
								<p className="h1 text-center">Hay un error en los datos ingresados</p>
								<label>Por favor corregir el error para continuar:</label>
								{buildErrorMessage()}
							</ModalBody>
							<ModalFooter>
								<button className="btn btn-secondary" onClick={() => closeModalErrorDatos()}>
									Cerrar
								</button>
							</ModalFooter>
						</Modal>
					</div>
				</div>
			</div>
		);
	} else {
		window.location.href = './errorPage';
		console.log('Necesita iniciar sesión y tener los permisos suficientes para poder acceder a esta pantalla');
		<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
			Necesita iniciar sesión y tener los permisos suficientes para poder acceder a esta pantalla
		</Alert>;
	}
};

export default CarsList;
