import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Inicio from './components/inicio';
import Login from './components/login';
import ErrorPage from './components/errorPage';
import UsersList from './components/users-list';
import CarsList from './components/cars-list';
import InscripcionesList from './components/inscripciones-list';
import MiPerfil from './components/miPerfil';
import Inscripcion from './components/inscripcion';
import Sprints from './components/sprints-list';
import Eventos from './components/eventos-list';
import Clases from './components/clases-list';
import Cookies from 'universal-cookie';
import './styles/inicio.css';
import './styles/buttons.css';
import Logo from './assets/otherPics/LogoS4Rok.png';
import thunderstorm from './assets/icons/thunderstorms-rain.svg';
import drizzle from './assets/icons/drizzle.svg';
import rain from './assets/icons/rain.svg';
import snow from './assets/icons/snow.svg';
import clear from './assets/icons/clear-day.svg';
import clouds from './assets/icons/fog.svg';
import fog from './assets/icons/fog.svg';
import haze from './assets/icons/haze.svg';
import smoke from './assets/icons/smoke.svg';
import defaultWeather from './assets/icons/clear-day.svg';

const imgObject = {
	thunderstorm,
	drizzle,
	rain,
	snow,
	clear,
	clouds,
	fog,
	haze,
	smoke,
};

const cookies = new Cookies();

