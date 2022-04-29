import carsDAO from "../../dao/cars/carsDAO.js";
import { modTypeCreate } from "../../util/constants.js";

export default class carsController {
    static async apiGetCars(req, res, next) {
        const carsPerPage = req.query.carsPerPage ? parseInt(req.query.carsPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.IdVehiculo) {
            filters.IdVehiculo = req.query.IdVehiculo;
        } else if (req.query.segundoCampo) {
            filters.segundoCampo = req.query.segundoCampo;
        } else if (req.query.tercerCampo) {
            filters.tercerCampo = req.query.tercerCampo;
        }

        const { carsList, totalNumcars } = await carsDAO.getCars ({
            filters,
            page,
            carsPerPage,
        });

        let response = {
            cars: carsList,
            page,
            filters,
            entries_per_page: carsPerPage,
            total_results: totalNumcars,
        }
        res.json(response);
    }

    static async apiPostCar(req, res, next) {
        try {
            console.log(`About to create new car`);

            const carResponse = await carsDAO.addCar(
                req.body.patent,
                req.body.model,
                req.body.year,
                req.body.aggregated,
                req.body.history,
                req.body.workshopAssociated,
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateCar(req, res, next) {
        try {
            const carId = req.query.carId;
            console.log(`About to update car: ${carId}`);

            const carsResponse = await carsDAO.updateCar(
                carId,
                req.body.patent,
                req.body.model,
                req.body.year,
                req.body.aggregated,
                req.body.history,
                req.body.workshopAssociated,
            );
    
            var { error } = carsResponse;
            if (error){
                res.status(400).json({ error });
            }
    
            if (carsResponse.modifiedCount === 0) {
                throw new Error ("API - Unable to update car");
            }
    
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiDeleteCar(req, res, next) {
        try {
            const carId = req.query.carId;
            console.log(`About to delete car: ${carId}`);

            const carResponse = await carsDAO.deleteCar(carId);

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}