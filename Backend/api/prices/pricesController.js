import pricesDAO from "../../dao/prices/pricesDAO.js";
import { modTypeCreate } from "../../util/constants.js";

export default class pricesController {
    static async apiGetPrices(req, res, next) {
        const pricesPerPage = req.query.pricesPerPage ? parseInt(req.query.pricesPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.IdUsuario) {
            filters.IdUsuario = req.query.IdUsuario;
        } else if (req.query.segundoCampo) {
            filters.segundoCampo = req.query.segundoCampo;
        } else if (req.query.tercerCampo) {
            filters.tercerCampo = req.query.tercerCampo;
        }

        const { pricesList, totalNumprices } = await pricesDAO.getPrices ({
            filters,
            page,
            pricesPerPage,
        });

        let response = {
            prices: pricesList,
            page,
            filters,
            entries_per_page: pricesPerPage,
            total_results: totalNumprices,
        }
        res.json(response);
    }

    static async apiPostPrice(req, res, next) {
        try {
            console.log(`About to create new price`);

            const priceResponse = await pricesDAO.addPrice(
                req.body.nameProduct,
                req.body.date,
                req.body.value,
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdatePrice(req, res, next) {
        try {
            const priceId = req.query.priceId;
            console.log(`About to update price: ${priceId}`);

            const pricesResponse = await pricesDAO.updatePrice(
                priceId,
                req.body.nameProduct,
                req.body.date,
                req.body.value,
            );
    
            var { error } = pricesResponse;
            if (error){
                res.status(400).json({ error });
            }
    
            if (pricesResponse.modifiedCount === 0) {
                throw new Error ("API - Unable to update price");
            }
    
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiDeletePrice(req, res, next) {
        try {
            const priceId = req.query.priceId;
            console.log(`About to delete price: ${priceId}`);

            const priceResponse = await pricesDAO.deletePrice(priceId);

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}