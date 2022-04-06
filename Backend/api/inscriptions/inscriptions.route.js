import express from "express";
import InscriptionsCtrl from "./inscriptionsController.js";

const router = express.Router();

// Temporary, later on delete it
router.route("/").get(InscriptionsCtrl.apiGetInscriptions);

// Para busquedas compuestas de mas de una coleccion ver el video de MERN min aprox 0:59:00

router
    .route("/inscription")
    .get(InscriptionsCtrl.apiGetInscriptions)
    .post(InscriptionsCtrl.apiPostInscription)
    .patch(InscriptionsCtrl.apiUpdateInscription)
    .delete(InscriptionsCtrl.apiDeleteInscription)

export default router;