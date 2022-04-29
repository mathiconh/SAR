import clasesDAO from "../../dao/clases/clasesDAO.js";
import { modTypeCreate } from "../../util/constants.js";

export default class clasesController {
    static async apiGetClases(req, res, next) {
        const clasesPerPage = req.query.clasesPerPage ? parseInt(req.query.clasesPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.IdUsuario) {
            filters.IdUsuario = req.query.IdUsuario;
        } else if (req.query.segundoCampo) {
            filters.segundoCampo = req.query.segundoCampo;
        } else if (req.query.tercerCampo) {
            filters.tercerCampo = req.query.tercerCampo;
        }

        const { clasesList, totalNumclases } = await clasesDAO.getClases ({
            filters,
            page,
            clasesPerPage,
        });

        let response = {
            clases: clasesList,
            page,
            filters,
            entries_per_page: clasesPerPage,
            total_results: totalNumclases,
        }
        res.json(response);
    }

    static async apiPostClase(req, res, next) {
        try {
            console.log(`About to create new Clase`);

            const claseResponse = await clasesDAO.addClase(
                req.body.nombre,
                req.body.tiempo,
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateClase(req, res, next) {
        try {
            const claseId = req.query.claseId;
            console.log(`About to update Clase: ${claseId}`);

            const clasesResponse = await clasesDAO.updateClase(
                claseId,
                req.body.nombre,
                req.body.tiempo,
            );
    
            var { error } = clasesResponse;
            if (error){
                res.status(400).json({ error });
            }
    
            if (clasesResponse.modifiedCount === 0) {
                throw new Error ("API - Unable to update Clase");
            }
    
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiDeleteClase(req, res, next) {
        try {
            const claseId = req.query.claseId;
            console.log(`About to delete Clase: ${claseId}`);

            const claseResponse = await clasesDAO.deleteClase(claseId);

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}