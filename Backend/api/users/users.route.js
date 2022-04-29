import express from "express";
import usersCtrl from "./usersController.js";

const router = express.Router();

// Temporary, later on delete it
router.route("/").get(usersCtrl.apiGetUsers);

// Para busquedas compuestas de mas de una coleccion ver el video de MERN min aprox 0:59:00

router
    .route("/user")
    .get(usersCtrl.apiGetUsers)
    .post(usersCtrl.apiPostUser)
    .patch(usersCtrl.apiUpdateUser)
    .delete(usersCtrl.apiDeleteUser)

export default router;