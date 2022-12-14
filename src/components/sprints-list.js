/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import SprintsDataService from '../services/sprints';
import EventosDataService from '../services/eventos';
import CarsDataService from '../services/cars';
import UserDataService from '../services/users';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const SprintsList = () => {
	const [sprints, setSprints] = useState([]);
	const [usersP1, setUsersP1] = useState([]);
	const [carsP1, setCarsP1] = useState([]);
	const [carsP2, setCarsP2] = useState([]);
	const [usersP2, setUsersP2] = useState([]);
	const [searchNameP1, setSearchNameP1] = useState('');
	const [searchNameP2, setSearchNameP2] = useState('');
	const [eventos, setEventos] = useState([]);
	const [entriesPerPage, setEntriesPerPage] = useState([]);
	const [totalResults, setTotalResults] = useState([]);
	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedSprint, setSelectedSprint] = useState({
		_id: '',
		idEvento: '',
		idUsuarioP1: '',
		idUsuarioP2: '',
		idVehiculoP1: '',
		idVehiculoP2: '',
		reaccionP1: '',
		reaccionP2: '',
		tiempo100mtsP1: '',
		tiempo100mtsP2: '',
		tiempoLlegadaP1: '',
		tiempoLlegadaP2: '',
	});
	const [searchableParams] = useState(Object.keys(selectedSprint));

	const [modalEditar, setModalEditar] = useState(false);
	const [modalEliminar, setModalElminar] = useState(false);

	useEffect(() => {
		retrieveSprints();
		retrieveEventos();
	}, []);

	const retrieveCarsP1 = async (userId) => {
		console.log('userId tiene: ', userId);
		await CarsDataService.find(userId, 'idUsuarioDuenio')
			.then((response) => {
				console.log('Autos tiene', response.data.cars);
				setCarsP1(response.data.cars);
				if (response.data.cars.length) {
					// console.log('Se cambio el ID Vehiculo P1 a: ', response.data.cars[0]._id);
					setSelectedSprint((prevState) => ({
						...prevState,
						idVehiculoP1: response.data.cars[0]._id,
					}));
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveCarsP2 = async (userId) => {
		console.log('userId tiene: ', userId);
		await CarsDataService.find(userId, 'idUsuarioDuenio')
			.then((response) => {
				console.log('Autos tiene', response.data.cars);
				setCarsP2(response.data.cars);
				if (response.data.cars.length) {
					// console.log('Se cambio el ID Vehiculo P2 a: ', response.data.cars[0]._id);
					setSelectedSprint((prevState) => ({
						...prevState,
						idVehiculoP2: response.data.cars[0]._id,
					}));
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveEventos = async () => {
		await EventosDataService.getAll()
			.then((response) => {
				console.log('Data Eventos: ', response.data);
				setEventos(response.data.eventos);
				if (response.data.eventos.length) {
					// console.log('Se cambio el ID Evento a: ', response.data.eventos[0].idCarrera);
					setSelectedSprint((prevState) => ({
						...prevState,
						idEvento: response.data.eventos[0].idCarrera,
					}));
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const onChangeSearchNameP1 = (e) => {
		const searchName = e.target.value;
		setSearchNameP1(searchName);
	};

	const onChangeSearchNameP2 = (e) => {
		const searchName = e.target.value;
		setSearchNameP2(searchName);
	};

	const findByNameP1 = async () => {
		await findUserP1(searchNameP1, 'nombre');
	};

	const findByNameP2 = async () => {
		await findUserP2(searchNameP2, 'nombre');
	};

	const onChangeSearchParam = (e) => {
		const searchParam = e.target.value;
		setSearchParam(searchParam);
	};

	const onChangeSearchValue = (e) => {
		const searchValue = e.target.value;
		setSearchValue(searchValue);
	};

	const selectSprint = (action, sprint = {}) => {
		console.log('Selected: ', sprint);
		setSelectedSprint(sprint);
		action === 'Editar' ? setModalEditar(true) : setModalElminar(true);
	};

	const findByParam = () => {
		find(searchValue, searchParam);
	};

	const retrieveSprints = async () => {
		await SprintsDataService.getAll()
			.then((response) => {
				console.log('Data: ', response.data);
				setSprints(response.data.sprints);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.sprints.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const deleteSprint = async (sprintId) => {
		console.log('Car to be deleted', sprintId);
		await SprintsDataService.deleteSprint(sprintId)
			.then(() => {
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const refreshList = () => {
		retrieveSprints();
	};

	const findUserP1 = async (query, by) => {
		await UserDataService.find(query, by)
			.then(async (response) => {
				console.log(response.data);
				setUsersP1(response.data.users);
				setSelectedSprint((prevState) => ({
					...prevState,
					idUsuarioP1: response.data.users[0]._id,
				}));
				await retrieveCarsP1(response.data.users[0]._id);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const findUserP2 = async (query, by) => {
		await UserDataService.find(query, by)
			.then(async (response) => {
				console.log(response.data);
				setUsersP2(response.data.users);
				setSelectedSprint((prevState) => ({
					...prevState,
					idUsuarioP2: response.data.users[0]._id,
				}));
				await retrieveCarsP2(response.data.users[0]._id);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const find = async (query, by) => {
		await SprintsDataService.find(query, by)
			.then((response) => {
				console.log('Found Sprints: ', response.data);
				setSprints(response.data.sprints);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.sprints.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	let setModalButton = (selectedSprint) => {
		if (selectedSprint._id) {
			return (
				<button className="btn btn-danger" onClick={() => editar(selectedSprint)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-danger" onClick={() => crear(selectedSprint)}>
					Crear
				</button>
			);
		}
	};

	const closeModal = () => {
		setModalEditar(false);
		setValidationErrorMessage('');
	};

	const eliminar = (sprintId) => {
		deleteSprint(sprintId);
		setModalElminar(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		// console.log('Id Vehiculo cambiado a: ', value);
		setSelectedSprint((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleChangeEvento = (e) => {
		const { name, value } = e.target;
		setSelectedSprint((prevState) => ({
			...prevState,
			[name]: value,
		}));
		// TODO: Buscar el nombre de la clase correspondiente. No hace falta mas Fecha ya qeu esta dentro de los datos del evento
		// document.getElementById('tiempoClaseData').value = value.idClase;
	};

	const handleChangeUserP1 = (e) => {
		const { name, value } = e.target;
		setSelectedSprint((prevState) => ({
			...prevState,
			[name]: value,
		}));
		retrieveCarsP1(value);
	};

	const handleChangeUserP2 = (e) => {
		const { name, value } = e.target;
		setSelectedSprint((prevState) => ({
			...prevState,
			[name]: value,
		}));
		retrieveCarsP2(value);
	};

	const editar = async (selectedSprint) => {
		// REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente.
		// NO, tiene que volver a como estaba antes

		sprints.forEach((sprint) => {
			if (sprint._id === selectedSprint._id) {
				sprint.idEvento = selectedSprint.idEvento;
				sprint.idUsuarioP1 = selectedSprint.idUsuarioP1;
				sprint.idUsuarioP2 = selectedSprint.idUsuarioP2;
				sprint.idVehiculoP1 = selectedSprint.idVehiculoP1;
				sprint.idVehiculoP2 = selectedSprint.idVehiculoP2;
				sprint.reaccionP1 = selectedSprint.reaccionP1;
				sprint.reaccionP2 = selectedSprint.reaccionP2;
				sprint.tiempo100mtsP1 = selectedSprint.tiempo100mtsP1;
				sprint.tiempo100mtsP2 = selectedSprint.tiempo100mtsP2;
				sprint.tiempoLlegadaP1 = selectedSprint.tiempoLlegadaP1;
				sprint.tiempoLlegadaP2 = selectedSprint.tiempoLlegadaP2;
			}
		});
		const result = await SprintsDataService.editSprint(selectedSprint);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setSprints(sprints);
			setModalEditar(false);
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const crear = async (selectedSprint) => {
		const result = await SprintsDataService.createSprint(selectedSprint);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			retrieveSprints();
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
									<div className="col-lg-12">
										<h2>
											Administrar <b>Carreras</b>
										</h2>
									</div>
									<div className="input-group col-lg-4">
										<input type="text" className="form-control" placeholder="Buscar sprint por " value={searchValue} onChange={onChangeSearchValue} />
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
									<div className="col-lg-6">
										<button className="btn btn-success" onClick={() => selectSprint('Editar')}>
											Añadir una Carrera
										</button>
									</div>
								</div>
							</div>
							<table className="table table-striped w-auto table-hover">
								<thead>
									<tr>
										<th>Id</th>
										<th>idEvento</th>
										<th>idUsuarioP1</th>
										<th>idUsuarioP2</th>
										<th>idVehiculoP1</th>
										<th>idVehiculoP2</th>
										<th>reaccionP1</th>
										<th>reaccionP2</th>
										<th>tiempo100mtsP1</th>
										<th>tiempo100mtsP2</th>
										<th>tiempoLlegadaP1</th>
										<th>tiempoLlegadaP2</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{sprints.map((sprint) => {
										const id = `${sprint._id}`;
										const idEvento = `${sprint.idEvento}`;
										const idUsuarioP1 = `${sprint.idUsuarioP1}`;
										const idUsuarioP2 = `${sprint.idUsuarioP2}`;
										const idVehiculoP1 = `${sprint.idVehiculoP1}`;
										const idVehiculoP2 = `${sprint.idVehiculoP2}`;
										const reaccionP1 = `${sprint.reaccionP1}`;
										const reaccionP2 = `${sprint.reaccionP2}`;
										const tiempo100mtsP1 = `${sprint.tiempo100mtsP1}`;
										const tiempo100mtsP2 = `${sprint.tiempo100mtsP2}`;
										const tiempoLlegadaP1 = `${sprint.tiempoLlegadaP1}`;
										const tiempoLlegadaP2 = `${sprint.tiempoLlegadaP2}`;
										return (
											<tr>
												<td>{id}</td>
												<td>{idEvento}</td>
												<td>{idUsuarioP1}</td>
												<td>{idUsuarioP2}</td>
												<td>{idVehiculoP1}</td>
												<td>{idVehiculoP2}</td>
												<td>{reaccionP1}</td>
												<td>{reaccionP2}</td>
												<td>{tiempo100mtsP1}</td>
												<td>{tiempo100mtsP2}</td>
												<td>{tiempoLlegadaP1}</td>
												<td>{tiempoLlegadaP2}</td>
												<td>
													<button className="btn btn-primary" onClick={() => selectSprint('Editar', sprint)}>
														Edit
													</button>
													<button className="btn btn-danger" onClick={() => selectSprint('Eliminar', sprint)}>
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
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedSprint._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-danger" onClick={() => eliminar(selectedSprint._id)}>
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
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedSprint._id} placeholder="Auto-Incremental ID" />
						<label>Evento</label>
						<select
							className="form-select"
							name="idEvento"
							id="idEventoField"
							onChange={handleChangeEvento}
							value={selectedSprint.eventos}
							aria-label="Default select example"
						>
							{eventos.map((evento) => {
								const id = `${evento.idCarrera}`;
								return <option value={id}>Carrera {id}</option>;
							})}
						</select>
						{/* <label className="label-class" htmlFor="tiempoClase">
							{' '}
							Clase del evento:{' '}
						</label>
						<input type="text" id="tiempoClaseData" name="tiempoDataInput" className="col-md-1" data-readonly required />
						<br></br> */}
						<label>Buscador UsuarioP1</label>
						<input type="text" className="form-control" placeholder="Buscar por nombre" value={searchNameP1} onChange={onChangeSearchNameP1} />
						<div className="input-group-append">
							<button className="btn btn-outline-secondary" type="button" onClick={findByNameP1}>
								Search
							</button>
						</div>
						<label>ID UsuarioP1</label>
						<select
							className="form-select"
							name="idUsuarioP1"
							id="idUsuarioP1Field"
							onChange={handleChangeUserP1}
							value={selectedSprint.idUsuarioP1}
							aria-label="Default select example"
						>
							{usersP1.map((user1) => {
								const id = `${user1._id}`;
								const nombre = `${user1.nombre}`;
								return <option value={id}>{nombre}</option>;
							})}
						</select>
						<label>ID VehiculoP1</label>
						<select
							className="form-select"
							name="idVehiculoP1"
							id="idVehiculoP1Field"
							onChange={handleChange}
							value={selectedSprint.idVehiculoP1}
							aria-label="Default select example"
						>
							{carsP1.map((car) => {
								const id = `${car._id}`;
								const modelo = `${car.modelo}`;
								return <option value={id}>{modelo}</option>;
							})}
						</select>
						<br></br>
						<label>Buscador UsuarioP2</label>
						<input type="text" className="form-control" placeholder="Buscar por nombre" value={searchNameP2} onChange={onChangeSearchNameP2} />
						<div className="input-group-append">
							<button className="btn btn-outline-secondary" type="button" onClick={findByNameP2}>
								Search
							</button>
						</div>
						<label>ID UsuarioP2</label>
						<select
							className="form-select"
							name="idUsuarioP2"
							id="idUsuarioP2Field"
							onChange={handleChangeUserP2}
							value={selectedSprint.idUsuarioP2}
							aria-label="Default select example"
						>
							{usersP2.map((user2) => {
								const id = `${user2._id}`;
								const nombre = `${user2.nombre}`;
								return <option value={id}>{nombre}</option>;
							})}
						</select>
						<label>ID VehiculoP2</label>
						<select
							className="form-select"
							name="idVehiculoP2"
							id="idVehiculoP2Field"
							onChange={handleChange}
							value={selectedSprint.idVehiculoP2}
							aria-label="Default select example"
						>
							{carsP2.map((car) => {
								const id = `${car._id}`;
								const modelo = `${car.modelo}`;
								return <option value={id}>{modelo}</option>;
							})}
						</select>
						<label>Reacción P1</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="reaccionP1"
							id="reaccionP1Field"
							onChange={handleChange}
							value={selectedSprint.reaccionP1}
						/>
						<label>Reacción P2</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="reaccionP2"
							id="reaccionP2Field"
							onChange={handleChange}
							value={selectedSprint.reaccionP2}
						/>
						<label>Tiempo 100mts P1</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="tiempo100mtsP1"
							id="tiempo100mtsP1Field"
							onChange={handleChange}
							value={selectedSprint.tiempo100mtsP1}
						/>
						<label>Tiempo 100mts P2</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="tiempo100mtsP2"
							id="tiempo100mtsP2Field"
							onChange={handleChange}
							value={selectedSprint.tiempo100mtsP2}
						/>
						<label>Tiempo Llegada P1</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="tiempoLlegadaP1"
							id="tiempoLlegadaP1Field"
							onChange={handleChange}
							value={selectedSprint.tiempoLlegadaP1}
						/>
						<label>Tiempo Llegada P2</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="tiempoLlegadaP2"
							id="tiempoLlegadaP2Field"
							onChange={handleChange}
							value={selectedSprint.tiempoLlegadaP2}
						/>
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButton(selectedSprint)}
						<button className="btn btn-secondary" onClick={() => closeModal()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>
			</div>
		);
	} else {
		window.location.href = './errorPage';
		console.log('Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla');
		<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
			Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla
		</Alert>;
	}
};

export default SprintsList;
