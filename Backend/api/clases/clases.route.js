import express from "express";
import clasesCtrl from "./clasesController.js";

const router = express.Router();

// Temporary, later on delete it
router.route("/").get(clasesCtrl.apiGetClases);

// Para busquedas compuestas de mas de una coleccion ver el video de MERN min aprox 0:59:00

router
    .route("/clase")
    .get(clasesCtrl.apiGetClases)
    .post(clasesCtrl.apiPostClase)
    .patch(clasesCtrl.apiUpdateClase)
    .delete(clasesCtrl.apiDeleteClase)

export default router;