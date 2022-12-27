import React from 'react';

const ErrorPage = () => {
	const redirect = () => {
		window.location.href = './inicio';
	};

	return (
		<div className="col-lg-12">
			<div className="notFoundPage">
				<section className="notFound">
					<div>
						<div className="col-lg-6 img w-auto">
							<img className="img-fluid" src="https://assets.codepen.io/5647096/backToTheHomepage.png" alt="Back to the Homepage" />
						</div>
						<br></br>
						<div className="col-lg-6 img w-auto">
							<img className="img-fluid" src="https://assets.codepen.io/5647096/Delorean.png" alt="El Delorean, El Doc y Marti McFly" />
						</div>
					</div>
					<br></br>
					<div className="textNotFound">
						<h1>Sos rápido, pero banca ahí</h1>
						<h2>Permisos infusicientes</h2>
						<h3>Volver al inicio?</h3>
						<label className="yes" onClick={redirect}>
							SI
						</label>
					</div>
				</section>
			</div>
		</div>
	);
};

export default ErrorPage;
