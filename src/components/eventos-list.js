/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import EventosDataService from '../services/eventos';
import ClasesDataService from '../services/clases';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const EventosList = () => {
	const [eventos, setEventos] = useState([]);
	const [allEventos, setAllEventos] = useState([]);
	const [clases, setClases] = useState([]);
	const [entriesPerPage, setEntriesPerPage] = useState([]);
	const [totalResults, setTotalResults] = useState([]);
	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedEvento, setSelectedEvento] = useState({
		_id: '',
		idEvento: '',
		idClase: '',
		fecha: '',
		cupos: '',
		cupoMaximo: '',
		precio: '',
	});
	const [searchableParams] = useState(Object.keys(selectedEvento));

	const [modalEditar, setModalEditar] = useState(false);
	const [modalEliminar, setModalElminar] = useState(false);

	useEffect(() => {
		retrieveEventos();
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

	const selectEvento = (action, evento = {}) => {
		console.log('Selected: ', evento);
		setSelectedEvento(evento);
		action === 'Editar' ? setModalEditar(true) : setModalElminar(true);
	};

	const findByParam = () => {
		find(searchValue, searchParam);
	};

	const retrieveEventos = async () => {
		await EventosDataService.getAll()
			.then((response) => {
				console.log('Data: ', response.data);
				setEventos(response.data.eventos);
				setAllEventos(response.data.eventos);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.eventos.length);
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

	const deleteEvento = async (eventoId) => {
		console.log('Evento to be deleted', eventoId);
		await EventosDataService.deleteEvento(eventoId)
			.then(() => {
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const refreshList = () => {
		retrieveEventos();
	};

	const find = async (query, by) => {
		await EventosDataService.find(query, by)
			.then((response) => {
				console.log('Data: ', response.data);
				setEventos(response.data.eventos);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.eventos.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	let setModalButton = (selectedEvento) => {
		if (selectedEvento._id) {
			return (
				<button className="btn btn-success" onClick={() => editar(selectedEvento)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-success" onClick={() => crear(selectedEvento)}>
					Crear
				</button>
			);
		}
	};

	const closeModal = () => {
		setModalEditar(false);
		setValidationErrorMessage('');
	};

	const eliminar = (eventoId) => {
		deleteEvento(eventoId);
		setModalElminar(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log('Name: ', name);
		console.log('Value: ', value);
		setSelectedEvento((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const editar = async (selectedEvento) => {
		eventos.forEach((evento) => {
			if (evento._id === selectedEvento._id) {
				evento.idEvento = selectedEvento.idEvento;
				evento.idClase = selectedEvento.idClase;
				evento.fecha = selectedEvento.fecha;
				evento.cupos = selectedEvento.cupos;
				evento.cupoMaximo = selectedEvento.cupoMaximo;
				evento.precio = selectedEvento.precio;
			}
		});
		const result = await EventosDataService.editEvento(selectedEvento, allEventos);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setEventos(eventos);
			setModalEditar(false);
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const crear = async (selectedEvento) => {
		const result = await EventosDataService.createEvento(selectedEvento, allEventos);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			retrieveEventos();
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
													Administrar <b>Eventos</b>
												</h2>
											</div>
											<div className="input-group">
												<input
													type="text"
													className="form-control w-auto"
													placeholder="Buscar evento por "
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
												<button className="btn btn-success" onClick={() => selectEvento('Editar')}>
													Añadir un nuevo Evento
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
														<th className="thData">ID Evento</th>
														<th className="thData">ID Clase</th>
														<th className="thData">Fecha</th>
														<th className="thData">Cupos</th>
														<th className="thData">Cupo Maximo</th>
														<th className="thData">Precio</th>
													</tr>
												</thead>
												<tbody>
													{eventos.map((evento) => {
														const id = `${evento._id}`;
														const idEvento = `${evento.idEvento}`;
														const idClase = `${evento.idClase}`;
														const fecha = `${evento.fecha}`;
														const cupos = `${evento.cupos}`;
														const cupoMaximo = `${evento.cupoMaximo}`;
														const precio = `${evento.precio}`;
														return (
															<tr>
																<td className="tdData fixedColRow">
																	<button className="btn btn-warning mx-1" onClick={() => selectEvento('Editar', evento)}>
																		Editar
																	</button>
																	<button className="btn btn-danger mx-1" onClick={() => selectEvento('Eliminar', evento)}>
																		Borrar
																	</button>
																</td>
																<td className="tdData">{id}</td>
																<td className="tdData">{idEvento}</td>
																<td className="tdData">{idClase}</td>
																<td className="tdData">{fecha}</td>
																<td className="tdData">{cupos}</td>
																<td className="tdData">{cupoMaximo}</td>
																<td className="tdData">${precio}</td>
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
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedEvento._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-success" onClick={() => eliminar(selectedEvento._id)}>
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
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedEvento._id} placeholder="Auto-Incremental ID" />
						<label>ID Evento</label>
						<input className="form-control" type="text" maxLength="50" name="idEvento" id="idEventoField" onChange={handleChange} value={selectedEvento.idEvento} />
						<label>Clase</label>
						<select className="form-select" name="idClase" id="idClaseField" onChange={handleChange} value={selectedEvento.idClase} aria-label="Default select example">
							{clases.map((clase) => {
								const id = `${clase.idClase}`;
								const nombre = `${clase.nombre}`;
								return <option value={id}>{nombre}</option>;
							})}
						</select>
						<label>Fecha</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="fecha"
							id="fechaField"
							onChange={handleChange}
							value={selectedEvento.fecha}
							placeholder="Formato de fecha: año(yyyy)-mes(mm)-dia(dd)"
						/>
						<small id="fechaHelp" className="form-text text-muted">
							La fecha debe corresponder a un viernes próximo para ser detectada por el sistema.
						</small>
						<br></br>
						<label>Cupos</label>
						<input className="form-control" type="number" maxLength="100" name="cupos" id="cuposField" onChange={handleChange} value={selectedEvento.cupos} />
						<label>Cupo Máximo</label>
						<input
							className="form-control"
							type="number"
							maxLength="300"
							name="cupoMaximo"
							id="cupoMaximoField"
							onChange={handleChange}
							value={selectedEvento.cupoMaximo}
						/>
						<label>Precio</label>
						<input className="form-control" type="number" maxLength="200" name="precio" id="precioField" onChange={handleChange} value={selectedEvento.precio} />
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButton(selectedEvento)}
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

export default EventosList;
