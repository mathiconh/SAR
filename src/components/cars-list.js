/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import CarsDataService from '../services/cars';
import UserDataService from '../services/users';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const CarsList = () => {
	const [cars, setCars] = useState([]);
	const [users, setUsers] = useState([]);
	const [searchName, setSearchName] = useState('');
	const [entriesPerPage, setEntriesPerPage] = useState([]);
	const [totalResults, setTotalResults] = useState([]);
	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedCar, setSelectedCar] = useState({
		_id: '',
		patente: '',
		modelo: '',
		anio: '',
		agregados: '',
		historia: '',
		tallerAsociado: '',
		idUsuarioDuenio: '',
	});
	const [searchableParams] = useState(Object.keys(selectedCar));

	const [modalEditar, setModalEditar] = useState(false);
	const [modalEliminar, setModalElminar] = useState(false);

	useEffect(() => {
		retrieveCars();
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

	const selectCar = (action, car = {}) => {
		console.log('Selected: ', car);
		setSelectedCar(car);
		action === 'Editar' ? setModalEditar(true) : setModalElminar(true);
	};

	const findByParam = () => {
		find(searchValue, searchParam);
	};

	const findByName = async () => {
		await findUser(searchName, 'nombre');
	};

	const findUser = async (query, by) => {
		await UserDataService.find(query, by)
			.then((response) => {
				console.log(response.data);
				const usersList = response.data.users.sort((a, b) => a.apellido.localeCompare(b.apellido));
				setUsers(usersList);
				if (response.data.users.length) {
					console.log('Se cambio el ID user Dueño a: ', response.data.users[0]._id);
					setSelectedCar((prevState) => ({
						...prevState,
						idUsuarioDuenio: response.data.users[0]._id,
					}));
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveCars = async () => {
		await CarsDataService.getAll()
			.then((response) => {
				console.log('Data: ', response.data);
				setCars(response.data.cars);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.cars.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const deleteCar = async (carId) => {
		console.log('Car to be deleted', carId);
		await CarsDataService.deleteCar(carId)
			.then(() => {
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const refreshList = () => {
		retrieveCars();
	};

	const find = async (query, by) => {
		await CarsDataService.find(query, by)
			.then((response) => {
				console.log('Data: ', response.data);
				setCars(response.data.cars);
				setTotalResults(response.data.total_results);
				setEntriesPerPage(response.data.cars.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	let setModalButton = (selectedCar) => {
		if (selectedCar._id) {
			return (
				<button className="btn btn-primary" onClick={() => editar(selectedCar)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-primary" onClick={() => crear(selectedCar)}>
					Crear
				</button>
			);
		}
	};

	const closeModal = () => {
		setModalEditar(false);
		setValidationErrorMessage('');
	};

	const eliminar = (carId) => {
		deleteCar(carId);
		setModalElminar(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSelectedCar((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const editar = async (selectedCar) => {
		cars.forEach((car) => {
			if (car._id === selectedCar._id) {
				car.patente = selectedCar.patente;
				car.modelo = selectedCar.modelo;
				car.anio = selectedCar.anio;
				car.agregados = selectedCar.agregados;
				car.historia = selectedCar.historia;
				car.tallerAsociado = selectedCar.tallerAsociado;
				car.idUsuarioDuenio = selectedCar.idUsuarioDuenio;
			}
		});
		const result = await CarsDataService.editCar(selectedCar);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setCars(cars);
			setModalEditar(false);
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const crear = async (selectedCar) => {
		const result = await CarsDataService.createCar(selectedCar);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			retrieveCars();
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
													Administrar <b>Autos</b>
												</h2>
											</div>
											<div className="input-group col-sm-6">
												<input
													type="text"
													className="form-control w-auto"
													placeholder="Buscar autos por "
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
												<button className="btn btn-success" onClick={() => selectCar('Editar')}>
													Añadir un nuevo Auto
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
														<th className="thData">Id</th>
														<th className="thData">Patente</th>
														<th className="thData">Marca & Modelo</th>
														<th className="thData">Año</th>
														<th className="thData">Agregados</th>
														<th className="thData">Historia</th>
														<th className="thData">Workshop Asociado</th>
														<th className="thData">Id Dueño</th>
													</tr>
												</thead>
												<tbody>
													{cars.map((car) => {
														const id = `${car._id}`;
														const patente = `${car.patente}`;
														const modelo = `${car.modelo}`;
														const anio = `${car.anio}`;
														const agregados = `${car.agregados}`;
														const historia = `${car.historia}`;
														const tallerAsociado = `${car.tallerAsociado}`;
														const idUsuarioDuenio = `${car.idUsuarioDuenio}`;
														return (
															<tr>
																<td className="tdDataButtons fixedColRow">
																	<button className="btn btn-warning mx-1" onClick={() => selectCar('Editar', car)}>
																		Edit
																	</button>
																	<button className="btn btn-danger mx-1" onClick={() => selectCar('Eliminar', car)}>
																		Delete
																	</button>
																</td>
																<td className="tdData">{id}</td>
																<td className="tdData">{patente}</td>
																<td className="tdData">{modelo}</td>
																<td className="tdData">{anio}</td>
																<td className="tdData">{agregados}</td>
																<td className="tdData">{historia}</td>
																<td className="tdData">{tallerAsociado}</td>
																<td className="tdData">{idUsuarioDuenio}</td>
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
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedCar._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-success" onClick={() => eliminar(selectedCar._id)}>
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
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedCar._id} placeholder="Auto-Incremental ID" />
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
						<label>ID Usuario Dueño</label>
						<select
							className="form-select"
							name="idUsuarioDuenio"
							id="idUsuarioDuenioField"
							onChange={handleChange}
							value={selectedCar.idUsuarioDuenio}
							aria-label="Default select example"
						>
							{users.map((user) => {
								const id = `${user._id}`;
								const nombre = `${user.nombre}`;
								const apellido = `${user.apellido}`;
								return <option value={id}>{`${nombre} ${apellido} | ID: ${id}`}</option>;
							})}
						</select>
						<label>Patente</label>
						<input className="form-control" type="text" maxLength="50" name="patente" id="patenteField" onChange={handleChange} value={selectedCar.patente} />
						<label>Marca & Modelo</label>
						<input className="form-control" type="text" maxLength="100" name="modelo" id="modeloField" onChange={handleChange} value={selectedCar.modelo} />
						<label>Año</label>
						<input className="form-control" type="number" maxLength="10" name="anio" id="anioField" onChange={handleChange} value={selectedCar.anio} />
						<label>Agregados</label>
						<input className="form-control" type="text" maxLength="300" name="agregados" id="agregadosField" onChange={handleChange} value={selectedCar.agregados} />
						<label>Historia</label>
						<input className="form-control" type="text" maxLength="200" name="historia" id="historiaField" onChange={handleChange} value={selectedCar.historia} />
						<label>Taller Mecanico</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="tallerAsociado"
							id="workshopField"
							onChange={handleChange}
							value={selectedCar.tallerAsociado}
						/>
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButton(selectedCar)}
						<button className="btn btn-danger" onClick={() => closeModal()}>
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

export default CarsList;
