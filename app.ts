import "reflect-metadata"
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";


// require('./db/config')
import AppDataSource from "./config";

// import { productRoutes } from './products/routes';
// import { paymentRoutes } from './payment/routes';
import { userRoutes } from './auth/routes';

const app = express()
app.use(express.json());
// app.use(cors())
// app.use(express.urlencoded({ extended: false }));


app.use(
    cors({
        origin: "*",
    })
);

dotenv.config();


app.use("/", userRoutes)


const port = 5000;

AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err: any) => console.log("error", err));
