/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import SprintsDataService from '../services/sprints';
import ClasesDataService from '../services/clases';
import UserDataService from '../services/users';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const SprintsList = () => {
	const [sprints, setSprints] = useState([]);
	const [users, setUsers] = useState([]);
	const [clases, setClases] = useState([]);
	const [entriesPerPage, setEntriesPerPage] = useState([]);
	const [totalResults, setTotalResults] = useState([]);
	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedSprint, setSelectedSprint] = useState({
		_id: '',
		fecha: '',
		idUsuarioP1: '',
		idUsuarioP2: '',
		idVehiculoP1: '',
		idVehiculoP2: '',
		reaccionP1: '',
		reaccionP2: '',
		tiempo100mtsP1: '',
		tiempo100mtsP2: '',
		tiempoLlegadaP1: '',
		tiempoLllegadaP2: '',
		clase: '',
		carreraId: '',
	});
	const [searchableParams] = useState(Object.keys(selectedSprint));

	const [modalEditar, setModalEditar] = useState(false);
	const [modalEliminar, setModalElminar] = useState(false);

	useEffect(() => {
		retrieveSprints();
		retrieveClases();
		retrieveUsers();
	}, []);

	const retrieveUsers = () => {
		UserDataService.getAll()
			.then((response) => {
				console.log(response.data);
				setUsers([{ nombre: 'Seleccionar Usuario' }].concat(response.data.users));
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveClases = async () => {
		await ClasesDataService.getAll()
			.then((response) => {
				console.log('Data: ', response.data);
				setClases([{ nombre: 'Seleccionar Clase' }].concat(response.data.clases));
			})
			.catch((e) => {
				console.log(e);
			});
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
		setSelectedSprint((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const editar = async (selectedSprint) => {
		// REVISAR: Cuando se trata de editar, se modifica una property, pero luego se cancela la operacion, la property queda modificada localmente.
		// NO, tiene que volver a como estaba antes

		sprints.forEach((sprint) => {
			if (sprint._id === selectedSprint._id) {
				sprint.fecha = selectedSprint.fecha;
				sprint.idUsuarioP1 = selectedSprint.idUsuarioP1;
				sprint.idUsuarioP2 = selectedSprint.idUsuarioP2;
				sprint.idVehiculoP1 = selectedSprint.idVehiculoP1;
				sprint.idVehiculoP2 = selectedSprint.idVehiculoP2;
				sprint.reaccionP1 = selectedSprint.reaccionP1;
				sprint.reaccionP2 = selectedSprint.reaccionP2;
				sprint.tiempo100mtsP1 = selectedSprint.tiempo100mtsP1;
				sprint.tiempo100mtsP2 = selectedSprint.tiempo100mtsP2;
				sprint.tiempoLlegadaP1 = selectedSprint.tiempoLllegadaP2;
				sprint.pista = selectedSprint.pista;
				sprint.clase = selectedSprint.clase;
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
										<th>fecha</th>
										<th>clase</th>
										<th>idUsuarioP1</th>
										<th>idUsuarioP2</th>
										<th>idVehiculoP1</th>
										<th>idVehiculoP2</th>
										<th>reaccionP1</th>
										<th>reaccionP2</th>
										<th>tiempo100mtsP1</th>
										<th>tiempo100mtsP2</th>
										<th>carrera</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{sprints.map((sprint) => {
										const id = `${sprint._id}`;
										const fecha = `${sprint.fecha}`;
										const clase = `${sprint.clase}`;
										const carreraId = `${sprint.carreraId}`;
										const idUsuarioP1 = `${sprint.idUsuarioP1}`;
										const idUsuarioP2 = `${sprint.idUsuarioP2}`;
										const idVehiculoP1 = `${sprint.idVehiculoP1}`;
										const idVehiculoP2 = `${sprint.idVehiculoP2}`;
										const reaccionP1 = `${sprint.reaccionP1}`;
										const reaccionP2 = `${sprint.reaccionP2}`;
										const tiempo100mtsP1 = `${sprint.tiempo100mtsP1}`;
										const tiempo100mtsP2 = `${sprint.tiempo100mtsP2}`;
										return (
											<tr>
												<td>{id}</td>
												<td>{fecha}</td>
												<td>{clase}</td>
												<td>{idUsuarioP1}</td>
												<td width="">{idUsuarioP2}</td>
												<td>{idVehiculoP1}</td>
												<td>{idVehiculoP2}</td>
												<td>{reaccionP1}</td>
												<td>{reaccionP2}</td>
												<td>{tiempo100mtsP1}</td>
												<td>{tiempo100mtsP2}</td>
												<td>{carreraId}</td>
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
						<label>Fecha</label>
						<input className="form-control" type="date" maxLength="50" name="fecha" id="fechaField" onChange={handleChange} value={selectedSprint.fecha} />
						<label>Clase</label>
						<select className="form-select" name="clase" id="claseField" onChange={handleChange} value={selectedSprint.clase} aria-label="Default select example">
							{clases.map((clase) => {
								const id = `${clase._id}`;
								const nombre = `${clase.nombre}`;
								return <option value={id}>{nombre}</option>;
							})}
						</select>
						<label>ID UsuarioP1</label>
						<select
							className="form-select"
							name="idUsuarioP1"
							id="idUsuarioP1Field"
							onChange={handleChange}
							value={selectedSprint.idUsuarioP1}
							aria-label="Default select example"
						>
							{users.map((user) => {
								const id = `${user._id}`;
								const nombre = `${user.nombre}`;
								return <option value={id}>{nombre}</option>;
							})}
						</select>
						<label>ID VehiculoP1</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="idVehiculoP1"
							id="workshopField"
							onChange={handleChange}
							value={selectedSprint.idVehiculoP1}
						/>
						<label>ID UsuarioP2</label>
						<select
							className="form-select"
							name="idUsuarioP2"
							id="idUsuarioP2Field"
							onChange={handleChange}
							value={selectedSprint.idUsuarioP2}
							aria-label="Default select example"
						>
							{users.map((user) => {
								const id = `${user._id}`;
								const nombre = `${user.nombre}`;
								return <option value={id}>{nombre}</option>;
							})}
						</select>
						<label>ID VehiculoP2</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="idVehiculoP2"
							id="idVehiculoP2Field"
							onChange={handleChange}
							value={selectedSprint.idVehiculoP2}
						/>
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
						<label>Pista</label>
						<input className="form-control" type="text" maxLength="50" name="pista" id="pistaField" onChange={handleChange} value={selectedSprint.pista} />
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
