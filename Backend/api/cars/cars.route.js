import express from "express";
import carsCtrl from "./carsController.js";

const router = express.Router();

// Temporary, later on delete it
router.route("/").get(carsCtrl.apiGetCars);

// Para busquedas compuestas de mas de una coleccion ver el video de MERN min aprox 0:59:00

router
    .route("/car")
    .get(carsCtrl.apiGetCars)
    .post(carsCtrl.apiPostCar)
    .patch(carsCtrl.apiUpdateCar)
    .delete(carsCtrl.apiDeleteCar)

export default router;