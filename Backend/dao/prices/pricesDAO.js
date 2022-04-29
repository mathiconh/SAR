import mongodb from "mongodb";
import { modTypeCreate, modTypeModif } from "../../util/constants.js";
const ObjectId = mongodb.ObjectId;
let prices;

export default class pricesDAO {
    static async injectDB(conn) {
        if (prices) {
            return
        }
        try {
            prices = await conn.db(process.env.SARDB_NS).collection("Prices");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in pricesDAO: ${e}`,
            )
        }
    };

    static async getPrices(
    {
        filters = null,
        page = 0,
        pricesPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if("nameProduct" in filters) {
                query = { $text: { $search: filters["nameProduct"]}};
            } else if ("segundoCampo" in filters){
                query = { "segundoCampo": { $eq: filters["segundoCampo"]}};
            } else if ("tercerCampo" in filters){
                query = { "campo.tercerCampo": { $eq: filters["tercerCampo"]}};
            }
        }

        let cursor;

        try {
            console.log(query);
            cursor = prices.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { pricesList: [], totalNumprices: 0};
        }

        const displayCursor = cursor.limit(pricesPerPage).skip(pricesPerPage * page);

        try {
            const pricesList = await displayCursor.toArray();
            const totalNumprices = await prices.countDocuments(query)

            return { pricesList, totalNumprices}
        } catch (error) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { pricesList: [], totalNumprices: 0};
        }
    }

    // ToDo: Add nameProductModif property with the Id of the loged in user
    static async addPrice(
        nameProduct,
        date,
        value,
    ) {
        try {
            const priceDoc = {
                nameProduct: nameProduct,
                date: date,
                value: value,
                FechaUltModif: new Date(),
                IdUsuarioModif: 0,
                TipoModif: modTypeCreate,
            };

            return await prices.insertOne(priceDoc);
        } catch (e) {
            console.error(`Unable to post prices: ${e}`);
            return { error: e };
        }
    }

    static async updatePrice (
        priceId,
        nameProduct,
        date,
        value,
    ) {
        try {
            const upcontentResponse = await prices.updateOne(
                { _id: ObjectId(priceId) },
                { $set: { 
                    nameProduct: nameProduct,
                    date: date,
                    value: value,
                    contentUltModif: new content(),
                    TipoModif: modTypeModif,
                    }
                },
            );

            return upcontentResponse;
        } catch (e) {
            console.error(`Unable to upcontent prices: ${e}`);
            return { error: e };
        }
    }

    static async deletePrice (priceId) {
        try {
            const deleteResponse = await prices.deleteOne({
                _id: ObjectId(priceId),
            });

            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete price: ${e}`);
            return { error: e };
        }
    }

}