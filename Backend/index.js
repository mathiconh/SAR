import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import InscriptionsDAO from "./dao/inscriptions/inscriptionsDAO.js"
import ChampionsDAO from "./dao/champions/championsDAO.js"
import ClasesDAO from "./dao/clases/clasesDAO.js"
import PricesDAO from "./dao/prices/pricesDAO.js";
import CarsDAO from "./dao/cars/carsDAO.js";
import UsersDAO from "./dao/users/usersDAO.js";



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
        await ChampionsDAO.injectDB(client);
        await ClasesDAO.injectDB(client);
        await PricesDAO.injectDB(client);
        await CarsDAO.injectDB(client);
        await UsersDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    });

