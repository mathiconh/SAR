import InscriptionsDAO from "../dao/inscriptionsDAO.js";
import { modTypeCreate } from "../util/constants.js";

export default class InscriptionsController {
    static async apiGetInscriptions(req, res, next) {
        const inscriptionsPerPage = req.query.inscriptionsPerPage ? parseInt(req.query.inscriptionsPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.IdUsuario) {
            filters.IdUsuario = req.query.IdUsuario;
        } else if (req.query.segundoCampo) {
            filters.segundoCampo = req.query.segundoCampo;
        } else if (req.query.tercerCampo) {
            filters.tercerCampo = req.query.tercerCampo;
        }

        const { inscriptionsList, totalNumInscriptions } = await InscriptionsDAO.getInscriptions ({
            filters,
            page,
            inscriptionsPerPage,
        });

        let response = {
            inscriptions: inscriptionsList,
            page,
            filters,
            entries_per_page: inscriptionsPerPage,
            total_results: totalNumInscriptions,
        }
        res.json(response);
    }

    static async apiPostInscription(req, res, next) {
        try {
            console.log(`About to create new inscription`);
            const lastModDate = new Date();
            const modType = modTypeCreate;

            const inscriptionResponse = await InscriptionsDAO.addInscription(
                req.body.userId,
                req.body.classId,
                req.body.vehicleId,
                req.body.date,
                req.body.paid,
                req.body.amount,
                lastModDate,
                modType
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateInscription(req, res, next) {
        try {
            const inscriptionId = req.query.inscriptionId;
            console.log(`About to update inscription: ${inscriptionId}`);

            const inscriptionsResponse = await InscriptionsDAO.updateInscription(
                inscriptionId,
                req.body.userId,
                req.body.classId,
                req.body.vehicleId,
                req.body.date,
                req.body.paid,
                req.body.amount,
            );
    
            var { error } = inscriptionsResponse;
            if (error){
                res.status(400).json({ error });
            }
    
            if (inscriptionsResponse.modifiedCount === 0) {
                throw new Error ("API - Unable to update inscription");
            }
    
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiDeleteInscription(req, res, next) {
        try {
            const inscriptionId = req.query.inscriptionId;
            console.log(`About to delete inscription: ${inscriptionId}`);

            const inscriptionResponse = await InscriptionsDAO.deleteInscription(inscriptionId);

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}