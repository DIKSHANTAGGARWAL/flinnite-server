import "reflect-metadata"
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";


import AppDataSource from "./config";
import { userRoutes } from './auth/routes';
import { engageRoutes } from "./engage/routes";

const app = express()
app.use(express.json());


app.use(
    cors({
        origin: "*",
    })
);

dotenv.config();


app.use("/auth", userRoutes)
app.use("/engage", engageRoutes)


const port = 5000;

AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err: any) => console.log("error", err));
