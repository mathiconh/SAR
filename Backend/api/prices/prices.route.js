import express from "express";
import pricesCtrl from "./pricesController.js";

const router = express.Router();

// Temporary, later on delete it
router.route("/").get(pricesCtrl.apiGetPrices);

// Para busquedas compuestas de mas de una coleccion ver el video de MERN min aprox 0:59:00

router
    .route("/price")
    .get(pricesCtrl.apiGetPrices)
    .post(pricesCtrl.apiPostPrice)
    .patch(pricesCtrl.apiUpdatePrice)
    .delete(pricesCtrl.apiDeletePrice)

export default router;