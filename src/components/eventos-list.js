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
		idCarrera: '',
		fecha: '',
		cupos: '',
		idClase: '',
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
				<button className="btn btn-danger" onClick={() => editar(selectedEvento)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-danger" onClick={() => crear(selectedEvento)}>
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
				evento.idCarrera = selectedEvento.idCarrera;
				evento.fecha = selectedEvento.fecha;
				evento.cupos = selectedEvento.cupos;
				evento.idClase = selectedEvento.idClase;
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
			<div>
				<div className="container-xl">
					<div className="table-responsive">
						<div className="table-wrapper">
							<div className="table-title">
								<div className="row">
									<div className="col-sm-6">
										<h2>
											Administrar <b>Eventos</b>
										</h2>
									</div>
									<div className="input-group col-lg-4">
										<input type="text" className="form-control" placeholder="Buscar evento por " value={searchValue} onChange={onChangeSearchValue} />
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
										<button className="btn btn-success" onClick={() => selectEvento('Editar')}>
											Añadir un nuevo Evento
										</button>
									</div>
								</div>
							</div>
							<table className="table table-striped w-auto table-hover">
								<thead>
									<tr>
										<th>Id</th>
										<th>idCarrera</th>
										<th>fecha</th>
										<th>cupos</th>
										<th>idClase</th>
										<th>cupoMaximo</th>
										<th>precio</th>
									</tr>
								</thead>
								<tbody>
									{eventos.map((evento) => {
										const id = `${evento._id}`;
										const idCarrera = `${evento.idCarrera}`;
										const fecha = `${evento.fecha}`;
										const cupos = `${evento.cupos}`;
										const idClase = `${evento.idClase}`;
										const cupoMaximo = `${evento.cupoMaximo}`;
										const precio = `${evento.precio}`;
										return (
											<tr>
												<td>{id}</td>
												<td>{idCarrera}</td>
												<td>{fecha}</td>
												<td>{cupos}</td>
												<td>{idClase}</td>
												<td>{cupoMaximo}</td>
												<td>{precio}</td>
												<td>
													<button className="btn btn-primary" onClick={() => selectEvento('Editar', evento)}>
														Edit
													</button>
													<button className="btn btn-danger" onClick={() => selectEvento('Eliminar', evento)}>
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
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedEvento._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-danger" onClick={() => eliminar(selectedEvento._id)}>
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
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedEvento._id} placeholder="Auto-Incremental ID" />
						<label>ID Carrera</label>
						<input className="form-control" type="text" maxLength="50" name="idCarrera" id="idCarreraField" onChange={handleChange} value={selectedEvento.idCarrera} />
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
						<label>Cupos</label>
						<input className="form-control" type="number" maxLength="100" name="cupos" id="cuposField" onChange={handleChange} value={selectedEvento.cupos} />
						<label>Cupo Maximo</label>
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

export default EventosList;
