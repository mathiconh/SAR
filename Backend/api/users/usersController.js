import usersDAO from "../../dao/users/usersDAO.js";
import { modTypeCreate } from "../../util/constants.js";

export default class usersController {
    static async apiGetUsers(req, res, next) {
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.IdVehiculo) {
            filters.IdVehiculo = req.query.IdVehiculo;
        } else if (req.query.segundoCampo) {
            filters.segundoCampo = req.query.segundoCampo;
        } else if (req.query.tercerCampo) {
            filters.tercerCampo = req.query.tercerCampo;
        }

        const { usersList, totalNumusers } = await usersDAO.getUsers ({
            filters,
            page,
            usersPerPage,
        });

        let response = {
            users: usersList,
            page,
            filters,
            entries_per_page: usersPerPage,
            total_results: totalNumusers,
        }
        res.json(response);
    }

    static async apiPostUser(req, res, next) {
        try {
            console.log(`About to create new user`);

            const userResponse = await usersDAO.addUser(
                req.body.name,
                req.body.lastname,
                req.body.dni,
                req.body.birthday,
                req.body.email,
                req.body.idVehiculo,
                req.body.address,
                req.body.phone,
                req.body.idSex,
                req.body.idSector,
                req.body.internBool,
                req.body.idRol,
                req.body.idSector,
                req.body.pwd,
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateUser(req, res, next) {
        try {
            const userId = req.query.userId;
            console.log(`About to update user: ${userId}`);

            const usersResponse = await usersDAO.updateUser(
                userId,
                req.body.name,
                req.body.lastname,
                req.body.dni,
                req.body.birthday,
                req.body.email,
                req.body.idVehiculo,
                req.body.address,
                req.body.phone,
                req.body.idSex,
                req.body.idSector,
                req.body.internBool,
                req.body.idRol,
                req.body.idSector,
                req.body.pwd
            );
    
            var { error } = usersResponse;
            if (error){
                res.status(400).json({ error });
            }
    
            if (usersResponse.modifiedCount === 0) {
                throw new Error ("API - Unable to update user");
            }
    
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiDeleteUser(req, res, next) {
        try {
            const userId = req.query.userId;
            console.log(`About to delete user: ${userId}`);

            const userResponse = await usersDAO.deleteUser(userId);

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}