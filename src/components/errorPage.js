import React from 'react';

const ErrorPage = () => {
	const redirect = () => {
		window.location.href = './inicio';
	};

	return (
		<body className="notFoundPage">
			<section className="notFound">
				<div className="img">
					<img src="https://assets.codepen.io/5647096/backToTheHomepage.png" alt="Back to the Homepage" />
					<img src="https://assets.codepen.io/5647096/Delorean.png" alt="El Delorean, El Doc y Marti McFly" />
				</div>
				<div className="textNotFound">
					<h1>Sos rápido, pero banca ahí</h1>
					<h2>Permisos infusicientes</h2>
					<h3>BACK TO HOME?</h3>
					<label className="yes" onClick={redirect}>
						YES
					</label>
				</div>
			</section>
		</body>
	);
};

export default ErrorPage;
