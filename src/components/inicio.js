/* eslint-disable prettier/prettier */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/inicio.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Inicio = () => {
	let sesion = () => {
		if (cookies.get('_id')) {
			if (cookies.get('idRol') === '1') {
				return (
					<div className="d-flex">
						<div className="m-4">
							<div className="m-4">
								<a href="/users" className="justify-center btn botonPrincipal ml-4">
									Usuarios
								</a>
							</div>
							<div className="m-4">
								<a href="/sprints" className="justify-center btn botonPrincipal ml-4">
									ABM Sprints
								</a>
							</div>
						</div>
						<div className="m-4">
							<div className="m-4">
								<a href="/inscripciones" className="justify-center btn botonPrincipal ml-4">
									ABM Inscripciones
								</a>
							</div>
							<div className="m-4">
								<a href={'/miperfil/' + cookies.get('_id')} className="justify-center btn botonSecundario">
									Ver Mi Perfil
								</a>
							</div>
						</div>
					</div>
				);
			} else {
				return (
					<div>
						<div className="m-4">
							<a href="/inscripcion" className="justify-center btn botonPrincipal ml-4">
								INSCRIBITE
							</a>
						</div>
						<div className="m-4">
							<a href={'/miperfil/' + cookies.get('_id')} className="justify-center btn botonSecundario">
								Ver Mi Perfil
							</a>
						</div>
					</div>
				);
			}
		} else {
			return (
				<div>
					<a href="/login" className="justify-center btn botonSecundario">
						INICIAR SESION
					</a>
				</div>
			);
		}
	};

	return (
		<section className="vh-100 d-flex justify-content-center align-items-center img-fluid  imagenFondo">
			<div className="col-auto  ">
				<p className="  h3 text-white text-center">Veni a probar los tiempos de tu auto</p>
				<p className="  h1 text-white text-center">EN EL GRAN AUTODROMO DE BUENOS AIRES</p>
				<div className="d-flex justify-content-center">
					
					{/* <div className="m-4">
						<a href="/login" className="justify-center btn botonSecundario">
							INICIAR SESION
						</a>
					</div> */}
					<div className="d-flex">
						{sesion()}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Inicio;
