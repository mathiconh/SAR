/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import InscripcionDataService from '../services/inscripcion';
import UserDataService from '../services/users';
import CarsDataService from '../services/cars';
import EventosDataService from '../services/eventos';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import QRcode from 'qrcode';

const InscripcionesList = () => {
	const [inscripciones, setinscripciones] = useState([]);
	const [users, setUsers] = useState([]);
	const [cars, setCars] = useState([]);
	const [eventos, setEventos] = useState([]);
	const [eventoIdDefault, setEventoIdDefault] = useState([]);
	const [ClaseIdDefault, setClaseIdDefault] = useState([]);
	const [fechaSprintDefault, setFechaSprintDefault] = useState([]);
	const [searchName, setSearchName] = useState('');
	const [entriesPerPage, setEntriesPerPage] = useState([]);
	const [totalResults, setTotalResults] = useState([]);
	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedInscripcion, setSelectedInscripcion] = useState({
		_id: '',
		idEvento: '',
		claseId: '',
		idUsuario: '',
		vehiculoId: '',
		fechaSprint: '',
		matcheado: 'no',
		ingreso: 'no',
	});
	const [searchableParams] = useState(Object.keys(selectedInscripcion));
	const [qrcode, setQrCode] = useState('');
	const [modalCodigoQR, setModalCodigoQR] = useState(false);
	const [modalEditar, setModalEditar] = useState(false);
	const [modalEliminar, setModalElminar] = useState(false);

	useEffect(() => {
		retrieveInscripciones();
		retrieveEventos();
	}, []);

	const onChangeSearchParam = (e) => {
		const searchParam = e.target.value;
		setSearchParam(searchParam);
	};

	const onChangeSearchValue = (e) => {
		const searchValue = e.target.value;
		setSearchValue(searchValue);
	};

	const onChangeSearchName = (e) => {
		const searchName = e.target.value;
		setSearchName(searchName);
	};

	const selectInscripcion = (action, inscripcion = { idEvento: eventoIdDefault, claseId: ClaseIdDefault, fechaSprint: fechaSprintDefault }) => {
		console.log('Selected: ', inscripcion);
		setSelectedInscripcion(inscripcion);
		action === 'Editar' ? setModalEditar(true) : setModalElminar(true);
	};

	const findByParam = () => {
		find(searchValue, searchParam);
	};

	const findByParamRegularUser = () => {
		findRegularUser(searchValue, searchParam);
	};

	const findByName = () => {
		findUser(searchName, 'nombre');
	};

	const retrieveEventos = async () => {
		await EventosDataService.getAll()
			.then((response) => {
				console.log('Data Eventos: ', response.data);
				setEventos(response.data.eventos);
				if (response.data.eventos.length) {
					console.log('Se cambio el ID Evento a: ', response.data.eventos[0].idEvento);
				}
				setEventoIdDefault(response.data.eventos[0].idEvento);
				setClaseIdDefault(response.data.eventos[0].idClase);
				const fecha = response.data.eventos[0].fecha.split('T')[0];
				setFechaSprintDefault(fecha);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveCars = async (userId) => {
		console.log('userId tiene: ', userId);
		await CarsDataService.find(userId, 'idUsuarioDuenio')
			.then((response) => {
				console.log('Autos tiene', response.data.cars);
				setCars(response.data.cars);
				if (response.data.cars.length) {
					// console.log('Se cambio el ID Vehiculo P1 a: ', response.data.cars[0]._id);
					setSelectedInscripcion((prevState) => ({
						...prevState,
						vehiculoId: response.data.cars[0]._id,
					}));
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const findUser = async (query, by) => {
		await UserDataService.find(query, by)
			.then(async (response) => {
				console.log(response.data);
				const usersList = response.data.users.sort((a, b) => a.apellido.localeCompare(b.apellido));
				setUsers(usersList);
				await retrieveCars(response.data.users[0]._id);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveInscripciones = async () => {
		if (cookies.get('idRol') === '1') {
			await InscripcionDataService.getAll()
				.then((response) => {
					console.log('Data: ', response.data);
					const inscripcionesOrdenadas = response.data.inscripciones.slice().sort((a, b) => new Date(b.fechaSprint) - new Date(a.fechaSprint));
					setinscripciones(inscripcionesOrdenadas);
					setTotalResults(response.data.total_results);
					setEntriesPerPage(response.data.inscripciones.length);
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			retrieveInscripcionesUsuarioLogeado();
		}
	};

	const retrieveInscripcionesUsuarioLogeado = async () => {
		await InscripcionDataService.get(cookies.get('_id'), 'idUsuario')
			.then((response) => {
				console.log('Data: ', response.data);
				const inscripcionesOrdenadas = response.data.inscripciones.slice().sort((a, b) => new Date(b.fechaSprint) - new Date(a.fechaSprint));
				setinscripciones(inscripcionesOrdenadas);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.inscripciones.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const deleteInscripcion = async (claseId) => {
		console.log('Inscripciones to be deleted', claseId);
		await InscripcionDataService.deleteInscripcion(claseId)
			.then(() => {
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const refreshList = () => {
		retrieveInscripciones();
	};

	const find = async (query, by) => {
		await InscripcionDataService.get(query, by)
			.then((response) => {
				console.log('Data: ', response.data);
				if (!response.data.inscripciones.length) {
					alert(`No se encontraron datos para la busqueda de ${by} con valor ${query}`);
				}
				const inscripcionesOrdenadas = response.data.inscripciones.slice().sort((a, b) => new Date(b.fechaSprint) - new Date(a.fechaSprint));
				setinscripciones(inscripcionesOrdenadas);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.inscripciones.length);
			})
			.catch((e) => {
				console.log(e);
				alert(`No se pudo realizar la busqueda de datos para ${by} con valor ${query}`);
			});
	};

	const findRegularUser = async (query, by) => {
		console.log(`Query: ${query} | By: ${by}`);
		if (by !== 'idUsuario' || (by === 'idUsuario' && (query === cookies.get('_id') || query === ''))) {
			await InscripcionDataService.getRegularUser(query, by, cookies.get('_id'))
				.then((response) => {
					console.log('Data: ', response.data);
					if (!response.data.inscripciones.length) {
						alert(`No se encontraron datos para la busqueda de ${by} con valor ${query}`);
					}
					const inscripcionesOrdenadas = response.data.inscripciones.slice().sort((a, b) => new Date(b.fechaSprint) - new Date(a.fechaSprint));
					setinscripciones(inscripcionesOrdenadas);
					setTotalResults(response.data.total_results);
					setEntriesPerPage(response.data.inscripciones.length);
				})
				.catch((e) => {
					console.log(e);
					alert(`No se pudo realizar la busqueda de datos para ${by} con valor ${query}`);
				});
		} else {
			setinscripciones([]);
		}
	};

	let setModalButton = (selectedInscripcion) => {
		if (selectedInscripcion._id) {
			return (
				<button className="btn btn-success" onClick={() => editar(selectedInscripcion)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-success" onClick={() => crear(selectedInscripcion)}>
					Crear
				</button>
			);
		}
	};

	const closeModal = () => {
		setModalEditar(false);
		setValidationErrorMessage('');
	};

	const eliminar = (inscripcionId) => {
		deleteInscripcion(inscripcionId);
		setModalElminar(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSelectedInscripcion((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleChangeUser = async (e) => {
		const { name, value } = e.target;
		setSelectedInscripcion((prevState) => ({
			...prevState,
			[name]: value,
		}));
		await retrieveCars(value);
	};

	const handleChangeEvento = (e) => {
		const { name, value } = e.target;
		// console.log('Evento', value);

		const evento = eventos.find((evento) => evento.idEvento === value);
		// console.log('Fecha', name);
		const fecha = evento.fecha.split('T')[0];
		setSelectedInscripcion((prevState) => ({
			...prevState,
			[name]: evento.idEvento,
			claseId: evento.idClase,
			fechaSprint: fecha,
		}));
	};

	// Generador de codigo QR
	function generateQrCode(inscripcion) {
		// console.log('Datos de Inscripcion: ', inscripcion);
		const message = `Usuario ID: ${inscripcion.idUsuario} inscripto en el Evento ID: ${inscripcion.idEvento} Clase ID: ${inscripcion.claseId}`;
		QRcode.toDataURL(message, (err, message) => {
			if (err) return console.error(err);

			console.log(message);
			setQrCode(message);
		});
	}

	const verQr = (inscripcion) => {
		setModalCodigoQR(true);
		generateQrCode(inscripcion);
	};

	const closeModalCodigoQR = () => {
		setModalCodigoQR(false);
	};

	const editar = async (selectedInscripcion) => {
		inscripciones.forEach((inscripcion) => {
			if (inscripcion._id === selectedInscripcion._id) {
				inscripcion.idEvento = selectedInscripcion.idEvento;
				inscripcion.claseId = selectedInscripcion.claseId;
				inscripcion.idUsuario = selectedInscripcion.idUsuario;
				inscripcion.vehiculoId = selectedInscripcion.vehiculoId;
				inscripcion.fechaSprint = selectedInscripcion.fechaSprint;
				inscripcion.matcheado = selectedInscripcion.matcheado;
				inscripcion.ingreso = selectedInscripcion.ingreso;
			}
		});
		const result = await InscripcionDataService.editInscripcion(selectedInscripcion);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setinscripciones(inscripciones);
			setModalEditar(false);
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const crear = async (selectedInscripcion) => {
		const result = await InscripcionDataService.createInscripcionABM(selectedInscripcion);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			retrieveInscripciones();
			setModalEditar(false);
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
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

	if (cookies.get('_id') && cookies.get('idRol') === '1') {
		return (
			<div className="App">
				<div className="container-fluid">
					<div className="d-flex vh-85 p-2 justify-content-center align-self-center">
						<div className="container-fluid align-self-center col card sombraCard form-abm">
							<div className="table">
								<div className="table-wrapper">
									<div className="table-title">
										<div className="row">
											<div className="col-sm-6 w-auto">
												<h2>
													Administrar <b>Inscripciones</b>
												</h2>
											</div>
											<div className="input-group col-sm-6">
												<input
													type="text"
													className="form-control w-auto"
													placeholder="Buscar inscripcion por "
													value={searchValue}
													onChange={onChangeSearchValue}
												/>
												<select onChange={onChangeSearchParam}>
													{searchableParams.map((param) => {
														return <option value={param}> {param.replace('_', '')} </option>;
													})}
												</select>
												<div className="input-group-append">
													<button className="btn btn-secondary mx-2 mt-1" type="button" onClick={findByParam}>
														Buscar
													</button>
												</div>
											</div>
											<br></br>
											<div className="d-flex mt-2">
												<div>
													<button className="btn btn-success mr-1" onClick={() => selectInscripcion('Editar')}>
														Añadir una nueva Inscripción
													</button>
													<button className="btn btn-success mx-1" onClick={() => retrieveInscripcionesUsuarioLogeado()}>
														Buscar Mis Inscripciones
													</button>
												</div>
											</div>
										</div>
										<hr className="rounded"></hr>
									</div>
									<div className="overflowAuto">
										<div className="container-fluid divTableInscripcionesAdmin">
											<table className="table table-responsive table-striped w-auto table-hover tableData">
												<thead>
													<tr>
														<th className="thData fixedColHead">Acciones</th>
														<th className="thData">ID</th>
														<th className="thData">ID Usuario</th>
														<th className="thData">Fecha</th>
														<th className="thData">Matcheado con otro competidor</th>
														<th className="thData">Ingresó</th>
														<th className="thData">ID Evento</th>
														<th className="thData">ID Clase</th>
														<th className="thData">ID Vehículo</th>
														<th className="thData">Precio</th>
													</tr>
												</thead>
												<tbody>
													{inscripciones.map((inscripcion) => {
														const id = `${inscripcion._id}`;
														const idEvento = `${inscripcion.idEvento}`;
														const claseId = `${inscripcion.claseId}`;
														const idUsuario = `${inscripcion.idUsuario}`;
														const vehiculoId = `${inscripcion.vehiculoId}`;
														const precio = `${inscripcion.precio}`;
														const fechaSprint = `${inscripcion.fechaSprint}`;
														const matcheado = `${inscripcion.matcheado}`;
														const ingreso = `${inscripcion.ingreso}`;
														return (
															<tr>
																<td className="tdDataButtons fixedColRow">
																	<button className="btn btn-secondary mx-1" onClick={() => verQr(inscripcion)}>
																		Ver QR
																	</button>
																	<button className="btn btn-warning mx-1" onClick={() => selectInscripcion('Editar', inscripcion)}>
																		Editar
																	</button>
																	<button className="btn btn-danger mx-1" onClick={() => selectInscripcion('Eliminar', inscripcion)}>
																		Borrar
																	</button>
																</td>
																<td className="tdData">{id}</td>
																<td className="tdData">{idUsuario}</td>
																<td className="tdData">{fechaSprint}</td>
																<td className="tdData">{matcheado}</td>
																<td className="tdData">{ingreso}</td>
																<td className="tdData">{idEvento}</td>
																<td className="tdData">{claseId}</td>
																<td className="tdData">{vehiculoId}</td>
																<td className="tdData">{precio}</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>
									<div className="clearfix">
										<div className="hint-text">
											Mostrando <b>{`${entriesPerPage}`}</b> de <b>{`${totalResults}`}</b> registros
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal isOpen={modalEliminar}>
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedInscripcion._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-success" onClick={() => eliminar(selectedInscripcion._id)}>
							Sí
						</button>
						<button className="btn btn-danger" onClick={() => setModalElminar(false)}>
							No
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEditar}>
					<ModalBody>
						<label>ID</label>
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedInscripcion._id} placeholder="Auto-Incremental ID" />
						<label>ID Evento</label>
						<select
							className="form-select"
							name="idEvento"
							id="idEventoField"
							onChange={handleChangeEvento}
							value={selectedInscripcion.idEvento}
							aria-label="Default select example"
						>
							{eventos.map((evento) => {
								const id = `${evento.idEvento}`;
								return <option value={id}>Carrera {id}</option>;
							})}
						</select>
						<label>ID Clase</label>
						<input
							className="form-control"
							type="text"
							maxLength="100"
							name="claseId"
							id="claseIdField"
							onChange={handleChange}
							value={selectedInscripcion.claseId}
							readOnly
						/>
						<label>Buscador de Usuarios</label>
						<div className="input-group mb-3 col-sm-12">
							<input type="text" className="form-control" placeholder="Buscar por nombre" value={searchName} onChange={onChangeSearchName} />
							<div className="input-group-append">
								<div>
									<button className="btn btn-secondary mx-1" type="button" onClick={findByName}>
										Buscar
									</button>
								</div>
							</div>
						</div>
						<label>ID Usuario</label>
						<select
							className="form-select"
							name="idUsuario"
							id="idUsuarioField"
							onChange={handleChangeUser}
							value={selectedInscripcion.idUsuario}
							aria-label="Default select example"
						>
							{users.map((user) => {
								const id = `${user._id}`;
								const nombre = `${user.nombre}`;
								const apellido = `${user.apellido}`;
								return <option value={id}>{`${nombre} ${apellido} | ID: ${id}`}</option>;
							})}
						</select>
						<label>ID Vehículo</label>
						<select
							className="form-select"
							name="vehiculoId"
							id="vehiculoIdField"
							onChange={handleChange}
							value={selectedInscripcion.vehiculoId}
							aria-label="Default select example"
						>
							{cars.map((car) => {
								const id = `${car._id}`;
								const modelo = `${car.modelo}`;
								const patente = `${car.patente}`;
								const anio = `${car.anio}`;
								return <option value={id}>{`${anio} - ${modelo} ${patente} | ID: ${id}`}</option>;
							})}
						</select>
						<label>Fecha</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="fechaSprint"
							id="fechaSprintField"
							onChange={handleChange}
							value={selectedInscripcion.fechaSprint}
							readOnly
						/>
						<label>Matcheado con otro competidor</label>
						<input
							className="form-control"
							type="text"
							maxLength="100"
							name="matcheado"
							id="matcheadoField"
							onChange={handleChange}
							value={selectedInscripcion.matcheado}
							placeholder="Valores posibles: si - no"
						/>
						<label>Ingresó</label>
						<input
							className="form-control"
							type="text"
							maxLength="100"
							name="ingreso"
							id="ingresoField"
							onChange={handleChange}
							value={selectedInscripcion.ingreso}
							placeholder="Valores posibles: si - no"
						/>
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButton(selectedInscripcion)}
						<button className="btn btn-danger" onClick={() => closeModal()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>
				<Modal isOpen={modalCodigoQR}>
					<ModalBody>
						<p className="h1 text-center">Codigo de Inscripción</p>
						<label>Con el siguiente código QR, usted podrá ingresar al predio por la entrada preferencial y abonar en efectivo:</label>
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
			</div>
		);
	} else if (!cookies.get('_id')) {
		window.location.href = './errorPage';
		console.log('Necesita iniciar sesión y tener los permisos suficientes para poder acceder a esta pantalla');
		<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
			Necesita iniciar sesión y tener los permisos suficientes para poder acceder a esta pantalla
		</Alert>;
	} else {
		return (
			<div className="App">
				<div className="container-fluid">
					<div className="d-flex vh-85 p-2 justify-content-center align-self-center">
						<div className="container-fluid align-self-center col card sombraCard form-abm">
							<div className="table">
								<div className="table-wrapper">
									<div className="table-title">
										<div className="row">
											<div className="col-sm-6 w-auto">
												<h2>
													Mis <b>Inscripciones</b>
												</h2>
											</div>
											<div className="input-group mb-3 col-sm-12">
												<input
													type="text"
													className="form-control w-auto"
													placeholder="Buscar inscripcion por "
													value={searchValue}
													onChange={onChangeSearchValue}
												/>
												<select onChange={onChangeSearchParam}>
													{searchableParams.map((param) => {
														return <option value={param}> {param.replace('_', '')} </option>;
													})}
												</select>
												<div className="input-group-append">
													<button className="btn btn-secondary mx-2 mt-1" type="button" onClick={findByParamRegularUser}>
														Buscar
													</button>
												</div>
											</div>
										</div>
									</div>
									<div className="overflowAuto">
										<div className="container-fluid divTableInscripcionesUser">
											<table className="table table-striped w-auto table-hover tableData">
												<thead>
													<tr>
														<th className="thData fixedColHead">Acciones</th>
														<th className="thData">ID</th>
														<th className="thData">ID Evento</th>
														<th className="thData">ID Clase</th>
														<th className="thData">ID Usuario</th>
														<th className="thData">ID Vehiculo</th>
														<th className="thData">Precio</th>
														<th className="thData">Fecha</th>
														<th className="thData">Matcheado con otro competidor</th>
														<th className="thData">Ingreso</th>
													</tr>
												</thead>
												<tbody>
													{inscripciones.map((inscripcion) => {
														const id = `${inscripcion._id}`;
														const idEvento = `${inscripcion.idEvento}`;
														const claseId = `${inscripcion.claseId}`;
														const idUsuario = `${inscripcion.idUsuario}`;
														const vehiculoId = `${inscripcion.vehiculoId}`;
														const precio = `${inscripcion.precio}`;
														const fechaSprint = `${inscripcion.fechaSprint}`;
														const matcheado = `${inscripcion.matcheado}`;
														const ingreso = `${inscripcion.ingreso}`;
														return (
															<tr>
																<td className="tdData">
																	<button className="btn btn-primary fixedColRow" onClick={() => verQr(inscripcion)}>
																		Ver QR
																	</button>
																</td>
																<td className="tdData">{id}</td>
																<td className="tdData">{idEvento}</td>
																<td className="tdData">{claseId}</td>
																<td className="tdData">{idUsuario}</td>
																<td className="tdData">{vehiculoId}</td>
																<td className="tdData">{precio}</td>
																<td className="tdData">{fechaSprint}</td>
																<td className="tdData">{matcheado}</td>
																<td className="tdData">{ingreso}</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>
									<div className="clearfix">
										<div className="hint-text">
											Mostrando <b>{`${entriesPerPage}`}</b> de <b>{`${totalResults}`}</b> registros
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal isOpen={modalCodigoQR}>
					<ModalBody>
						<p className="h1 text-center">Codigo de Inscripción</p>
						<label>Con el siguiente código QR, usted podrá ingresar al predio por la entrada preferencial y abonar en efectivo:</label>
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
			</div>
		);
	}
};

export default InscripcionesList;
