import mongodb from "mongodb";
import { modTypeCreate, modTypeModif } from "../../util/constants.js";
const ObjectId = mongodb.ObjectId;
let users;

export default class usersDAO {
    static async injectDB(conn) {
        if (users) {
            return
        }
        try {
            users = await conn.db(process.env.SARDB_NS).collection("Users");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in usersDAO: ${e}`,
            )
        }
    };

    static async getUsers(
    {
        filters = null,
        page = 0,
        usersPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if("name" in filters) {
                query = { $text: { $search: filters["name"]}};
            } else if ("segundoCampo" in filters){
                query = { "segundoCampo": { $eq: filters["segundoCampo"]}};
            } else if ("tercerCampo" in filters){
                query = { "campo.tercerCampo": { $eq: filters["tercerCampo"]}};
            }
        }

        let cursor;

        try {
            console.log(query);
            cursor = users.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { usersList: [], totalNumusers: 0};
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page);

        try {
            const usersList = await displayCursor.toArray();
            const totalNumusers = await users.countDocuments(query)

            return { usersList, totalNumusers}
        } catch (error) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { usersList: [], totalNumusers: 0};
        }
    }

    // ToDo: Add nameModif property with the Id of the loged in user
    static async addUser(
        name,
        lastname,
        dni,
        birthday,
        email,
        idVehiculo,
        address,
        phone,
        idSex,
        internBool,
        idRol,
        pwd,
    ) {
        try {
            const userDoc = {
                name: name,
                lastname: lastname,
                dni: dni,
                birthday: birthday,
                email: email,
                idVehiculo: idVehiculo,
                address: address,
                phone: phone,
                idSex: idSex,
                internBool: internBool,
                idRol: idRol,
                pwd: pwd,
                FechaUltModif: new Date(),
                IdUsuarioModif: 0,
                TipoModif: modTypeCreate,
            };

            return await users.insertOne(userDoc);
        } catch (e) {
            console.error(`Unable to post users: ${e}`);
            return { error: e };
        }
    }

    static async updateUser (
        name,
        lastname,
        dni,
        birthday,
        email,
        idVehiculo,
        address,
        phone,
        idSex,
        internBool,
        idRol,
        pwd,
    ) {
        try {
            const upcontentResponse = await users.updateOne(
                { _id: ObjectId(userId) },
                { $set: { 
                    name: name,
                    lastname: lastname,
                    dni: dni,
                    birthday: birthday,
                    email: email,
                    idVehiculo: idVehiculo,
                    address: address,
                    phone: phone,
                    idSex: idSex,
                    internBool: internBool,
                    idRol: idRol,
                    pwd: pwd,
                    contentUltModif: new content(),
                    TipoModif: modTypeModif,
                    }
                },
            );

            return upcontentResponse;
        } catch (e) {
            console.error(`Unable to upcontent users: ${e}`);
            return { error: e };
        }
    }

    static async deleteUser (userId) {
        try {
            const deleteResponse = await users.deleteOne({
                _id: ObjectId(userId),
            });

            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete user: ${e}`);
            return { error: e };
        }
    }

}