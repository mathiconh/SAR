/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/inicio.css';
import Cookies from 'universal-cookie';
import icons from '../utils/icons'

const cookies = new Cookies();

const Inicio = () => {
	let sesion = () => {
		const [values, setValues] = useState('');
		const [icon, setIcon] = useState('');

		const URL = 'https://api.openweathermap.org/data/2.5/weather?lat=-34.69317866093715&lon=-58.458973184669176&lang=es&appid=7dbacc82273d56d57d095c085c71b60d';

		const getClima = async () => {
			await fetch(URL)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					if (data.cod >= 400) {
						setValues(false);
					} else {
						setIcon(data.weather[0].main);
						setValues(data);
						console.log(data)
					}
				})
				.catch((e) => {
					console.log(e);
				});
		};

		useEffect(() => {
			getClima();
		}, []);

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
						<div className="card">
							{values ? (
								<div className="card-container">
									<h1 className="city-name">{values.name}</h1>
									<p className="temp">{Math.trunc(values.main.temp - 273.15)}ºC</p>
									<img className="icon" src={icons(icon)} alt="icon-weather" />
									<div className="card-footer">
										<p className="temp-max-min">
											Min {Math.trunc(values.main.temp_min - 273.15)}ºC | Máx {Math.trunc(values.main.temp_max - 273.15)}ºC;
										</p>
									</div>
								</div>
							) : (
								<h1>{'City not found'}</h1>
							)}
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
				<div>
					<a href="/login" className="justify-center btn btn-info">
						INICIAR SESION
					</a>
				</div>
			);
		}
	};

	return (
		<section className="vh-100 d-flex justify-content-center align-items-center img-fluid imagenFondo">
			<div className="col-auto">
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
