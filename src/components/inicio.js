/* eslint-disable prettier/prettier */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/inicio.css';
import Cookies from 'universal-cookie';
import '../App.css';

const cookies = new Cookies();

const Inicio = () => {
	let sesion = () => {
		if (cookies.get('_id')) {
			if (cookies.get('idRol') === '1') {
				return (
					<div className="d-flex">
						<div className="m-4">
							<a href="/users" className="justify-center btn btn-warning ml-4">
								Usuarios
							</a>
						</div>
						<div className="m-4">
							<a href="/sprints" className="justify-center btn btn-warning ml-4">
								ABM Sprints
							</a>
						</div>
						<div className="m-4">
							<a href="/inscripciones" className="justify-center btn btn-warning ml-4">
								ABM Inscripciónes
							</a>
						</div>
						<div className="m-4">
							<a href={'/miperfil/' + cookies.get('_id')} className="justify-center btn btn-warning">
								Ver Mi Perfil
							</a>
						</div>
					</div>
				);
			} else {
				return (
					<div className="d-flex">
						<div className="m-4">
							<a href="/inscripcion" className="justify-center btn btn-warning ml-4">
								Inscribite
							</a>
						</div>
						<div className="m-4">
							<a href={'/miperfil/' + cookies.get('_id')} className="justify-center btn btn-warning">
								Ver Mi Perfil
							</a>
						</div>
					</div>
				);
			}
		} else {
			return (
				<>
					<div className="botonPrincipal">
						<a href="/login" className="btn btn-info ">
							<strong>INICIAR SESION</strong>
						</a>
					</div>
					<div className="botonPrincipal">
						<a href="/inscripcion" className=" btn btn-info ">
							<strong>INSCRIBIRME</strong>
						</a>
					</div>
				</>
			);
		}
	};

	return (
		<section className="d-flex vh-85 justify-content-center align-items-center img-fluid imagenFondo">
			<div className="col-auto m-5">
				<p className="h3 text-white text-center sombraTexto">Veni a probar los tiempos de tu auto</p>
				<p className="h1 text-white text-center sombraTexto">EN EL GRAN AUTODROMO DE BUENOS AIRES</p>
				<div className="d-flex justify-content-center">
					<div className="d-flex">{sesion()}</div>
				</div>
			</div>
		</section>
	);
};

export default Inicio;
