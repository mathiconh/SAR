import express from "express"
import cors from "cors"
import inscriptions from "./api/inscriptions/inscriptions.route.js"
import champions from "./api/champions/champions.route.js"
import clases from './api/clases/clases.route.js'
import prices from './api/prices/prices.route.js'
import cars from './api/cars/cars.route.js'
import users from './api/users/users.route.js'



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/SAR", inscriptions, champions, clases, prices, cars, users);
app.use("*", (req, res) => res.status(404).json({ error: "not found"}));

export default app;
