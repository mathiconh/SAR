import express from "express";
import InscriptionsCtrl from "./inscriptionsController.js";

const router = express.Router();

router.route("/").get(InscriptionsCtrl.apiGetInscriptions)

export default router;