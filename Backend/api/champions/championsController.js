import championsDAO from "../../dao/champions/championsDAO.js";
import { modTypeCreate } from "../../util/constants.js";

export default class championsController {
    static async apiGetChampions(req, res, next) {
        const championsPerPage = req.query.championsPerPage ? parseInt(req.query.championsPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.IdUsuario) {
            filters.IdUsuario = req.query.IdUsuario;
        } else if (req.query.segundoCampo) {
            filters.segundoCampo = req.query.segundoCampo;
        } else if (req.query.tercerCampo) {
            filters.tercerCampo = req.query.tercerCampo;
        }

        const { championsList, totalNumchampions } = await championsDAO.getChampions ({
            filters,
            page,
            championsPerPage,
        });

        let response = {
            champions: championsList,
            page,
            filters,
            entries_per_page: championsPerPage,
            total_results: totalNumchampions,
        }
        res.json(response);
    }

    static async apiPostChampion(req, res, next) {
        try {
            console.log(`About to create new champion`);

            const championResponse = await championsDAO.addChampion(
                req.body.title,
                req.body.img,
                req.body.description,
                req.body.content,
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateChampion(req, res, next) {
        try {
            const championId = req.query.championId;
            console.log(`About to update champion: ${championId}`);

            const championsResponse = await championsDAO.updateChampion(
                championId,
                req.body.title,
                req.body.img,
                req.body.description,
                req.body.content,
            );
    
            var { error } = championsResponse;
            if (error){
                res.status(400).json({ error });
            }
    
            if (championsResponse.modifiedCount === 0) {
                throw new Error ("API - Unable to update champion");
            }
    
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiDeleteChampion(req, res, next) {
        try {
            const championId = req.query.championId;
            console.log(`About to delete champion: ${championId}`);

            const championResponse = await championsDAO.deleteChampion(championId);

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}