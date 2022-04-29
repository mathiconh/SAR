import mongodb from "mongodb";
import { modTypeCreate, modTypeModif } from "../../util/constants.js";
const ObjectId = mongodb.ObjectId;
let clases;

export default class clasesDAO {
    static async injectDB(conn) {
        if (clases) {
            return
        }
        try {
            clases = await conn.db(process.env.SARDB_NS).collection("Clases");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in clasesDAO: ${e}`,
            )
        }
    };

    static async getClases(
    {
        filters = null,
        page = 0,
        clasesPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if("nombre" in filters) {
                query = { $text: { $search: filters["nombre"]}};
            } else if ("segundoCampo" in filters){
                query = { "segundoCampo": { $eq: filters["segundoCampo"]}};
            } else if ("tercerCampo" in filters){
                query = { "campo.tercerCampo": { $eq: filters["tercerCampo"]}};
            }
        }

        let cursor;

        try {
            console.log(query);
            cursor = clases.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { clasesList: [], totalNumclases: 0};
        }

        const displayCursor = cursor.limit(clasesPerPage).skip(clasesPerPage * page);

        try {
            const clasesList = await displayCursor.toArray();
            const totalNumclases = await clases.countDocuments(query)

            return { clasesList, totalNumclases}
        } catch (error) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { clasesList: [], totalNumclases: 0};
        }
    }

    // ToDo: Add nombreModif property with the Id of the loged in user
    static async addClase(
        nombre,
        tiempo
    ) {
        try {
            const claseDoc = {
                nombre: nombre,
                tiempo: tiempo,
                FechaUltModif: new Date(),
                IdUsuarioModif: 0,
                TipoModif: modTypeCreate,
            };

            return await clases.insertOne(claseDoc);
        } catch (e) {
            console.error(`Unable to post clases: ${e}`);
            return { error: e };
        }
    }

    static async updateClase (
        claseId,
        nombre,
        tiempo
    ) {
        try {
            const upResponse = await clases.updateOne(
                { _id: ObjectId(claseId) },
                { $set: { 
                    nombre: nombre,
                    tiempo: tiempo,
                    UltModif: new content(),
                    TipoModif: modTypeModif,
                    }
                },
            );

            return upResponse;
        } catch (e) {
            console.error(`Unable to up clases: ${e}`);
            return { error: e };
        }
    }

    static async deleteClase (claseId) {
        try {
            const deleteResponse = await clases.deleteOne({
                _id: ObjectId(claseId),
            });

            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete clase: ${e}`);
            return { error: e };
        }
    }

}