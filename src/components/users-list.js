/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import UserDataService from '../services/users';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const UsersList = () => {
	const getUserKeys = () => {
		if (cookies.get('_id') && cookies.get('idRol') === '1') {
			return {
				_id: '',
				apellido: '',
				correoE: '',
				direccion: '',
				dni: '',
				fechaNac: '',
				idRol: '',
				nombre: '',
				telefono: '',
			};
		} else {
			return {
				_id: '',
				apellido: '',
				correoE: '',
				direccion: '',
				dni: '',
				fechaNac: '',
				nombre: '',
				telefono: '',
			};
		}
	};

	const [users, setUsers] = useState([]);
	const [genero, setGeneros] = useState([]);
	const [selectedUser, setSelectedUser] = useState({
		_id: '',
		apellido: '',
		correoE: '',
		direccion: '',
		dni: '',
		fechaNac: '',
		idRol: '',
		genero: '',
		nombre: '',
		password: '',
		telefono: '',
	});
	const [modalCrear, setModalCrear] = useState(false);
	const [modalEliminar, setModalEliminar] = useState(false);

	const [searchParam, setSearchParam] = useState('_id');
	const [searchValue, setSearchValue] = useState('');
	const [searchableParams] = useState(Object.keys(getUserKeys()));
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [idRols, setIdRoles] = useState(['All IdRoles']);

	useEffect(() => {
		retrieveUsers();
		retrieveIdRol();
		retrieveGeneros();
	}, []);

	const onChangeSearchParam = (e) => {
		const searchParam = e.target.value;
		setSearchParam(searchParam);
	};

	const onChangeSearchValue = (e) => {
		const searchValue = e.target.value;
		setSearchValue(searchValue);
	};

	const retrieveUsers = () => {
		UserDataService.getAll()
			.then((response) => {
				setUsers(response.data.users);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveGeneros = async () => {
		await UserDataService.getAllGen()
			.then((response) => {
				console.log('Data: ', response.data);
				setGeneros([{ nombre: 'Seleccionar Genero' }].concat(response.data.generos));
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveIdRol = () => {
		UserDataService.getIdRol()
			.then((response) => {
				console.log('Resultados: ', response.data);
				setIdRoles(['All IdRoles'].concat(response.data));
				console.log('roles: ' + idRols);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const refreshList = () => {
		retrieveUsers();
	};

	const find = async (query, by) => {
		await UserDataService.find(query, by)
			.then((response) => {
				console.log(response.data);
				if (!response.data.users.length) {
					alert(`No se encontraron datos para la busqueda de ${by} con valor ${query}`);
				}
				setUsers(response.data.users);
			})
			.catch((e) => {
				console.log(e);
				alert(`No se pudo realizar la busqueda de datos para ${by} con valor ${query}`);
			});
	};

	const findByParam = () => {
		find(searchValue, searchParam);
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

	const selectUser = (action, user = {}) => {
		console.log('Selected: ', user);
		setSelectedUser(user);

		action === 'Crear' ? setModalCrear(true) : setModalEliminar(true);
	};

	const crear = async (selectedUser) => {
		const result = await UserDataService.createUser(selectedUser);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			retrieveUsers();
			setModalCrear(false);
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const eliminar = async (selectedUser) => {
		console.log('esto tiene de id:' + selectedUser);
		deleteUser(selectedUser);
		setModalEliminar(false);
	};

	const deleteUser = async (_id) => {
		await UserDataService.deleteUser(_id)
			.then(() => {
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSelectedUser((prevState) => ({
			...prevState,
			[name]: value,
		}));
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
													Administrar <b>Usuarios</b>
												</h2>
											</div>
											<div className="input-group">
												<input
													type="text"
													className="form-control w-75"
													placeholder="Buscar usuario por "
													value={searchValue}
													onChange={onChangeSearchValue}
												/>
												<select className="form-select" onChange={onChangeSearchParam}>
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
												<button className="btn btn-success" onClick={() => selectUser('Crear')}>
													Añadir un nuevo Usuario
												</button>
											</div>
										</div>
										<div className="col-lg-12 align-self-center">
											<div className="row">
												{users.map((user) => {
													const id = `${user._id}`;
													const nombre = `${user.nombre}`;
													const apellido = `${user.apellido}`;
													const idRol = `${user.idRol}`;
													const direccion = `${user.direccion}`;
													const email = `${user.correoE}`;
													return (
														<div className="col-lg-4 pb-1">
															<div className="card">
																<div className="card-body">
																	<h5 className="card-title">{`${user.nombre} ${user.apellido}`}</h5>
																	<p className="card-text">
																		<strong>ID: </strong>
																		{id}
																		<br />
																		<strong>Nombre: </strong>
																		{nombre}
																		<br />
																		<strong>Apellido: </strong>
																		{apellido}
																		<br />
																		<strong>Dirección: </strong>
																		{direccion}
																		<br />
																		<strong>Email: </strong>
																		{email}
																		<br />
																		<strong>ID Rol: </strong>
																		{idRol}
																		<br />
																	</p>
																	<div className="row col-lg-12">
																		<Link to={'/miperfil/' + user._id} className="btn btn-warning mx-2 mt-1">
																			Ver Usuario
																		</Link>
																		<button className="btn btn-danger mx-2 mt-1" onClick={() => selectUser('Eliminar', user)}>
																			Borrar
																		</button>
																	</div>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Modal isOpen={modalCrear}>
					<ModalBody>
						<label>ID</label>
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedUser._id} placeholder="Auto-Incremental ID" />
						<label>Nombre</label>
						<input className="form-control" type="text" maxLength="300" name="nombre" id="nombreField" onChange={handleChange} value={selectedUser.nombre} />
						<label>Apellido</label>
						<input className="form-control" type="text" maxLength="50" name="apellido" id="apellidoField" onChange={handleChange} value={selectedUser.apellido} />
						<label>Correo Electronico</label>
						<input className="form-control" type="text" maxLength="50" name="correoE" id="correoEField" onChange={handleChange} value={selectedUser.correoE} />
						<label>Dirección</label>
						<input className="form-control" type="text" maxLength="100" name="direccion" id="direccionField" onChange={handleChange} value={selectedUser.direccion} />
						<label>DNI</label>
						<input className="form-control" type="number" maxLength="10" name="dni" id="dniField" onChange={handleChange} value={selectedUser.dni} />
						<label>Fecha De Nacimiento</label>
						<input className="form-control" type="date" maxLength="300" name="fechaNac" id="fechaNacField" onChange={handleChange} value={selectedUser.fechaNac} />
						<label>ID Rol</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: 1 | 2"
							maxLength="200"
							name="idRol"
							id="idRolField"
							onChange={handleChange}
							value={selectedUser.idRol}
						/>
						<label>Genero</label>
						<select
							className="form-select"
							name="idGenero"
							id="idGeneroField"
							onChange={handleChange}
							value={selectedUser.idGenero}
							aria-label="Default select example"
						>
							{genero.map((genero) => {
								const id = `${genero.idGenero}`;
								const nombre = `${genero.nombre}`;
								return (
									<option key={id} value={id}>
										{nombre}
									</option>
								);
							})}
						</select>
						<label>Contraseña</label>
						<input className="form-control" type="password" maxLength="200" name="password" id="passwordField" onChange={handleChange} value={selectedUser.password} />
						<label>Telefono</label>
						<input className="form-control" type="text" maxLength="50" name="telefono" id="telefonoField" onChange={handleChange} value={selectedUser.telefono} />
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						<button className="btn btn-success" onClick={() => crear(selectedUser)}>
							Crear
						</button>
						<button className="btn btn-danger" onClick={() => setModalCrear(false)}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEliminar}>
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedUser._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-success" onClick={() => eliminar(selectedUser._id)}>
							Sí
						</button>
						<button className="btn btn-danger" onClick={() => setModalEliminar(false)}>
							No
						</button>
					</ModalFooter>
				</Modal>
			</div>
		);
	} else if (cookies.get('_id') && cookies.get('idRol') === '2') {
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
													<b>Usuarios</b>
												</h2>
											</div>
											<div className="input-group">
												<input
													type="text"
													className="form-control w-auto"
													placeholder="Buscar usuario por "
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
										</div>
										<div className="col-lg-12 align-self-center">
											<div className="row">
												{users.map((user) => {
													const id = `${user._id}`;
													const nombre = `${user.nombre}`;
													const apellido = `${user.apellido}`;
													const direccion = `${user.direccion}`;
													const email = `${user.correoE}`;
													return (
														<div className="col-lg-4 pb-1">
															<div className="card">
																<div className="card-body">
																	<h5 className="card-title">{`${user.nombre} ${user.apellido}`}</h5>
																	<p className="card-text">
																		<strong>ID: </strong>
																		{id}
																		<br />
																		<strong>Nombre: </strong>
																		{nombre}
																		<br />
																		<strong>Apellido: </strong>
																		{apellido}
																		<br />
																		<strong>Dirección: </strong>
																		{direccion}
																		<br />
																		<strong>Email: </strong>
																		{email}
																	</p>
																	<div className="row col-lg-12">
																		<Link to={'/miperfil/' + user._id} className="btn btn-warning mx-2 mt-1">
																			Ver Usuario
																		</Link>
																	</div>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
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

export default UsersList;
