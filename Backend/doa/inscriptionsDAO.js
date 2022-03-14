let inscriptions

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
    }

    static async getInscriptions({
        filters = null,
        page = 0,
        inscriptionsPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if("name" in filters) {
                query = { $text: { $search: filters["name"]}};
            } else if ("segundoCampo"){
                query = { "segundoCampo": { $eq: filters["segundoCampo"]}};
            } else if ("tercerCampo"){
                query = { "campo.tercerCampo": { $eq: filters["tercerCampo"]}};
            }
        }

        let cursor;

        try {
            cursor = query.find(query);
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
                `Unable to convert cursor to array or problem counting docuemtns, ${e}`
            );
            return { inscriptionsList: [], totalNumInscriptions: 0};
        }
    }

}