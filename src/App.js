import React from 'react';
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
								<a href={'/inicio'} className="dropdown-item">
									Inicio
								</a>
							</li>
							<li key="AdminUsuarios">
								<a href="/users" className="dropdown-item">
									Usuarios
								</a>
							</li>
							<li key="UserPerfil">
								<a href={'/miperfil/' + cookies.get('_id')} className="dropdown-item">
									Mi Perfil
								</a>
							</li>
							<li key="UserPerfil">
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
							<li key="AdminUsuarios">
								<a href="/users" className="dropdown-item">
									Usuarios
								</a>
							</li>
							<li key="AdminPerfil">
								<a href={'/miperfil/' + cookies.get('_id')} className="dropdown-item">
									Mi Perfil
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
					<strong> Ingresar</strong>
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
				<div>
					<a href="/inscripcion" className="nav-link text-light float-right">
						<strong>Inscripcion a Carrera</strong>
					</a>
				</div>
			);
		}
	};

	return (
		<div>
			<div className="navbar navbar-dark d-flex bg-dark box-shadow">
				<div className="container  justify-content-between">
					<div className="col-1 btn">
						<span className="icon"></span>
						<a href="/inicio" className=" navbar-brand d-flex align-items-center">
							<strong>S4R</strong>
						</a>
						<span></span>
					</div>
					<div className="col-4">
						<strong className="text-white">Bienvenido {cookies.get('nombre')}</strong>
					</div>
					<div className="col-5">{inscripcionACarrera()}</div>
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
