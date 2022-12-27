/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import ClasesDataService from '../services/clases';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const ClasesList = () => {
	const [clases, setClases] = useState([]);
	const [allClases, setAllClases] = useState([]);
	const [entriesPerPage, setEntriesPerPage] = useState([]);
	const [totalResults, setTotalResults] = useState([]);
	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedClase, setSelectedClase] = useState({
		_id: '',
		idClase: '',
		nombre: '',
		tiempo: '',
	});
	const [searchableParams] = useState(Object.keys(selectedClase));

	const [modalEditar, setModalEditar] = useState(false);
	const [modalEliminar, setModalElminar] = useState(false);

	useEffect(() => {
		retrieveClases();
	}, []);

	const onChangeSearchParam = (e) => {
		const searchParam = e.target.value;
		setSearchParam(searchParam);
	};

	const onChangeSearchValue = (e) => {
		const searchValue = e.target.value;
		setSearchValue(searchValue);
	};

	const selectClase = (action, clase = {}) => {
		console.log('Selected: ', clase);
		setSelectedClase(clase);
		action === 'Editar' ? setModalEditar(true) : setModalElminar(true);
	};

	const findByParam = () => {
		find(searchValue, searchParam);
	};

	const retrieveClases = async () => {
		await ClasesDataService.getAll()
			.then((response) => {
				console.log('Data: ', response.data);
				setClases(response.data.clases);
				setAllClases(response.data.clases);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.clases.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const deleteClase = async (claseId) => {
		console.log('Clase to be deleted', claseId);
		await ClasesDataService.deleteClase(claseId)
			.then(() => {
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const refreshList = () => {
		retrieveClases();
	};

	const find = async (query, by) => {
		await ClasesDataService.find(query, by)
			.then((response) => {
				console.log('Data: ', response.data);
				setClases(response.data.clases);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.clases.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	let setModalButton = (selectedClase) => {
		if (selectedClase._id) {
			return (
				<button className="btn btn-success" onClick={() => editar(selectedClase)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-success" onClick={() => crear(selectedClase)}>
					Crear
				</button>
			);
		}
	};

	const closeModal = () => {
		setModalEditar(false);
		setValidationErrorMessage('');
	};

	const eliminar = (claseId) => {
		deleteClase(claseId);
		setModalElminar(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSelectedClase((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const editar = async (selectedClase) => {
		clases.forEach((clase) => {
			if (clase._id === selectedClase._id) {
				clase.idClase = selectedClase.idClase;
				clase.nombre = selectedClase.nombre;
				clase.tiempo = selectedClase.tiempo;
			}
		});
		const result = await ClasesDataService.editClase(selectedClase, allClases);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setClases(clases);
			setModalEditar(false);
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const crear = async (selectedClase) => {
		const result = await ClasesDataService.createClase(selectedClase, allClases);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			retrieveClases();
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
													Administrar <b>Clases</b>
												</h2>
											</div>
											<div className="input-group">
												<input
													type="text"
													className="form-control w-auto"
													placeholder="Buscar clases por "
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
												<button className="btn btn-success" onClick={() => selectClase('Editar')}>
													Añadir una nueva Clase
												</button>
											</div>
										</div>
										<hr className="rounded"></hr>
									</div>
									<div className="overflowAuto">
										<div className="container-fluid divTableABMCarsAdmin">
											<table className="table table-responsive table-striped w-auto table-hover tableData">
												<thead>
													<tr>
														<th className="thData fixedColHead">Acciones</th>
														<th className="thData">ID</th>
														<th className="thData">ID Clase</th>
														<th className="thData">Nombre</th>
														<th className="thData">Tiempo</th>
													</tr>
												</thead>
												<tbody>
													{clases.map((clase) => {
														const id = `${clase._id}`;
														const idClase = `${clase.idClase}`;
														const nombre = `${clase.nombre}`;
														const tiempo = `${clase.tiempo}`;
														return (
															<tr>
																<td className="tdData fixedColRow">
																	<button className="btn btn-warning mx-1" onClick={() => selectClase('Editar', clase)}>
																		Editar
																	</button>
																	<button className="btn btn-danger mx-1" onClick={() => selectClase('Eliminar', clase)}>
																		Borrar
																	</button>
																</td>
																<td className="tdData">{id}</td>
																<td className="tdData">{idClase}</td>
																<td className="tdData">{nombre}</td>
																<td className="tdData">{tiempo}</td>
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
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedClase._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-success" onClick={() => eliminar(selectedClase._id)}>
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
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedClase._id} placeholder="Auto-Incremental ID" />
						<label>ID Clase</label>
						<input className="form-control" type="text" maxLength="50" name="idClase" id="idClaseField" onChange={handleChange} value={selectedClase.idClase} />
						<label>Nombre</label>
						<input className="form-control" type="text" maxLength="50" name="nombre" id="nombreField" onChange={handleChange} value={selectedClase.nombre} />
						<label>Tiempo</label>
						<input className="form-control" type="text" maxLength="100" name="tiempo" id="tiempoField" onChange={handleChange} value={selectedClase.tiempo} />
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButton(selectedClase)}
						<button className="btn btn-danger" onClick={() => closeModal()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>
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

export default ClasesList;
