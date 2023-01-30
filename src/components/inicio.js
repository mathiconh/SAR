/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/inicio.css';
import Cookies from 'universal-cookie';
import thunderstorm from '../assets/icons/thunderstorms-rain.svg';
import drizzle from '../assets/icons/drizzle.svg';
import rain from '../assets/icons/rain.svg';
import snow from '../assets/icons/snow.svg';
import clear from '../assets/icons/clear-day.svg';
import clouds from '../assets/icons/fog.svg';
import fog from '../assets/icons/fog.svg';
import haze from '../assets/icons/haze.svg';
import smoke from '../assets/icons/smoke.svg';
import defaultWeather from '../assets/icons/clear-day.svg';

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

const Inicio = () => {
	const [values, setValues] = useState('');
	const [icon, setIcon] = useState('');
	const [weatherDescripcion, setWeatherDescripcion] = useState('');

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
					setIcon(data.weather[0].main.toLowerCase());
					console.log(data.weather[0].main.toLowerCase())
					setValues(data);
					setWeatherDescripcion(data.weather[0].description);
					console.log(data);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	useEffect(() => {
		getClima();
	}, []);

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
				<div className="d-flex p-2 justify-content-center">
					<div className="card bg-info bg-opacity-75 w-50">
						{values ? (
							<div className="card-container m-2">
								<h1 className="text-center">Temperatura en el autodromo</h1>
								<h1 className="city-name text-center">{values.name}</h1>
								<p className="temp text-center">Temperatura actual: {Math.trunc(values.main.temp - 273.15)}ºC</p>
								<p className="hum text-center">Humedad actual: {values.main.humidity}%</p>
								<img className="icon" src={imgObject[icon] ? imgObject[icon] : defaultWeather} alt="icon-weather" />
								<div className="card-footer">
									<p className="text-center text-capitalize">{weatherDescripcion}</p>
									<p className="temp-max-min text-center">
										Min {Math.trunc(values.main.temp_min - 273.15)}ºC | Máx {Math.trunc(values.main.temp_max - 273.15)}ºC;
									</p>
								</div>
							</div>
						) : (
							<h1>{'Ciudad no encontrada'}</h1>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Inicio;
