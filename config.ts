import { DataSource } from "typeorm";
import Tables from "./entities";
import dotenv from "dotenv";
dotenv.config()
const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    url: process.env.DATABASE_URL,
    entities: Tables,
    synchronize: true,
    // logging: true
});

export default AppDataSource;
