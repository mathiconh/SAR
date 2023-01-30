/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import bcrypt from 'bcryptjs';
import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';
import UsersDataService from '../services/users';
import CarsDataService from '../services/cars';
import CarrerasDataService from '../services/carreras';
import Cookies from 'universal-cookie';
import '../App.css';
import defaultImg from '../assets/profilePics/default.png';
import avatar1 from '../assets/profilePics/avatar1.png';
import avatar2 from '../assets/profilePics/avatar2.png';
import avatar3 from '../assets/profilePics/avatar3.png';
import avatar4 from '../assets/profilePics/avatar4.png';
import avatar5 from '../assets/profilePics/avatar5.png';
import avatar6 from '../assets/profilePics/avatar6.png';
import avatar7 from '../assets/profilePics/avatar7.png';
import avatar8 from '../assets/profilePics/avatar8.png';

import { Category, ChartComponent, ColumnSeries, Inject, Legend, DataLabel, SeriesCollectionDirective, SeriesDirective, Tooltip } from '@syncfusion/ej2-react-charts';

const cookies = new Cookies();

const imgObj = {
	avatar1,
	avatar2,
	avatar3,
	avatar4,
	avatar5,
	avatar6,
	avatar7,
	avatar8,
};
const keys = Object.keys(imgObj);
const contraseñaReiniciada = crearContraseñaReinicio(10);

function crearContraseñaReinicio(longitudContraseña) {
	let result = '';
	const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var caracteresLength = caracteres.length;
	for (let i = 0; i < longitudContraseña; i++) {
		result += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
	}
	return result;
}

