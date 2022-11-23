/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import InscripcionDataService from '../services/inscripcion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const InscripcionesList = () => {
	const [inscripciones, setinscripciones] = useState([]);
	const [entriesPerPage, setEntriesPerPage] = useState([]);
	const [totalResults, setTotalResults] = useState([]);
	const [searchParam, setSearchParam] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedInscripcion, setSelectedInscripcion] = useState({
		_id: '',
		carreraId: '',
		claseId: '',
		idUsuario: '',
		pagarMP: 'off',
		vehiculoId: '',
		fechaSprint: '',
		matcheado: 'no',
	});
	const [searchableParams] = useState(Object.keys(selectedInscripcion));

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

	const selectInscripcion = (action, inscripcion = {}) => {
		console.log('Selected: ', inscripcion);
		setSelectedInscripcion(inscripcion);
		action === 'Editar' ? setModalEditar(true) : setModalElminar(true);
	};

	const findByParam = () => {
		find(searchValue, searchParam);
	};

	const retrieveInscripciones = async () => {
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

	const editar = async (selectedInscripcion) => {
		inscripciones.forEach((inscripcion) => {
			if (inscripcion._id === selectedInscripcion._id) {
				inscripcion.carreraId = selectedInscripcion.carreraId;
				inscripcion.claseId = selectedInscripcion.claseId;
				inscripcion.idUsuario = selectedInscripcion.idUsuario;
				inscripcion.pagarMP = selectedInscripcion.pagarMP;
				inscripcion.vehiculoId = selectedInscripcion.vehiculoId;
				inscripcion.fechaSprint = selectedInscripcion.fechaSprint;
				inscripcion.matcheado = selectedInscripcion.matcheado;
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
									<div className="col-lg-6">
										<button className="btn btn-success" onClick={() => selectInscripcion('Editar')}>
											Añadir una nueva Inscripciones
										</button>
									</div>
								</div>
							</div>
							<table className="table table-striped w-auto table-hover">
								<thead>
									<tr>
										<th>_id</th>
										<th>carreraId</th>
										<th>claseId</th>
										<th>idUsuario</th>
										<th>pagarMP</th>
										<th>vehiculoId</th>
										<th>precio</th>
										<th>fechaSprint</th>
										<th>matcheado</th>
									</tr>
								</thead>
								<tbody>
									{inscripciones.map((inscripcion) => {
										const id = `${inscripcion._id}`;
										const carreraId = `${inscripcion.carreraId}`;
										const claseId = `${inscripcion.claseId}`;
										const idUsuario = `${inscripcion.idUsuario}`;
										const pagarMP = `${inscripcion.pagarMP}`;
										const vehiculoId = `${inscripcion.vehiculoId}`;
										const precio = `${inscripcion.precio}`;
										const fechaSprint = `${inscripcion.fechaSprint}`;
										const matcheado = `${inscripcion.matcheado}`;
										return (
											<tr>
												<th>{id}</th>
												<th>{carreraId}</th>
												<th>{claseId}</th>
												<th>{idUsuario}</th>
												<th>{pagarMP}</th>
												<th>{vehiculoId}</th>
												<th>{precio}</th>
												<th>{fechaSprint}</th>
												<th>{matcheado}</th>
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
						<label>carreraId</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="carreraId"
							id="carreraIdField"
							onChange={handleChange}
							value={selectedInscripcion.carreraId}
						/>
						<label>claseId</label>
						<input className="form-control" type="text" maxLength="100" name="claseId" id="claseIdField" onChange={handleChange} value={selectedInscripcion.claseId} />
						<label>idUsuario</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="idUsuario"
							id="idUsuarioField"
							onChange={handleChange}
							value={selectedInscripcion.idUsuario}
						/>
						<label>pagarMP</label>
						<input className="form-control" type="text" maxLength="100" name="pagarMP" id="pagarMPField" onChange={handleChange} value={selectedInscripcion.pagarMP} />
						<label>vehiculoId</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="vehiculoId"
							id="vehiculoIdField"
							onChange={handleChange}
							value={selectedInscripcion.vehiculoId}
							placeholder="Valores posibles: on - off"
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
							placeholder="Valores posibles: on - off"
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
	} else {
		window.location.href = './errorPage';
		console.log('Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla');
		<Alert id="errorMessage" className="alert alert-danger fade show" key="danger" variant="danger">
			Necesita logearse y tener los permisos suficientes para poder acceder a esta pantalla
		</Alert>;
	}
};

export default InscripcionesList;