function App() {
	const completarMenu = () => {
		if (cookies.get('_id')) {
			console.log('User Id: ', cookies.get('_id'));
			console.log('Id Rol: ', cookies.get('idRol'));
			if (parseInt(cookies.get('idRol')) === 1) {
				return completarMenuAdmin();
			} else if (parseInt(cookies.get('idRol')) === 2) {
				return completarMenuUser();
			}
		}
	};

	const [values, setValues] = useState('');
	const [icon, setIcon] = useState('');

	const URL = 'https://api.openweathermap.org/data/2.5/weather?lat=-34.69317866093715&lon=-58.458973184669176&lp&appid=7dbacc82273d56d57d095c085c71b60d';

	const getClima = async () => {
		await fetch(URL)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (data.cod >= 400) {
					setValues(false);
				} else {
					setIcon(data.weather[0].main.toLowerCase());
					console.log(data.weather[0].main.toLowerCase());
					setValues(data);
					console.log(data.rain[0]);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	useEffect(() => {
		getClima();
	}, []);

	const completarMenuUser = () => {
		return (
			<div>
				<li key="DropdownUser">
					<div className="dropdown bugermenu">
						<button className="btn btn-dark navbar-toggler" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
							<span className="navbar-toggler-icon"></span>
						</button>
						<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
							<li key="UserPerfil">
								<a href={'/miperfil/' + cookies.get('_id')} className="dropdown-item">
									Mi Perfil
								</a>
							</li>
							<li key="UserInicio">
								<a href={'/inicio'} className="dropdown-item">
									Inicio
								</a>
							</li>
							<li key="AdminUsuarios">
								<a href="/users" className="dropdown-item">
									Usuarios
								</a>
							</li>
							<li key="UserInscribirme">
								<a href="/inscripcion" className="dropdown-item">
									Inscribirme
								</a>
							</li>
							<li key="inscripciones">
								<a href="/inscripciones" className="dropdown-item">
									Ver Mis Inscripciones
								</a>
							</li>
							<li key="UserCerrarSesion">
								<a onClick={cerrarSesion} className="dropdown-item" style={{ cursor: 'pointer' }}>
									Cerrar Sesión
								</a>
							</li>
						</ul>
					</div>
				</li>
			</div>
		);
	};

	const completarMenuAdmin = () => {
		return (
			<div>
				<li key="DropdownAdmin">
					<div className="dropdown bugermenu">
						<button className="btn btn-dark navbar-toggler" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
							<span className="navbar-toggler-icon"></span>
						</button>
						<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
							<li key="AdminPerfil">
								<a href={'/miperfil/' + cookies.get('_id')} className="dropdown-item">
									Mi Perfil
								</a>
							</li>
							<li key="AdminInicio">
								<a href={'/inicio'} className="dropdown-item">
									Inicio
								</a>
							</li>
							<li key="AdminUsuarios">
								<a href="/users" className="dropdown-item">
									ABM Usuarios
								</a>
							</li>
							<li key="AdminAutos">
								<a href="/cars" className="dropdown-item">
									ABM Autos
								</a>
							</li>
							<li key="AdminSprints">
								<a href="/sprints" className="dropdown-item">
									ABM Sprints
								</a>
							</li>
							<li key="AdminEventos">
								<a href="/eventos" className="dropdown-item">
									ABM Eventos
								</a>
							</li>
							<li key="AdminClases">
								<a href="/clases" className="dropdown-item">
									ABM Clases
								</a>
							</li>
							<li key="inscripciones">
								<a href="/inscripciones" className="dropdown-item">
									ABM Inscripciones
								</a>
							</li>
							<li key="AdminCerrarSesion">
								<a onClick={cerrarSesion} className="dropdown-item" style={{ cursor: 'pointer' }}>
									Cerrar Sesión
								</a>
							</li>
						</ul>
					</div>
				</li>
			</div>
		);
	};

	const sesion = () => {
		if (cookies.get('_id')) {
			return completarMenu();
		} else {
			return (
				<a href="/login" className="nav-link text-white" style={{ cursor: 'pointer' }}>
					<strong>Ingresar</strong>
				</a>
			);
		}
	};

	async function cerrarSesion() {
		cookies.remove('_id', { path: '/' });
		cookies.remove('nombre', { path: '/' });
		cookies.remove('apellido', { path: '/' });
		cookies.remove('idRol', { path: '/' });
		window.location.href = '../inicio';
	}

	let inscripcionACarrera = () => {
		if (cookies.get('_id')) {
			return (
				<div className="col-2">
					<a href="/inscripcion" className="  btn btn-info text-light float-right mx-1">
						<strong>Inscripción a Carrera</strong>
					</a>
				</div>
			);
		}
	};

	return (
		<div>
			<div className="navbar navbar-dark d-flex bg-dark navBlack box-shadow ">
				<div className="container">
					<div className="col-1 btn">
						<a href="/inicio" className=" navbar-brand d-flex align-items-center">
							<img className="logo" src={Logo}></img>
						</a>
						<span></span>
					</div>
					{inscripcionACarrera()}
					{values ? (
						<div className="d-flex col-4 card-container text-light">
							<img className="icon img-fluid weather-icon" src={imgObject[icon] ? imgObject[icon] : defaultWeather} alt="icon-weather" />
							<div className="d-flex">
								<div>
									<h5 className="city-name text-center">{values.name}</h5>

									<p className="temp text-center">{Math.trunc(values.main.temp - 273.15)}ºC</p>
								</div>
							</div>
							<div>
								<p className="text-center">
									Min {Math.trunc(values.main.temp_min - 273.15)}ºC | Máx {Math.trunc(values.main.temp_max - 273.15)}ºC;
								</p>
								<div className="d-flex">
									<p className="text-center">
										Humedad: {values.main.humidity}% | Lluvia: {values.main.humidity}%
									</p>
								</div>
							</div>
						</div>
					) : (
						<h1>{'Ciudad no encontrada'}</h1>
					)}
					<div className="col-1 m-1">{sesion()}</div>
				</div>
			</div>
			<BrowserRouter>
				<Switch>
					<Route exact path={['/', '/Inicio']} component={Inicio} />
					<Route exact path={['/', '/users']} component={UsersList} />
					<Route exact path={['/', '/cars']} component={CarsList} />
					<Route exact path={['/', '/inscripciones']} component={InscripcionesList} />
					<Route exact path={['/', '/Inscripcion']} component={Inscripcion} />
					<Route exact path={['/', '/login']} component={Login} />
					<Route exact path={['/', '/errorPage']} component={ErrorPage} />
					<Route exact path={['/', '/miperfil']} component={MiPerfil} />
					<Route path="/miperfil/:_id" render={(props) => <MiPerfil {...props} />} />
					<Route exact path={['/', '/sprints']} component={Sprints} />
					<Route exact path={['/', '/eventos']} component={Eventos} />
					<Route exact path={['/', '/clases']} component={Clases} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
