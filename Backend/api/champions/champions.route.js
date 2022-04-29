import express from "express";
import championsCtrl from "./championsController.js";

const router = express.Router();

// Temporary, later on delete it
router.route("/").get(championsCtrl.apiGetChampions);

// Para busquedas compuestas de mas de una coleccion ver el video de MERN min aprox 0:59:00

router
    .route("/champion")
    .get(championsCtrl.apiGetChampions)
    .post(championsCtrl.apiPostChampion)
    .patch(championsCtrl.apiUpdateChampion)
    .delete(championsCtrl.apiDeleteChampion)

export default router;