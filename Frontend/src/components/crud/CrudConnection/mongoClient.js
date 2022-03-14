const { MongoClient } = require('mongodb');

// mongodb+srv://dantegrizia:39910308@sarcluster.1sxkc.mongodb.net/test?authSource=admin&replicaSet=atlas-qcj654-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
const uri = "mongodb+srv://dantegrizia:39910308@sarcluster.1sxkc.mongodb.net/test?retryWrites=true&w=majority";

async function main(){
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster

        await client.connect();
 
        // Make the appropriate DB calls
        await listDatabases(client);
        await findOneListingByName(client, "IdUsuario", "1");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function findOneListingByName(client, name, nameOfListing) {
    const params = {
        [name]: nameOfListing,
    };

    // const results = await client.db("SARDB").collection("InscriptionsClases").find();
    
    // Find sin parametros o findMany te devuelven un cursor
    const cursor = await client.db("SARDB").collection("InscriptionsClases").find();
    // El cursor se puede transformar asi directo a un array
    // const results = await cursor.toArray();
    const results = await cursor.toArray();
    return results;

    // Consulto si el array tiene items adentro
    // if (results.length > 0) {
    //     console.log(`Found listing(s):`);
    //     // Itero sobre esos items para ir recorriendolos uno por uno y poder mostrarlos
    //     results.forEach((result, i) => {
    //         console.log('Inscripcion:', result);
    //     });
    // } else {
    //     console.log(`No listings found`);
    // }

    // const result = await client.db("SARDB").collection("InscriptionsClases").findOne(params);
    // if (results) {
    //     console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
    //     console.log(Object.keys(results));
    // } else {
    //     console.log(`No listings found with the name '${nameOfListing}'`);
    // }
}

module.exports = {
	findOneListingByName,
};