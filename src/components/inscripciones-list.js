/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import InscripcionDataService from '../services/inscripcion';
import UserDataService from '../services/users';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import QRcode from 'qrcode';

const InscripcionesList = () => {
	const [inscripciones, setinscripciones] = useState([]);
	const [users, setUsers] = useState([]);
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

	const selectInscripcion = (action, inscripcion = {}) => {
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
		// TODO: finish
		// retrieveCars();
	};

	const findUser = async (query, by) => {
		await UserDataService.find(query, by)
			.then((response) => {
				console.log(response.data);
				setUsers(response.data.users);
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
					setinscripciones(response.data.inscripciones);
					setTotalResults(response.data.total_results);
					setEntriesPerPage(response.data.inscripciones.length);
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			await InscripcionDataService.get(cookies.get('_id'), 'idUsuario')
				.then((response) => {
					console.log('Data: ', response.data);
					setinscripciones(response.data.inscripciones);
					setTotalResults(response.data.total_results);
					setEntriesPerPage(response.data.inscripciones.length);
				})
				.catch((e) => {
					console.log(e);
				});
		}
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
				setinscripciones(response.data.inscripciones);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.inscripciones.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const findRegularUser = async (query, by) => {
		console.log(`Query: ${query} | By: ${by}`);
		if (by !== 'idUsuario' || (by === 'idUsuario' && (query === cookies.get('_id') || query === ''))) {
			await InscripcionDataService.getRegularUser(query, by, cookies.get('_id'))
				.then((response) => {
					console.log('Data: ', response.data);
					setinscripciones(response.data.inscripciones);
					setTotalResults(response.data.total_results);
					setEntriesPerPage(response.data.inscripciones.length);
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			setinscripciones([]);
		}
	};

	let setModalButton = (selectedInscripcion) => {
		if (selectedInscripcion._id) {
			return (
				<button className="btn btn-danger" onClick={() => editar(selectedInscripcion)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-danger" onClick={() => crear(selectedInscripcion)}>
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

	// Generador de codigo QR
	function generateQrCode(inscripcion) {
		const message = `Usuario ${inscripcion.idUsuario} abonado`;
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
			<div>
				<div className="container-xl">
					<div className="table-responsive">
						<div className="table-wrapper">
							<div className="table-title">
								<div className="row">
									<div className="col-sm-6">
										<h2>
											Administrar <b>Inscripciones</b>
										</h2>
									</div>
									<div className="input-group col-lg-4">
										<input type="text" className="form-control" placeholder="Buscar inscripcion por " value={searchValue} onChange={onChangeSearchValue} />
										<select onChange={onChangeSearchParam}>
											{searchableParams.map((param) => {
												return <option value={param}> {param.replace('_', '')} </option>;
											})}
										</select>
										<div className="input-group-append">
											<button className="btn btn-outline-secondary" type="button" onClick={findByParam}>
												Search
											</button>
										</div>
									</div>
									<br></br>
									<div className="col-lg-6">
										<button className="btn btn-success" onClick={() => selectInscripcion('Editar')}>
											Añadir una nueva Inscripciones
										</button>
									</div>
								</div>
								<hr className="rounded"></hr>
							</div>
							<table className="table table-striped w-auto table-hover">
								<thead>
									<tr>
										<th>_id</th>
										<th>idEvento</th>
										<th>claseId</th>
										<th>idUsuario</th>
										<th>vehiculoId</th>
										<th>precio</th>
										<th>fechaSprint</th>
										<th>matcheado</th>
										<th>ingreso</th>
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
												<th>{id}</th>
												<th>{idEvento}</th>
												<th>{claseId}</th>
												<th>{idUsuario}</th>
												<th>{vehiculoId}</th>
												<th>{precio}</th>
												<th>{fechaSprint}</th>
												<th>{matcheado}</th>
												<th>{ingreso}</th>
												<td>
													<button className="btn btn-primary" onClick={() => selectInscripcion('Editar', inscripcion)}>
														Edit
													</button>
													<button className="btn btn-danger" onClick={() => selectInscripcion('Eliminar', inscripcion)}>
														Delete
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							<div className="clearfix">
								<div className="hint-text">
									Showing <b>{`${entriesPerPage}`}</b> out of <b>{`${totalResults}`}</b> entries
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal isOpen={modalEliminar}>
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedInscripcion._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-danger" onClick={() => eliminar(selectedInscripcion._id)}>
							Sí
						</button>
						<button className="btn btn-secondary" onClick={() => setModalElminar(false)}>
							No
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEditar}>
					<ModalBody>
						<label>ID</label>
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedInscripcion._id} placeholder="Auto-Incremental ID" />
						<label>idEvento</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="idEvento"
							id="idEventoField"
							onChange={handleChange}
							value={selectedInscripcion.idEvento}
						/>
						<label>claseId</label>
						<input className="form-control" type="text" maxLength="100" name="claseId" id="claseIdField" onChange={handleChange} value={selectedInscripcion.claseId} />
						{/* <label>idUsuario</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="idUsuario"
							id="idUsuarioField"
							onChange={handleChange}
							value={selectedInscripcion.idUsuario}
						/> */}
						<label>Buscador de Usuarios</label>
						<input type="text" className="form-control" placeholder="Buscar por nombre" value={searchName} onChange={onChangeSearchName} />
						<div className="input-group-append">
							<button className="btn btn-outline-secondary" type="button" onClick={findByName}>
								Search
							</button>
						</div>
						<label>ID Usuario</label>
						<select
							className="form-select"
							name="idUsuario"
							id="idUsuarioField"
							onChange={handleChange}
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
						<label>vehiculoId</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="vehiculoId"
							id="vehiculoIdField"
							onChange={handleChange}
							value={selectedInscripcion.vehiculoId}
						/>
						<label>fechaSprint</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="fechaSprint"
							id="fechaSprintField"
							onChange={handleChange}
							value={selectedInscripcion.fechaSprint}
							placeholder="Formato de fecha: año(yyyy)-mes(mm)-dia(dd)"
						/>
						<label>matcheado</label>
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
						<label>ingreso</label>
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
						<button className="btn btn-secondary" onClick={() => closeModal()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>
			</div>
		);
	} else if (!cookies.get('_id')) {
		window.location.href = './errorPage';
		console.log('Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla');
		<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
			Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla
		</Alert>;
	} else {
		return (
			<div>
				<div className="container-xl">
					<div className="table-responsive">
						<div className="table-wrapper">
							<div className="table-title">
								<div className="row">
									<div className="col-sm-6">
										<h2>
											Mis <b>Inscripciones</b>
										</h2>
									</div>
									<div className="input-group col-lg-4">
										<input type="text" className="form-control" placeholder="Buscar inscripcion por " value={searchValue} onChange={onChangeSearchValue} />
										<select onChange={onChangeSearchParam}>
											{searchableParams.map((param) => {
												return <option value={param}> {param.replace('_', '')} </option>;
											})}
										</select>
										<div className="input-group-append">
											<button className="btn btn-outline-secondary" type="button" onClick={findByParamRegularUser}>
												Search
											</button>
										</div>
									</div>
								</div>
							</div>
							<table className="table table-striped w-auto table-hover">
								<thead>
									<tr>
										<th>_id</th>
										<th>idEvento</th>
										<th>claseId</th>
										<th>idUsuario</th>
										<th>vehiculoId</th>
										<th>precio</th>
										<th>fechaSprint</th>
										<th>matcheado</th>
										<th>ingreso</th>
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
												<th>{id}</th>
												<th>{idEvento}</th>
												<th>{claseId}</th>
												<th>{idUsuario}</th>
												<th>{vehiculoId}</th>
												<th>{precio}</th>
												<th>{fechaSprint}</th>
												<th>{matcheado}</th>
												<th>{ingreso}</th>
												<td>
													<button className="btn btn-primary" onClick={() => verQr(inscripcion)}>
														Ver QR
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							<div className="clearfix">
								<div className="hint-text">
									Showing <b>{`${entriesPerPage}`}</b> out of <b>{`${totalResults}`}</b> entries
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal isOpen={modalCodigoQR}>
					<ModalBody>
						<p className="h1 text-center">Codigo de Inscripcion</p>
						<label>Con el siguiente codigo QR, usted podra ingresar al predio por la entrada preferencial y abonar en efectivo:</label>
						{qrcode && (
							<>
								<img src={qrcode} />
								<a href={qrcode} download="qrcode.png">
									Download
								</a>
							</>
						)}
					</ModalBody>
					<ModalFooter>
						<button className="btn btn-success" onClick={() => closeModalCodigoQR()}>
							Cerrar
						</button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
};

export default InscripcionesList;
