import mongodb from "mongodb";
import { modTypeCreate, modTypeModif } from "../../util/constants.js";
const ObjectId = mongodb.ObjectId;
let inscriptions;

export default class InscriptionsDAO {
    static async injectDB(conn) {
        if (inscriptions) {
            return
        }
        try {
            inscriptions = await conn.db(process.env.SARDB_NS).collection("InscriptionsClases");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in inscriptionsDAO: ${e}`,
            )
        }
    };

    static async getInscriptions(
    {
        filters = null,
        page = 0,
        inscriptionsPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if("IdUsuario" in filters) {
                query = { $text: { $search: filters["IdUsuario"]}};
            } else if ("segundoCampo" in filters){
                query = { "segundoCampo": { $eq: filters["segundoCampo"]}};
            } else if ("tercerCampo" in filters){
                query = { "campo.tercerCampo": { $eq: filters["tercerCampo"]}};
            }
        }

        let cursor;

        try {
            console.log(query);
            cursor = inscriptions.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { inscriptionsList: [], totalNumInscriptions: 0};
        }

        const displayCursor = cursor.limit(inscriptionsPerPage).skip(inscriptionsPerPage * page);

        try {
            const inscriptionsList = await displayCursor.toArray();
            const totalNumInscriptions = await inscriptions.countDocuments(query)

            return { inscriptionsList, totalNumInscriptions}
        } catch (error) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { inscriptionsList: [], totalNumInscriptions: 0};
        }
    }

    // ToDo: Add IdUsuarioModif property with the Id of the loged in user
    static async addInscription(
        userId,
        classId,
        vehicleId,
        date,
        paid,
        amount,
    ) {
        try {
            const inscriptionDoc = {
                IdUsuario: userId,
                IdClase: classId,
                IdVehiculo: vehicleId,
                Fecha: date,
                PagadoBool: paid,
                Monto: amount,
                FechaUltModif: new Date(),
                IdUsuarioModif: 0,
                TipoModif: modTypeCreate,
            };

            return await inscriptions.insertOne(inscriptionDoc);
        } catch (e) {
            console.error(`Unable to post inscriptions: ${e}`);
            return { error: e };
        }
    }

    static async updateInscription (
        inscriptionId,
        userId,
        classId,
        vehicleId,
        date,
        paid,
        amount,
    ) {
        try {
            const updateResponse = await inscriptions.updateOne(
                { _id: ObjectId(inscriptionId) },
                { $set: { 
                    IdUsuario: userId,
                    IdClase: classId,
                    IdVehiculo: vehicleId,
                    Fecha: date,
                    PagadoBool: paid,
                    Monto: amount,
                    FechaUltModif: new Date(),
                    TipoModif: modTypeModif,
                    }
                },
            );

            return updateResponse;
        } catch (e) {
            console.error(`Unable to update inscriptions: ${e}`);
            return { error: e };
        }
    }

    static async deleteInscription (inscriptionId) {
        try {
            const deleteResponse = await inscriptions.deleteOne({
                _id: ObjectId(inscriptionId),
            });

            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete inscription: ${e}`);
            return { error: e };
        }
    }

}