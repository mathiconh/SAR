import mongodb from "mongodb";
import { modTypeCreate, modTypeModif } from "../../util/constants.js";
const ObjectId = mongodb.ObjectId;
let champions;

export default class championsDAO {
    static async injectDB(conn) {
        if (champions) {
            return
        }
        try {
            champions = await conn.db(process.env.SARDB_NS).collection("Champions");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in championsDAO: ${e}`,
            )
        }
    };

    static async getChampions(
    {
        filters = null,
        page = 0,
        championsPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if("title" in filters) {
                query = { $text: { $search: filters["title"]}};
            } else if ("segundoCampo" in filters){
                query = { "segundoCampo": { $eq: filters["segundoCampo"]}};
            } else if ("tercerCampo" in filters){
                query = { "campo.tercerCampo": { $eq: filters["tercerCampo"]}};
            }
        }

        let cursor;

        try {
            console.log(query);
            cursor = champions.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { championsList: [], totalNumchampions: 0};
        }

        const displayCursor = cursor.limit(championsPerPage).skip(championsPerPage * page);

        try {
            const championsList = await displayCursor.toArray();
            const totalNumchampions = await champions.countDocuments(query)

            return { championsList, totalNumchampions}
        } catch (error) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { championsList: [], totalNumchampions: 0};
        }
    }

    // ToDo: Add titleModif property with the Id of the loged in user
    static async addChampion(
        title,
        img,
        description,
        content,
    ) {
        try {
            const championDoc = {
                title: title,
                img: img,
                description: description,
                content: content,
                FechaUltModif: new Date(),
                IdUsuarioModif: 0,
                TipoModif: modTypeCreate,
            };

            return await champions.insertOne(championDoc);
        } catch (e) {
            console.error(`Unable to post champions: ${e}`);
            return { error: e };
        }
    }

    static async updateChampion (
        championId,
        title,
        img,
        description,
        content,
    ) {
        try {
            const upcontentResponse = await champions.updateOne(
                { _id: ObjectId(championId) },
                { $set: { 
                    title: title,
                    img: img,
                    description: description,
                    content: content,
                    contentUltModif: new content(),
                    TipoModif: modTypeModif,
                    }
                },
            );

            return upcontentResponse;
        } catch (e) {
            console.error(`Unable to upcontent champions: ${e}`);
            return { error: e };
        }
    }

    static async deleteChampion (championId) {
        try {
            const deleteResponse = await champions.deleteOne({
                _id: ObjectId(championId),
            });

            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete champion: ${e}`);
            return { error: e };
        }
    }

}