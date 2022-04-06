import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import InscriptionsDAO from "./dao/inscriptions/inscriptionsDAO.js"
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(
    process.env.SARDB_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useUnifiedTopology: true
    }
    ).catch(err => {
        console.error(err.stack);
        process.exit(1);
    }).then(async client => {
        await InscriptionsDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    });

