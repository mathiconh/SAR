import mongodb from "mongodb";
import { modTypeCreate, modTypeModif } from "../../util/constants.js";
const ObjectId = mongodb.ObjectId;
let cars;

export default class carsDAO {
    static async injectDB(conn) {
        if (cars) {
            return
        }
        try {
            cars = await conn.db(process.env.SARDB_NS).collection("Cars");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in carsDAO: ${e}`,
            )
        }
    };

    static async getCars(
    {
        filters = null,
        page = 0,
        carsPerPage = 20,
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
            cursor = cars.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carsList: [], totalNumcars: 0};
        }

        const displayCursor = cursor.limit(carsPerPage).skip(carsPerPage * page);

        try {
            const carsList = await displayCursor.toArray();
            const totalNumcars = await cars.countDocuments(query)

            return { carsList, totalNumcars}
        } catch (error) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { carsList: [], totalNumcars: 0};
        }
    }

    // ToDo: Add nameProductModif property with the Id of the loged in user
    static async addCar(
        patente,
        modelo,
        año,
        agregados,
        historia,
        tallerAsociado,
    ) {
        try {
            const carDoc = {
                patente: patente,
                modelo: modelo,
                año: año,
                agregados: agregados,
                historia: historia,
                tallerAsociado: tallerAsociado,
                FechaUltModif: new Date(),
                IdUsuarioModif: 0,
                TipoModif: modTypeCreate,
            };

            return await cars.insertOne(carDoc);
        } catch (e) {
            console.error(`Unable to post cars: ${e}`);
            return { error: e };
        }
    }

    static async updateCar (
        patente,
        modelo,
        año,
        agregados,
        historia,
        tallerAsociado,
    ) {
        try {
            const upcontentResponse = await cars.updateOne(
                { _id: ObjectId(carId) },
                { $set: { 
                    patente: patente,
                    modelo: modelo,
                    año: año,
                    agregados: agregados,
                    historia: historia,
                    tallerAsociado: tallerAsociado,
                    contentUltModif: new content(),
                    TipoModif: modTypeModif,
                    }
                },
            );

            return upcontentResponse;
        } catch (e) {
            console.error(`Unable to upcontent cars: ${e}`);
            return { error: e };
        }
    }

    static async deleteCar (carId) {
        try {
            const deleteResponse = await cars.deleteOne({
                _id: ObjectId(carId),
            });

            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete car: ${e}`);
            return { error: e };
        }
    }

}