const MiPerfil = (props) => {
	const initialPerfilState = {
		_id: '',
		apellido: '',
		nombre: '',
		direccion: '',
		correoE: '',
		dni: '',
		telefono: '',
		fechaNac: '',
		profilePic: '',
		idRol: '',
	};
	const [perfil, setPerfil] = useState(initialPerfilState);
	const [newContraseña, setNewContraseña] = useState({
		password: perfil.password,
		newPassword: '',
		newConfirmPassword: '',
	});
	const [genero, setGeneros] = useState([]);
	const [selectedImg, setSelectedImg] = useState(undefined);
	const [userFechaNac, setUserFechaNac] = useState('');
	const [modalEditar, setModalEditar] = useState(false);
	const [modalContraseña, setModalContraseña] = useState(false);
	const [modalReinicioContraseña, setModalReinicioContraseña] = useState(false);
	//vt = Verificación Técnica
	const [vt, setVt] = useState([]);
	const [modalEditarVt, setModalEditarVt] = useState(false);
	const [selectedVt, setSelectedVt] = useState({
		_id: '',
		mataFuego: '',
		traje: '',
		motor: '',
		electricidad: '',
		estado: '',
		idUsuarioDuenio: '',
		idAuto: '',
		fechaUltModif: '',
	});

	//carreras
	const [carreras, setCarreras] = useState([]);
	const [reporte, setReporte] = useState([]);

	//autos
	const [autos, setAutos] = useState([]);
	const [modalEditarAuto, setModalEditarAuto] = useState(false);
	const [modalEliminarAuto, setModalElminarAuto] = useState(false);
	const [validationErrorMessage, setValidationErrorMessage] = useState('');
	const [selectedCar, setSelectedCar] = useState({
		_id: '',
		idUsuarioDuenio: '',
		patente: '',
		modelo: '',
		anio: '',
		agregados: '',
		historia: '',
		tallerAsociado: '',
		idVt: '',
	});

	useEffect(() => {
		getPerfilById(props.match.params._id);
		retrieveUser(props.match.params._id);
		retrieveGeneros();
		getAutos(props.match.params._id);
	}, [props.match.params._id]);

	const getPerfilById = async (_id) => {
		console.log('Buscando data de perfil de: ', _id);

		UsersDataService.get(_id)
			.then(async (response) => {
				console.log('User Profile Data: ', response.data.users[0]);
				const perfilData = response.data.users[0];

				const fechaNacData = new Date(perfilData.fechaNac);
				const fechaNacDay = fechaNacData.getDate() + 1;
				// Be careful! January is 0, not 1
				const fechaNacMonth = fechaNacData.getMonth() + 1;
				const fechaNacYear = fechaNacData.getFullYear();

				setUserFechaNac(`${fechaNacDay}/${fechaNacMonth}/${fechaNacYear}`);

				setPerfil(response.data.users[0]);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveUser = async (_id) => {
		await UsersDataService.get(_id)
			.then((response) => {
				console.log('Data: ', response.data);
				setPerfil(response.data.users[0]);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const retrieveGeneros = async () => {
		await UsersDataService.getAllGen()
			.then((response) => {
				console.log('Data: ', response.data);
				setGeneros([{ nombre: 'Seleccionar Genero' }].concat(response.data.generos));
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPerfil((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleChangeNewPassword = (e) => {
		const { name, value } = e.target;
		setNewContraseña((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const editData = (action, perfil) => {
		console.log('Selected: ', perfil);

		action === 'Editar' ? setModalEditar(true) : setModalContraseña(true);
	};

	const closeModal = () => {
		setSelectedImg(undefined);
		setModalEditar(false);
		setModalContraseña(false);
		setModalReinicioContraseña(false);
		setValidationErrorMessage('');
	};

	const editar = async (perfil) => {
		if (selectedImg) perfil.profilePic = selectedImg;
		const result = await UsersDataService.editUser(perfil, false);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setPerfil(perfil);
			setModalEditar(false);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const openModalReiniciarContraseña = () => {
		setModalContraseña(false);
		setValidationErrorMessage('');
		setModalReinicioContraseña(true);
	};

	const reiniciarContraseña = async () => {
		newContraseña.newPassword = contraseñaReiniciada;
		const newPasswordHash = await bcrypt.hash(newContraseña.newPassword, 8);
		perfil.password = newPasswordHash;
		const result = await UsersDataService.editUser(perfil);

		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setPerfil(perfil);
			setModalReinicioContraseña(false);
			refreshList();
			setNewContraseña({
				password: newPasswordHash,
				newPassword: '',
				newConfirmPassword: '',
			});
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const matchPassword = async (password, hash) => {
		return await bcrypt.compare(password, hash);
	};

	const actualizarContraseña = async (newContraseña) => {
		setValidationErrorMessage('');
		let result = { status: true };

		if (newContraseña.password === '' || newContraseña.newPassword === '' || newContraseña.newConfirmPassword === '') {
			result.status = false;
			result.errorMessage = 'Los campos no pueden estar vacios';
		}

		if (result.status) {
			const match = await matchPassword(newContraseña.password, perfil.password);
			if (!match) {
				result.status = false;
				result.errorMessage = 'La contraseña actual no es correcta';
			} else {
				result.status = true;
				result.errorMessage = '';
			}

			if (result.status && newContraseña.newPassword === newContraseña.newConfirmPassword) {
				result.status = true;
				result.errorMessage = '';
				perfil.password = await bcrypt.hash(newContraseña.newPassword, 8);
			} else if (result.status && newContraseña.newPassword !== newContraseña.newConfirmPassword) {
				result.status = false;
				result.errorMessage = 'La confirmacion de la nueva contraseña no coincide';
			}

			if (result.status) {
				console.log('Actualizando Usuario');
				result.status = true;
				result = await UsersDataService.editUser(perfil);
			}
		}

		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setPerfil(perfil);
			setModalContraseña(false);
			refreshList();
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

	const refreshList = () => {
		getPerfilById(props.match.params._id);
		retrieveUser(props.match.params._id);
		getAutos(props.match.params._id);
	};

	//--------------------------------------------------------------Verificación Técnica--------------------------------------------------

	let setModalButtonVt = (selectedVt) => {
		if (selectedVt._id) {
			return (
				<button className="btn btn-success" onClick={() => editarVt(selectedVt)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-success" onClick={() => completarVt(selectedVt)}>
					Completar
				</button>
			);
		}
	};

	const completarVt = async (selectedVt) => {
		const result = await CarsDataService.completarVt(selectedVt);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			setModalEditarVt(false);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const editarVt = async (selectedVt) => {
		autos.forEach((vt) => {
			if (vt._id === selectedVt._id) {
				vt.mataFuego = selectedVt.mataFuego;
				vt.traje = selectedVt.traje;
				vt.motor = selectedVt.motor;
				vt.electricidad = selectedVt.electricidad;
				vt.estado = selectedVt.estado;
				vt.idUsuarioDuenio = selectedVt.idUsuarioDuenio;
				vt.idAuto = selectedVt.idAuto;
				vt.fechaUltModif = selectedVt.fechaUltModif;
			}
		});
		const result = await CarsDataService.editVt(selectedVt);
		if (result.status) {
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setVt(vt);
			setModalEditarVt(false);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const eliminarVt = (idVt, idAuto) => {
		deleteVt(idVt, idAuto);
		setModalEditarVt(false);
	};

	const deleteVt = async (idVt, idAuto) => {
		console.log('VT to be deleted', idVt, idAuto);
		await CarsDataService.deleteVt(idVt, idAuto)
			.then(() => {
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const selectVt = async (action, car = {}) => {
		if (car.idVt) {
			await CarsDataService.findVt(car.idVt, '_id')
				.then((response) => {
					setVt(response.data.vts[0]);
					setSelectedVt(response.data.vts[0]);
					action === 'EditarVt' ? setModalEditarVt(true) : console.log('first'); //setModalElminarVt(true);
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			setSelectedVt({ idAuto: car._id, idUsuarioDuenio: car.idUsuarioDuenio });
			action === 'EditarVt' ? setModalEditarVt(true) : console.log('first'); //setModalElminarVt(true);
		}
	};

	const handleChangeVt = (e) => {
		const { name, value } = e.target;
		setSelectedVt((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const closeModalVt = () => {
		setModalEditarVt(false);
		setValidationErrorMessage('');
	};

	//--------------------------------------------------------------------auto------------------------------------------------------------

	let getEstadoVt = async (idVt) => {
		if (idVt) {
			return await CarsDataService.findVt(idVt, '_id')
				.then((response) => {
					let estadoVt = true;
					const vt = response.data.vts[0];

					Object.keys(vt).map((datosVtProperty) => {
						if (
							datosVtProperty !== 'idUsuarioDuenio' &&
							datosVtProperty !== '_id' &&
							datosVtProperty !== 'idAuto' &&
							datosVtProperty !== 'tipoModif' &&
							datosVtProperty !== 'fechaUltModif' &&
							datosVtProperty !== 'idUsuarioModif'
						) {
							if (estadoVt === true && vt[datosVtProperty].toLowerCase() === 'si') {
								estadoVt = true;
							} else if (vt[datosVtProperty].toLowerCase() === 'no') {
								estadoVt = false;
							}
						}
					});
					return estadoVt ? 'Verificacion OK' : 'Verificacion NO OK';
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			console.log('No tiene VT');
			return 'No Verificado';
		}
	};

	const getAutos = async (_id) => {
		await CarsDataService.find(_id, 'idUsuarioDuenio')
			.then(async (response) => {
				console.log('autos tiene', response.data.cars);
				await Promise.all(
					response.data.cars.map(async (car) => {
						const estadoVt = await getEstadoVt(car.idVt);
						console.log('Resultado Estado VT: ', estadoVt);
						car.estadoVt = estadoVt;
					})
				);
				setAutos(response.data.cars);
			})
			.catch((e) => {
				console.log(e);
			});

		await CarsDataService.findVt(_id, 'idVt')
			.then((response) => {
				console.log('vt tiene', response.data.vts);
				setVt(response.data.vts);
			})
			.catch((e) => {
				console.log(e);
			});

		await CarrerasDataService.findCarreras(_id)
			.then((response) => {
				console.log('carreras tiene', response.data.sprints);
				console.log('reporte tiene', response.data.reporte);
				const sprintsOrdenados = response.data.sprints.slice().sort((a, b) => new Date(b.fechaSprint) - new Date(a.fechaSprint));
				setCarreras(sprintsOrdenados);
				setReporte(response.data.reporte);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const selectCar = (action, car = {}) => {
		console.log('Selected: ', car);
		setSelectedCar(car);
		action === 'EditarAuto' ? setModalEditarAuto(true) : setModalElminarAuto(true);
	};

	const handleChangeAuto = (e) => {
		const { name, value } = e.target;
		setSelectedCar((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const editarAuto = async (selectedCar) => {
		const result = await CarsDataService.editCar(selectedCar);
		if (result.status) {
			autos.forEach((car) => {
				if (car._id === selectedCar._id) {
					car.patente = selectedCar.patente;
					car.modelo = selectedCar.modelo;
					car.anio = selectedCar.anio;
					car.agregados = selectedCar.agregados;
					car.historia = selectedCar.historia;
					car.tallerAsociado = selectedCar.tallerAsociado;
					car.idUsuarioDuenio = selectedCar.idUsuarioDuenio;
					car.idVt = selectedCar.idVt;
				}
			});
			console.log('Edicion exitosa');
			setValidationErrorMessage('');
			setAutos(autos);
			setModalEditarAuto(false);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const crearAuto = async (selectedCar) => {
		selectedCar.idUsuarioDuenio = props.match.params._id;
		const result = await CarsDataService.createCar(selectedCar);
		if (result?.status) {
			console.log('creación exitosa');
			setValidationErrorMessage('');
			setModalEditarAuto(false);
			getAutos(props.match.params._id);
			refreshList();
		} else {
			setValidationErrorMessage(result?.errorMessage);
		}
	};

	const eliminarAuto = (carId) => {
		deleteCar(carId);
		setModalElminarAuto(false);
	};

	const deleteCar = async (carId) => {
		console.log('Car to be deleted', carId);
		await CarsDataService.deleteCar(carId)
			.then(() => {
				getAutos(props.match.params._id);
				refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const accionesPorSesionAutoCards = (car) => {
		if (cookies.get('idRol') === '1') {
			return (
				<div className="container">
					<button className="btn btn-warning col-5 mx-1" onClick={() => selectCar('EditarAuto', car)}>
						Editar
					</button>
					<button className="btn btn-danger col-5 mx-1" onClick={() => selectCar('Eliminar', car)}>
						Borrar
					</button>
					<br></br>
					<button className="btn btn-secondary col-11 mt-1" onClick={() => selectVt('EditarVt', car)}>
						Verificación Técnica
					</button>
				</div>
			);
		} else if (cookies.get('_id') === props.match.params._id) {
			return (
				<div className="container">
					<button className="btn btn-warning col-5 mx-1" onClick={() => selectCar('EditarAuto', car)}>
						Editar
					</button>
					<button className="btn btn-danger col-5 mx-1" onClick={() => selectCar('Eliminar', car)}>
						Borrar
					</button>
				</div>
			);
		} else {
			return <div></div>;
		}
	};

	let setModalButtonAuto = (selectedCar) => {
		if (selectedCar._id) {
			return (
				<button className="btn btn-success" onClick={() => editarAuto(selectedCar)}>
					Actualizar
				</button>
			);
		} else {
			return (
				<button className="btn btn-success" onClick={() => crearAuto(selectedCar)}>
					Crear
				</button>
			);
		}
	};

	const closeModalAuto = () => {
		setModalEditarAuto(false);
		setValidationErrorMessage('');
	};

	let idRolCampos = () => {
		if (cookies.get('idRol') === '1') {
			return (
				<div>
					<label>Id Rol</label>
					<input
						className="form-control"
						type="text"
						placeholder="Puede elegir entre Rol 1 o 2"
						name="idRol"
						id="idRolField"
						onChange={handleChange}
						value={perfil.idRol}
					/>
				</div>
			);
		}
	};

	const getIdVerContrincante = (idUsuarioP1, idUsuarioP2) => {
		if (cookies.get('_id') === idUsuarioP1) {
			return idUsuarioP2;
		} else {
			return idUsuarioP1;
		}
	};

	if (perfil._id === cookies.get('_id') || cookies.get('idRol') === '1') {
		return (
			<div className="App">
				<div className="container-fluid">
					<div className="d-flex vh-85 p-2 justify-content-center align-self-center">
						<div className="container-fluid align-self-center col card sombraCard form-perfil">
							<div className="table">
								<div className="table-wrapper">
									<div className="table-title">
										<div className="row">
											<div className="card-body">
												<div className="row align-items-center">
													<img className="col-lg-6" src={perfil.profilePic ? imgObj[perfil.profilePic] : defaultImg} alt="Imagen de perfil" />
													<div className="col-lg-6">
														<div className="d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
															<h3 className="h2 text-black mb-0">
																{perfil.nombre} {perfil.apellido}
															</h3>
														</div>
														<hr className="rounded"></hr>
														<ul className="list-unstyled mb-1-9">
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Dirección:</span>
																{perfil.direccion}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Telefono:</span> {perfil.telefono}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Email:</span> {perfil.correoE}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">DNI:</span> {perfil.dni}
															</li>
															<li className="display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Fecha de nacimiento:</span> {perfil.fechaNac}
															</li>
															<br></br>
															<li>
																<button className="btn btn-primary" onClick={() => editData('Editar', perfil)}>
																	Editar datos
																</button>
																<br></br>
																<br></br>
																<a className="btn btn-warning" href="#graficos">
																	Performance
																</a>
																<br></br>
																<br></br>
																<button className="btn btn-secondary" onClick={() => editData('Contraseña', perfil)}>
																	Cambiar Contraseña
																</button>
																<br></br>
																<br></br>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
									<hr className="rounded"></hr>
									<div>
										<div className="container-fluid">
											<div className="col-lg-12 align-self-start w-auto">
												<div className="row">
													<div className="row">
														<div className="col-sm-4">
															<h2>
																Administrá tus <b>Autos</b>
															</h2>
															<button className="btn btn-success mb-2 d-flex" onClick={() => selectCar('EditarAuto')}>
																Añadir un nuevo Auto
															</button>
														</div>
														<br></br>
													</div>
													{autos.map((selectedCar) => {
														const id = `${selectedCar._id}`;
														const patente = `${selectedCar.patente}`;
														const modelo = `${selectedCar.modelo}`;
														const anio = `${selectedCar.anio}`;
														const agregados = `${selectedCar.agregados}`;
														const historia = `${selectedCar.historia}`;
														const tallerAsociado = `${selectedCar.tallerAsociado}`;
														const estadoVt = `${selectedCar.estadoVt}`;
														return (
															<div className="col-lg-4 pb-1">
																<div className="card">
																	<div className="card-body">
																		<h5 className="card-title">Patente: {patente}</h5>
																		<p className="card-text">
																			<strong>Marca & Modelo: </strong>
																			{modelo}
																			<br />
																			<strong>Año: </strong>
																			{anio}
																			<br />
																			<strong>Agregados: </strong>
																			{agregados}
																			<br />
																			<strong>Historia: </strong>
																			{historia}
																			<br />
																			<strong>Taller Mecánico: </strong>
																			{tallerAsociado}
																			<br />
																			<strong>Verificación Técnica: </strong>
																			{estadoVt}
																			<br />
																			<strong>Id: </strong>
																			{id}
																			<br />
																		</p>
																		<div className="container">{accionesPorSesionAutoCards(selectedCar)}</div>
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</div>
									</div>
									<hr className="rounded"></hr>

									<div>
										<div className="container-fluid">
											<div className="table">
												<div className="table-wrapper">
													<div className="table-title">
														<div className="row">
															<div className="col-sm-6 w-auto">
																<h2>Tus Carreras</h2>
															</div>
														</div>
													</div>
													<div className="overflowAuto">
														<div className="container-fluid divTableABMCarsAdmin">
															<table className="table table-responsive table-striped w-auto table-hover tableData">
																<thead>
																	<tr>
																		<th className="thData fixedColHead">Acciones</th>
																		<th className="thData">Usuario 1</th>
																		<th className="thData">Vehiculo 1</th>
																		<th className="thData">Reacción</th>
																		<th className="thData">Tiempo 100 mts</th>
																		<th className="thData">Tiempo Llegada</th>
																		<th className="thData">Usuario 2</th>
																		<th className="thData">Vehiculo 2</th>
																		<th className="thData">Reacción</th>
																		<th className="thData">Tiempo 100 mts</th>
																		<th className="thData">Tiempo Llegada</th>
																		<th className="thData">ID Evento</th>
																	</tr>
																</thead>
																<tbody>
																	{carreras.map((selectedCarrera) => {
																		const idUsuarioP1 = `${selectedCarrera.idUsuarioP1}`;
																		const idUsuarioP2 = `${selectedCarrera.idUsuarioP2}`;
																		const idVehiculoP1 = `${selectedCarrera.idVehiculoP1}`;
																		const idVehiculoP2 = `${selectedCarrera.idVehiculoP2}`;
																		const reaccionP1 = `${selectedCarrera.reaccionP1}`;
																		const reaccionP2 = `${selectedCarrera.reaccionP2}`;
																		const tiempo100mtsP1 = `${selectedCarrera.tiempo100mtsP1}`;
																		const tiempo100mtsP2 = `${selectedCarrera.tiempo100mtsP2}`;
																		const tiempoLlegadaP1 = `${selectedCarrera.tiempoLlegadaP1}`;
																		const tiempoLlegadaP2 = `${selectedCarrera.tiempoLlegadaP2}`;
																		const idEvento = `${selectedCarrera.idEvento}`;
																		return (
																			<tr>
																				<td className="tdData fixedColRow">
																					<a
																						className="btn btn-primary mx-1"
																						href={
																							'/miperfil/' +
																							getIdVerContrincante(selectedCarrera.idUsuarioP1, selectedCarrera.idUsuarioP2)
																						}
																					>
																						Ver Contrincante
																					</a>
																				</td>
																				<td className="tdData">{idUsuarioP1}</td>
																				<td className="tdData">{idVehiculoP1}</td>
																				<td className="tdData">{reaccionP1}</td>
																				<td className="tdData">{tiempo100mtsP1}</td>
																				<td className="tdData">{tiempoLlegadaP1}</td>
																				<td className="tdData">{idUsuarioP2}</td>
																				<td className="tdData">{idVehiculoP2}</td>
																				<td className="tdData">{reaccionP2}</td>
																				<td className="tdData">{tiempo100mtsP2}</td>
																				<td className="tdData">{tiempoLlegadaP2}</td>
																				<td className="tdData">{idEvento}</td>
																			</tr>
																		);
																	})}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
											<div id="graficos">
												<hr className="rounded"></hr>
												<ChartComponent
													id="chartsReaccion"
													tooltip={{ enable: true }}
													primaryXAxis={{ valueType: 'Category', title: 'Auto' }}
													primaryYAxis={{ title: 'Tiempo' }}
													title="Promedio de Tiempo de Reaccion por Auto"
												>
													<Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]} />
													<SeriesCollectionDirective>
														<SeriesDirective dataSource={reporte} xName="auto" yName="avgReaccion" type="Column" fill="red"></SeriesDirective>
													</SeriesCollectionDirective>
												</ChartComponent>
												<hr className="rounded"></hr>
												<ChartComponent
													id="chartsCien"
													tooltip={{ enable: true }}
													primaryXAxis={{ valueType: 'Category', title: 'Auto' }}
													primaryYAxis={{ title: 'Tiempo' }}
													title="Promedio de Tiempo de 100mts por Auto"
												>
													<Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]} />
													<SeriesCollectionDirective>
														<SeriesDirective dataSource={reporte} xName="auto" yName="avgCien" type="Column" fill="#fbb00e"></SeriesDirective>
													</SeriesCollectionDirective>
												</ChartComponent>
												<hr className="rounded"></hr>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal isOpen={modalEditarAuto}>
					<ModalBody>
						<label>ID Auto</label>
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedCar._id} placeholder="ID Auto-Incremental" />
						<label>Patente</label>
						<input className="form-control" type="text" maxLength="10" name="patente" id="patenteField" onChange={handleChangeAuto} value={selectedCar.patente} />
						<label>Marca & Modelo</label>
						<input className="form-control" type="text" maxLength="50" name="modelo" id="modeloField" onChange={handleChangeAuto} value={selectedCar.modelo} />
						<label>Año</label>
						<input className="form-control" type="number" maxLength="4" name="anio" id="anioField" onChange={handleChangeAuto} value={selectedCar.anio} />
						<label>Agregados</label>
						<input
							className="form-control"
							type="text"
							maxLength="300"
							name="agregados"
							id="agregadosField"
							onChange={handleChangeAuto}
							value={selectedCar.agregados}
						/>
						<label>Historia</label>
						<input className="form-control" type="text" maxLength="200" name="historia" id="historiaField" onChange={handleChangeAuto} value={selectedCar.historia} />
						<label>Taller Mecánico</label>
						<input
							className="form-control"
							type="text"
							maxLength="50"
							name="tallerAsociado"
							id="workshopField"
							onChange={handleChangeAuto}
							value={selectedCar.tallerAsociado}
						/>
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButtonAuto(selectedCar)}
						<button className="btn btn-danger" onClick={() => closeModalAuto()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEditarVt}>
					<ModalBody>
						<label>ID VT</label>
						<input className="form-control" readOnly type="text" name="id" id="idField" value={selectedVt._id} placeholder="ID Auto-Incremental" />
						<label>Matafuegos</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="50"
							name="mataFuego"
							id="mataFuegoField"
							onChange={handleChangeVt}
							value={selectedVt.mataFuego}
						/>
						<label>Traje</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="50"
							name="traje"
							id="trajeField"
							onChange={handleChangeVt}
							value={selectedVt.traje}
						/>
						<label>Motor</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="100"
							name="motor"
							id="motorField"
							onChange={handleChangeVt}
							value={selectedVt.motor}
						/>
						<label>Electricidad</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="300"
							name="electricidad"
							id="electricidadField"
							onChange={handleChangeVt}
							value={selectedVt.electricidad}
						/>
						<label>Estado</label>
						<input
							className="form-control"
							type="text"
							placeholder="Valores permitidos: Si | No"
							maxLength="300"
							name="estado"
							id="estadoField"
							onChange={handleChangeVt}
							value={selectedVt.estado}
						/>
						<label>Fecha de la última modificación</label>
						<input
							className="form-control"
							readOnly
							type="text"
							maxLength="200"
							name="fechaUltModif"
							id="fechaUltModifField"
							placeholder="Fecha ultima modificacion"
							value={selectedVt.fechaUltModif}
						/>
						<label>ID Dueño del auto</label>
						<input
							className="form-control"
							readOnly
							type="text"
							maxLength="200"
							name="idUsuarioDuenio"
							id="idUsuarioDuenioField"
							placeholder="ID Dueño"
							value={selectedVt.idUsuarioDuenio}
						/>
						<label>ID Auto</label>
						<input className="form-control" readOnly type="text" maxLength="50" name="idAuto" id="idAutoField" placeholder="ID Auto" value={selectedVt.idAuto} />
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						{setModalButtonVt(selectedVt)}
						<button className="btn btn-danger" onClick={() => eliminarVt(selectedVt._id, selectedVt.idAuto)}>
							Borrar Verificación Técnica
						</button>
						<button className="btn btn-danger" onClick={() => closeModalVt()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEliminarAuto}>
					<ModalBody>Estás seguro que deseas eliminar el registro? Id: {selectedCar._id}</ModalBody>
					<ModalFooter>
						<button className="btn btn-success" onClick={() => eliminarAuto(selectedCar._id)}>
							Sí
						</button>
						<button className="btn btn-danger" onClick={() => setModalElminarAuto(false)}>
							No
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalEditar}>
					<ModalBody>
						<label>Nombre</label>
						<input className="form-control" type="text" maxLength="50" name="nombre" id="nombreField" onChange={handleChange} value={perfil.nombre} />
						<label>Apellido</label>
						<input className="form-control" type="text" maxLength="50" name="apellido" id="apellidoField" onChange={handleChange} value={perfil.apellido} />
						<div className="container">
							<p>Elegí una imagen de perfil</p>
							<div className="imgContainer">
								{keys.map((imageName, index) => (
									<img
										key={index}
										src={imgObj[imageName]}
										alt={`Profile ${index}`}
										width="20%"
										style={{
											border: selectedImg === imageName ? '4px solid purple' : '',
										}}
										onClick={() => setSelectedImg(imageName)}
									></img>
								))}
							</div>
						</div>
						{idRolCampos()}
						<label>Dirección</label>
						<input className="form-control" type="text" maxLength="50" name="direccion" id="direccionField" onChange={handleChange} value={perfil.direccion} />
						<label>Telefono</label>
						<input className="form-control" type="number" maxLength="100" name="telefono" id="telefonoField" onChange={handleChange} value={perfil.telefono} />
						<label>Email</label>
						<input className="form-control" type="text" maxLength="50" name="correoE" id="correoEField" onChange={handleChange} value={perfil.correoE} />
						<label>DNI</label>
						<input className="form-control" type="number" maxLength="300" name="dni" id="dniField" onChange={handleChange} value={perfil.dni} />
						<label>Fecha de nacimiento</label>
						<input className="form-control" type="date" maxLength="200" name="fechaNac" id="fechaNacField" onChange={handleChange} value={perfil.fechaNac} />
						<label>Genero</label>
						<select className="form-select" name="idGenero" id="idGeneroField" onChange={handleChange} value={perfil.idGenero} aria-label="Default select example">
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
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						<button className="btn btn-success" onClick={() => editar(perfil)}>
							Actualizar
						</button>
						<button className="btn btn-danger" onClick={() => closeModal()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalContraseña}>
					<ModalBody>
						<label>Contraseña Actual</label>
						<input className="form-control" type="password" maxLength="200" name="password" id="passwordField" onChange={handleChangeNewPassword} />
						<label>Contraseña Nueva</label>
						<input className="form-control" type="password" maxLength="200" name="newPassword" id="newPasswordField" onChange={handleChangeNewPassword} />
						<label>Confirme la nueva contraseña</label>
						<input className="form-control" type="password" maxLength="200" name="newConfirmPassword" id="newconfirmPasswordField" onChange={handleChangeNewPassword} />
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						<button className="btn btn-success" onClick={() => actualizarContraseña(newContraseña)}>
							Actualizar
						</button>
						<button className="btn btn-warning" onClick={() => openModalReiniciarContraseña()}>
							Reiniciar Contraseña
						</button>
						<button className="btn btn-danger" onClick={() => closeModal()}>
							Cancelar
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={modalReinicioContraseña}>
					<ModalBody>
						<h1>Esta seguro de que desea reiniciar la contraseña?</h1>
						<p>
							La contraseña sera reiniciada a: <strong>{`${contraseñaReiniciada}`}</strong>
						</p>
						<p>
							<strong>No pierdas esta contraseña</strong> o no podras ingresar al sistema por tu cuenta
						</p>
						<small className="form-text text-muted">Esta accion no puede deshacerse y luego es recomendable cambiarla manualmente.</small>
					</ModalBody>
					<ModalFooter>
						{buildErrorMessage()}
						<button className="btn btn-success" onClick={() => reiniciarContraseña(newContraseña)}>
							Confirmar
						</button>
						<button className="btn btn-danger" onClick={() => closeModal()}>
							Cancelar
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
						<div className="container-fluid align-self-center col card sombraCard form-perfil">
							<div className="table">
								<div className="table-wrapper">
									<div className="table-title">
										<div className="row">
											<div className="card-body">
												<div className="row align-items-center">
													<img className="col-lg-6" src={perfil.profilePic ? imgObj[perfil.profilePic] : defaultImg} alt="Imagen de Perfil" />
													<div className="col-lg-6">
														<div className="d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
															<h3 className="h2 text-black mb-0">
																{perfil.nombre} {perfil.apellido}
															</h3>
														</div>
														<hr className="rounded"></hr>
														<ul className="list-unstyled mb-1-9">
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Dirección:</span>
																{perfil.direccion}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Telefono:</span> {perfil.telefono}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Email:</span> {perfil.correoE}
															</li>
															<li className="mb-2 mb-xl-3 display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">DNI:</span> {perfil.dni}
															</li>
															<li className="display-28">
																<span className="display-26 text-secondary me-2 font-weight-600">Fecha de nacimiento:</span> {userFechaNac}
															</li>
															<br></br>
															<li>
																<a className="btn btn-warning" href="#graficos">
																	Performance
																</a>
																<br></br>
																<br></br>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
									<hr className="rounded"></hr>
									<div>
										<div className="container-fluid">
											<div className="col-lg-12 align-self-center w-auto">
												<div className="row">
													<div className="row">
														<div className="col-sm-4">
															<h2>
																Administrá tus <b>Autos</b>
															</h2>
														</div>
														<br></br>
													</div>
													<hr className="rounded"></hr>
													{autos.map((selectedCar) => {
														const id = `${selectedCar._id}`;
														const patente = `${selectedCar.patente}`;
														const modelo = `${selectedCar.modelo}`;
														const anio = `${selectedCar.anio}`;
														const agregados = `${selectedCar.agregados}`;
														const historia = `${selectedCar.historia}`;
														const tallerAsociado = `${selectedCar.tallerAsociado}`;
														const estadoVt = `${selectedCar.estadoVt}`;
														return (
															<div className="col-lg-4 pb-1">
																<div className="card">
																	<div className="card-body">
																		<h5 className="card-title">Patente: {patente}</h5>
																		<p className="card-text">
																			<strong>Marca & Modelo: </strong>
																			{modelo}
																			<br />
																			<strong>Año: </strong>
																			{anio}
																			<br />
																			<strong>Agregados: </strong>
																			{agregados}
																			<br />
																			<strong>Historia: </strong>
																			{historia}
																			<br />
																			<strong>Taller Mecánico: </strong>
																			{tallerAsociado}
																			<br />
																			<strong>Verificación Técnica: </strong>
																			{estadoVt}
																			<br />
																			<strong>Id: </strong>
																			{id}
																			<br />
																		</p>
																		<div className="container">{accionesPorSesionAutoCards(selectedCar)}</div>
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</div>
									</div>
									<hr className="rounded"></hr>

									<div>
										<div className="container-fluid">
											<div className="table">
												<div className="table-wrapper">
													<div className="table-title">
														<div className="row">
															<div className="col-sm-6 w-auto">
																<h2>Tus Carreras</h2>
															</div>
														</div>
													</div>
													<div className="overflowAuto">
														<div className="container-fluid divTableABMCarsAdmin">
															<table className="table table-responsive table-striped w-auto table-hover tableData">
																<thead>
																	<tr>
																		<th className="thData fixedColHead">Acciones</th>
																		<th className="thData">Usuario 1</th>
																		<th className="thData">Vehiculo 1</th>
																		<th className="thData">Reacción</th>
																		<th className="thData">Tiempo 100 mts</th>
																		<th className="thData">Tiempo Llegada</th>
																		<th className="thData">Usuario 2</th>
																		<th className="thData">Vehiculo 2</th>
																		<th className="thData">Reacción</th>
																		<th className="thData">Tiempo 100 mts</th>
																		<th className="thData">Tiempo Llegada</th>
																		<th className="thData">ID Evento</th>
																	</tr>
																</thead>
																<tbody>
																	{carreras.map((selectedCarrera) => {
																		const idUsuarioP1 = `${selectedCarrera.idUsuarioP1}`;
																		const idUsuarioP2 = `${selectedCarrera.idUsuarioP2}`;
																		const idVehiculoP1 = `${selectedCarrera.idVehiculoP1}`;
																		const idVehiculoP2 = `${selectedCarrera.idVehiculoP2}`;
																		const reaccionP1 = `${selectedCarrera.reaccionP1}`;
																		const reaccionP2 = `${selectedCarrera.reaccionP2}`;
																		const tiempo100mtsP1 = `${selectedCarrera.tiempo100mtsP1}`;
																		const tiempo100mtsP2 = `${selectedCarrera.tiempo100mtsP2}`;
																		const tiempoLlegadaP1 = `${selectedCarrera.tiempoLlegadaP1}`;
																		const tiempoLlegadaP2 = `${selectedCarrera.tiempoLlegadaP2}`;
																		const idEvento = `${selectedCarrera.idEvento}`;
																		return (
																			<tr>
																				<td className="tdData fixedColRow">
																					<a
																						className="btn btn-primary mx-1"
																						href={
																							'/miperfil/' +
																							getIdVerContrincante(selectedCarrera.idUsuarioP1, selectedCarrera.idUsuarioP2)
																						}
																					>
																						Ver Contrincante
																					</a>
																				</td>
																				<td className="tdData">{idUsuarioP1}</td>
																				<td className="tdData">{idVehiculoP1}</td>
																				<td className="tdData">{reaccionP1}</td>
																				<td className="tdData">{tiempo100mtsP1}</td>
																				<td className="tdData">{tiempoLlegadaP1}</td>
																				<td className="tdData">{idUsuarioP2}</td>
																				<td className="tdData">{idVehiculoP2}</td>
																				<td className="tdData">{reaccionP2}</td>
																				<td className="tdData">{tiempo100mtsP2}</td>
																				<td className="tdData">{tiempoLlegadaP2}</td>
																				<td className="tdData">{idEvento}</td>
																			</tr>
																		);
																	})}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
											<div id="graficos">
												<hr className="rounded"></hr>
												<ChartComponent
													id="chartsReaccion"
													tooltip={{ enable: true }}
													primaryXAxis={{ valueType: 'Category', title: 'Auto' }}
													primaryYAxis={{ title: 'Tiempo' }}
													title="Promedio de Tiempo de Reaccion por Auto"
												>
													<Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]} />
													<SeriesCollectionDirective>
														<SeriesDirective dataSource={reporte} xName="auto" yName="avgReaccion" type="Column" fill="red"></SeriesDirective>
													</SeriesCollectionDirective>
												</ChartComponent>
												<hr className="rounded"></hr>
												<ChartComponent
													id="chartsCien"
													tooltip={{ enable: true }}
													primaryXAxis={{ valueType: 'Category', title: 'Auto' }}
													primaryYAxis={{ title: 'Tiempo' }}
													title="Promedio de Tiempo de 100mts por Auto"
												>
													<Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]} />
													<SeriesCollectionDirective>
														<SeriesDirective dataSource={reporte} xName="auto" yName="avgCien" type="Column" fill="#fbb00e"></SeriesDirective>
													</SeriesCollectionDirective>
												</ChartComponent>
												<hr className="rounded"></hr>
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
	}
};

export default MiPerfil;
